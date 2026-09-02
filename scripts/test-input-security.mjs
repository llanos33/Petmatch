import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const serverPath = path.join(root, 'backend', 'server.js');
const server = fs.readFileSync(serverPath, 'utf8');

const checks = [
  {
    name: 'Security headers are configured',
    ok: server.includes("X-Content-Type-Options") &&
      server.includes("X-Frame-Options") &&
      server.includes("Permissions-Policy") &&
      server.includes("app.disable('x-powered-by')"),
  },
  {
    name: 'CORS uses an allowlist',
    ok: server.includes('allowedOrigins') &&
      server.includes('isAllowedOrigin') &&
      server.includes('Origen no permitido por CORS'),
  },
  {
    name: 'Request body size is limited',
    ok: server.includes("express.json({ limit: '5mb' })") &&
      server.includes("express.urlencoded({ limit: '5mb'"),
  },
  {
    name: 'Auth routes use rate limiting',
    ok: server.includes('function rateLimitAuth') &&
      server.includes("app.post('/api/auth/register', rateLimitAuth") &&
      server.includes("app.post('/api/auth/login', rateLimitAuth"),
  },
  {
    name: 'Auth validates email, password, phone and safe user output',
    ok: server.includes('function isValidEmail') &&
      server.includes('function isValidPassword') &&
      server.includes('safeUserResponse(newUser)') &&
      server.includes('safeUserResponse(user)') &&
      server.includes('Telefono invalido'),
  },
  {
    name: 'Product payload validates data types and allowed values',
    ok: server.includes('function buildProductPayload') &&
      server.includes('Categoria invalida') &&
      server.includes('Tipo de mascota invalido') &&
      server.includes('Precio debe ser') &&
      server.includes('Stock debe ser') &&
      server.includes('isValidUrl(result.image)'),
  },
  {
    name: 'Reviews validate product id, product existence, rating and comment',
    ok: server.includes('parseIdParam(req.params.id)') &&
      server.includes('const parsedRating = parsePositiveInt(rating)') &&
      server.includes('parsedRating > 5') &&
      server.includes('const cleanComment = cleanString(comment, 1000)') &&
      server.includes('Producto no encontrado'),
  },
  {
    name: 'Orders do not trust client prices, totals or discounts',
    ok: server.includes('const normalizedItems = []') &&
      server.includes('const resolvedPrice = Number(product.isOnSale && product.salePrice ? product.salePrice : product.price)') &&
      server.includes('const premiumDiscountValue = isPremiumUser ? Math.round(itemsTotal * 0.1) : 0') &&
      server.includes('const orderTotal = itemsTotal - premiumDiscountValue + shippingValue + paymentHandlingFee - couponValue') &&
      !server.includes("typeof item.price === 'number'") &&
      !server.includes("typeof total === 'number'"),
  },
  {
    name: 'Veterinarian verification validates certificate metadata and size',
    ok: server.includes('allowedCertificateTypes') &&
      server.includes('certificateFile.length > 3_000_000') &&
      server.includes('buffer.length > 2 * 1024 * 1024') &&
      server.includes('Extension de certificado no permitida') &&
      !server.includes('Error al procesar la solicitud:'),
  },
  {
    name: 'Pet forms validate ids, type, dates, weight and photo URL',
    ok: server.includes('function buildPetPayload') &&
      server.includes("['perro', 'gato'].includes(value)") &&
      server.includes('isValidDateString') &&
      server.includes('parseNonNegativeNumber(payload.weight)') &&
      server.includes('URL de foto invalida'),
  },
];

const failed = checks.filter(check => !check.ok);

for (const check of checks) {
  console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} security/input validation checks failed.`);
  process.exit(1);
}

console.log('\nAll input validation and security checks passed.');
