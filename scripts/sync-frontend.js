const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'frontend', 'dist');
const targetDir = path.resolve(__dirname, '..', 'backend', 'public');
const preservedEntries = new Set(['images']);

if (!fs.existsSync(distDir)) {
  console.error('No se encontró frontend/dist. Ejecuta "npm run build --prefix frontend" antes de sincronizar.');
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  for (const entry of fs.readdirSync(targetDir)) {
    if (preservedEntries.has(entry)) {
      continue;
    }
    fs.rmSync(path.join(targetDir, entry), { recursive: true, force: true });
  }
}

/**
 * Copia recursivamente los archivos de src a dest sin eliminar contenido existente.
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(distDir, targetDir);

console.log('Frontend build copiado a backend/public.');
