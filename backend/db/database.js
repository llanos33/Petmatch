import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL no esta configurada. Configura la conexion de Supabase/PostgreSQL antes de iniciar el backend.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
});

const store = {
  products: [],
  orders: [],
  invoices: [],
  users: [],
  reviews: [],
  consultations: [],
  coupons: [],
  pets: [],
  veterinarianRequests: [],
  siteContent: null,
};

const queues = {};

const clone = (value) => JSON.parse(JSON.stringify(value));
const asNumber = (value) => value === null || value === undefined ? value : Number(value);
const asInt = (value) => value === null || value === undefined ? value : Number.parseInt(value, 10);
const json = (value, fallback) => value === null || value === undefined ? fallback : value;

const productFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  name: row.name,
  description: row.description,
  price: asNumber(row.price),
  category: row.category,
  petType: row.pet_type,
  image: row.image,
  stock: asInt(row.stock) || 0,
  exclusive: !!row.exclusive,
  isOnSale: !!row.is_on_sale,
  ...(row.sale_price !== null ? { salePrice: asNumber(row.sale_price) } : {}),
  ...(row.created_at ? { createdAt: row.created_at.toISOString() } : {}),
  ...(row.updated_at ? { updatedAt: row.updated_at.toISOString() } : {}),
});

const userFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  name: row.name,
  email: row.email,
  password: row.password_hash,
  phone: row.phone,
  address: row.address,
  createdAt: row.created_at?.toISOString(),
  isPremium: !!row.is_premium,
  premiumSince: row.premium_since?.toISOString() || null,
  subscription: json(row.subscription, null),
  isAdmin: !!row.is_admin,
  isVeterinarian: !!row.is_veterinarian,
  isVerifiedVeterinarian: !!row.is_verified_veterinarian,
  veterinarianDetails: json(row.veterinarian_details, null),
  coupons: json(row.coupons, []),
  rejectedRequests: json(row.rejected_requests, []),
});

const orderFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  userId: row.user_id,
  items: json(row.items, []),
  customerInfo: json(row.customer_info, {}),
  total: asNumber(row.total),
  itemsTotal: asNumber(row.items_total),
  shippingCost: asNumber(row.shipping_cost),
  premiumDiscount: asNumber(row.premium_discount),
  couponDiscount: asNumber(row.coupon_discount),
  couponCode: row.coupon_code,
  status: row.status,
  date: row.order_date?.toISOString(),
});

const invoiceFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  invoiceNumber: row.invoice_number,
  orderId: row.order_id,
  userId: row.user_id,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  items: json(row.items, []),
  itemsTotal: asNumber(row.items_total),
  shippingCost: asNumber(row.shipping_cost),
  premiumDiscount: asNumber(row.premium_discount),
  couponDiscount: asNumber(row.coupon_discount),
  total: asNumber(row.total),
  status: row.status,
  issuedAt: row.issued_at?.toISOString(),
  paymentMethod: row.payment_method,
});

const petFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  userId: row.user_id,
  name: row.name,
  type: row.type,
  breed: row.breed,
  birthDate: row.birth_date?.toISOString?.().slice(0, 10) || row.birth_date,
  gender: row.gender,
  weight: asNumber(row.weight),
  photo: row.photo,
  medicalInfo: json(row.medical_info, {}),
  preferences: json(row.preferences, {}),
  activityLevel: row.activity_level,
  specialNeeds: row.special_needs,
  createdAt: row.created_at?.toISOString(),
  updatedAt: row.updated_at?.toISOString(),
});

const consultationFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  userId: row.user_id,
  userName: row.user_name,
  title: row.title,
  question: row.question,
  petType: row.pet_type,
  petId: row.pet_id,
  petName: row.pet_name,
  petPhoto: row.pet_photo,
  createdAt: row.created_at?.toISOString(),
  status: row.status,
  answer: row.answer,
  answeredAt: row.answered_at?.toISOString() || null,
  answeredBy: row.answered_by,
  answeredByType: row.answered_by_type,
  answeredByUserId: row.answered_by_user_id,
});

const reviewFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  productId: row.product_id,
  userId: row.user_id,
  userName: row.user_name,
  rating: row.rating,
  comment: row.comment,
  date: row.review_date?.toISOString(),
});

const vetRequestFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: row.id,
  userId: row.user_id,
  userName: row.user_name,
  userEmail: row.user_email,
  professionalLicense: row.professional_license,
  licenseNumber: row.license_number,
  clinic: row.clinic,
  specialties: row.specialties,
  certificatePath: row.certificate_path,
  certificateFileName: row.certificate_file_name,
  submittedAt: row.submitted_at?.toISOString(),
  status: row.status,
  reviewedAt: row.reviewed_at?.toISOString(),
  reviewedBy: row.reviewed_by,
  rejectedAt: row.rejected_at?.toISOString(),
  rejectionReason: row.rejection_reason,
});

const couponFromRow = (row) => ({
  ...(row.raw_data || {}),
  id: Number(row.id),
  code: row.code,
  type: row.type,
  discountPercent: asNumber(row.discount_percent),
  issuedAt: row.issued_at?.toISOString(),
  monthKey: row.month_key,
  redeemed: !!row.redeemed,
  usedAt: row.used_at?.toISOString(),
});

const siteContentFromRow = (row) => ({
  ...(row.content || {}),
  updatedAt: row.updated_at?.toISOString() || row.content?.updatedAt || null,
});

export async function initializeDatabase() {
  const [
    products,
    orders,
    invoices,
    users,
    reviews,
    consultations,
    coupons,
    pets,
    vetRequests,
    siteContent,
  ] = await Promise.all([
    pool.query('select * from products order by id'),
    pool.query('select * from orders order by id'),
    pool.query('select * from invoices order by id'),
    pool.query('select * from users order by id'),
    pool.query('select * from reviews order by id'),
    pool.query('select * from consultations order by id'),
    pool.query('select * from coupons order by id'),
    pool.query('select * from pets order by id'),
    pool.query('select * from veterinarian_requests order by id'),
    pool.query("select * from site_content where id = 'main'"),
  ]);

  store.products = products.rows.map(productFromRow);
  store.orders = orders.rows.map(orderFromRow);
  store.invoices = invoices.rows.map(invoiceFromRow);
  store.users = users.rows.map(userFromRow);
  store.reviews = reviews.rows.map(reviewFromRow);
  store.consultations = consultations.rows.map(consultationFromRow);
  store.coupons = coupons.rows.map(couponFromRow);
  store.pets = pets.rows.map(petFromRow);
  store.veterinarianRequests = vetRequests.rows.map(vetRequestFromRow);
  store.siteContent = siteContent.rows[0] ? siteContentFromRow(siteContent.rows[0]) : null;
}

async function syncRows(table, rows, insertSql, mapParams, deletedIds = []) {
  const client = await pool.connect();
  try {
    await client.query('begin');
    for (const row of rows) {
      await client.query(insertSql, mapParams(row));
    }
    for (const id of deletedIds) {
      await client.query(`delete from ${table} where id = $1`, [id]);
    }
    await client.query(`select setval(pg_get_serial_sequence('${table}', 'id'), coalesce((select max(id) from ${table}), 1), true)`);
    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

const persist = (table, previousRows, rows, insertSql, mapParams) => {
  const currentIds = new Set(rows.map((row) => row.id));
  const deletedIds = previousRows.map((row) => row.id).filter((id) => !currentIds.has(id));

  queues[table] = (queues[table] || Promise.resolve())
    .then(() => syncRows(table, rows, insertSql, mapParams, deletedIds))
    .catch((error) => {
      console.error(`Error persistiendo ${table} en PostgreSQL:`, error);
    });
};

const withUpsert = (table, columns) => {
  const values = columns.map((_, index) => `$${index + 1}`).join(',');
  const updates = columns.filter((column) => column !== 'id').map((column) => `${column} = excluded.${column}`).join(', ');
  return `insert into ${table} (${columns.join(', ')}) values (${values}) on conflict (id) do update set ${updates}`;
};

export const readProducts = () => clone(store.products);
export const readOrders = () => clone(store.orders);
export const readInvoices = () => clone(store.invoices);
export const readUsers = () => clone(store.users);
export const readReviews = () => clone(store.reviews);
export const readConsultations = () => clone(store.consultations);
export const readCoupons = () => clone(store.coupons);
export const readPets = () => clone(store.pets);
export const readVeterinarianRequests = () => clone(store.veterinarianRequests);
export const readSiteContent = () => clone(store.siteContent);

export function writeProducts(products) {
  const previous = store.products;
  store.products = clone(products);
  persist('products', previous, store.products, withUpsert('products', ['id', 'name', 'description', 'price', 'category', 'pet_type', 'image', 'stock', 'exclusive', 'is_on_sale', 'sale_price', 'created_at', 'updated_at', 'raw_data']), (p) => [
    p.id, p.name, p.description, p.price, p.category, p.petType, p.image, p.stock || 0, !!p.exclusive, !!p.isOnSale, p.salePrice ?? null, p.createdAt || null, p.updatedAt || null, p,
  ]);
}

export function writeUsers(users) {
  const previous = store.users;
  store.users = clone(users);
  persist('users', previous, store.users, withUpsert('users', ['id', 'name', 'email', 'password_hash', 'phone', 'address', 'created_at', 'is_premium', 'premium_since', 'subscription', 'is_admin', 'is_veterinarian', 'is_verified_veterinarian', 'veterinarian_details', 'coupons', 'rejected_requests', 'raw_data']), (u) => [
    u.id, u.name, u.email, u.password, u.phone || null, u.address || null, u.createdAt || null, !!u.isPremium, u.premiumSince || null, u.subscription || {}, !!u.isAdmin, !!u.isVeterinarian, !!u.isVerifiedVeterinarian, u.veterinarianDetails || {}, u.coupons || [], u.rejectedRequests || [], u,
  ]);
}

export function writeOrders(orders) {
  const previous = store.orders;
  store.orders = clone(orders);
  persist('orders', previous, store.orders, withUpsert('orders', ['id', 'user_id', 'items', 'customer_info', 'total', 'items_total', 'shipping_cost', 'premium_discount', 'coupon_discount', 'coupon_code', 'status', 'order_date', 'raw_data']), (o) => [
    o.id, o.userId || null, o.items || [], o.customerInfo || {}, o.total || 0, o.itemsTotal || 0, o.shippingCost || 0, o.premiumDiscount || 0, o.couponDiscount || 0, o.couponCode || null, o.status || 'pendiente', o.date || null, o,
  ]);
}

export function writeInvoices(invoices) {
  const previous = store.invoices;
  store.invoices = clone(invoices);
  persist('invoices', previous, store.invoices, withUpsert('invoices', ['id', 'invoice_number', 'order_id', 'user_id', 'customer_name', 'customer_email', 'items', 'items_total', 'shipping_cost', 'premium_discount', 'coupon_discount', 'total', 'status', 'issued_at', 'payment_method', 'raw_data']), (i) => [
    i.id, i.invoiceNumber, i.orderId || null, i.userId || null, i.customerName || null, i.customerEmail || null, i.items || [], i.itemsTotal || 0, i.shippingCost || 0, i.premiumDiscount || 0, i.couponDiscount || 0, i.total || 0, i.status || 'emitida', i.issuedAt || null, i.paymentMethod || null, i,
  ]);
}

export function writeReviews(reviews) {
  const previous = store.reviews;
  store.reviews = clone(reviews);
  persist('reviews', previous, store.reviews, withUpsert('reviews', ['id', 'product_id', 'user_id', 'user_name', 'rating', 'comment', 'review_date', 'raw_data']), (r) => [
    r.id, r.productId || null, r.userId || null, r.userName || null, r.rating, r.comment || null, r.date || null, r,
  ]);
}

export function writeConsultations(consultations) {
  const previous = store.consultations;
  store.consultations = clone(consultations);
  persist('consultations', previous, store.consultations, withUpsert('consultations', ['id', 'user_id', 'user_name', 'title', 'question', 'pet_type', 'pet_id', 'pet_name', 'pet_photo', 'created_at', 'status', 'answer', 'answered_at', 'answered_by', 'answered_by_type', 'answered_by_user_id', 'raw_data']), (c) => [
    c.id, c.userId || null, c.userName || null, c.title, c.question, c.petType || null, c.petId || null, c.petName || null, c.petPhoto || null, c.createdAt || null, c.status || 'pending', c.answer || null, c.answeredAt || null, c.answeredBy || null, c.answeredByType || null, c.answeredByUserId || null, c,
  ]);
}

export function writeCoupons(coupons) {
  const previous = store.coupons;
  store.coupons = clone(coupons);
  persist('coupons', previous, store.coupons, withUpsert('coupons', ['id', 'code', 'type', 'discount_percent', 'issued_at', 'month_key', 'redeemed', 'used_at', 'raw_data']), (c) => [
    c.id, c.code || null, c.type || null, c.discountPercent || null, c.issuedAt || null, c.monthKey || null, !!(c.redeemed || c.used), c.usedAt || null, c,
  ]);
}

export function writePets(pets) {
  const previous = store.pets;
  store.pets = clone(pets);
  persist('pets', previous, store.pets, withUpsert('pets', ['id', 'user_id', 'name', 'type', 'breed', 'birth_date', 'gender', 'weight', 'photo', 'medical_info', 'preferences', 'activity_level', 'special_needs', 'created_at', 'updated_at', 'raw_data']), (p) => [
    p.id, p.userId || null, p.name, p.type || null, p.breed || null, p.birthDate || null, p.gender || null, p.weight || null, p.photo || null, p.medicalInfo || {}, p.preferences || {}, p.activityLevel || null, p.specialNeeds || null, p.createdAt || null, p.updatedAt || null, p,
  ]);
}

export function writeVeterinarianRequests(requests) {
  const previous = store.veterinarianRequests;
  store.veterinarianRequests = clone(requests);
  persist('veterinarian_requests', previous, store.veterinarianRequests, withUpsert('veterinarian_requests', ['id', 'user_id', 'user_name', 'user_email', 'professional_license', 'license_number', 'clinic', 'specialties', 'certificate_path', 'certificate_file_name', 'submitted_at', 'status', 'reviewed_at', 'reviewed_by', 'rejected_at', 'rejection_reason', 'raw_data']), (r) => [
    r.id, r.userId || null, r.userName || null, r.userEmail || null, r.professionalLicense || null, r.licenseNumber || null, r.clinic || null, r.specialties || null, r.certificatePath || null, r.certificateFileName || null, r.submittedAt || null, r.status || 'pending', r.reviewedAt || null, r.reviewedBy || null, r.rejectedAt || null, r.rejectionReason || null, r,
  ]);
}

export function writeSiteContent(content) {
  store.siteContent = clone(content);
  pool.query(
    "insert into site_content (id, content, updated_at) values ('main', $1, $2) on conflict (id) do update set content = excluded.content, updated_at = excluded.updated_at",
    [store.siteContent, store.siteContent.updatedAt || new Date().toISOString()]
  ).catch((error) => {
    console.error('Error persistiendo site_content en PostgreSQL:', error);
  });
}
