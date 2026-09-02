import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const app = fs.readFileSync(path.join(root, 'frontend', 'src', 'App.jsx'), 'utf8');
const header = fs.readFileSync(path.join(root, 'frontend', 'src', 'components', 'Header.jsx'), 'utf8');
const indexCss = fs.readFileSync(path.join(root, 'frontend', 'src', 'index.css'), 'utf8');
const headerCss = fs.readFileSync(path.join(root, 'frontend', 'src', 'components', 'Header.css'), 'utf8');

const checks = [
  {
    name: 'App stores theme preference in localStorage',
    ok: app.includes("THEME_STORAGE_KEY = 'petmatch_theme_v1'") &&
      app.includes('window.localStorage.getItem(THEME_STORAGE_KEY)') &&
      app.includes('window.localStorage.setItem(THEME_STORAGE_KEY, theme)'),
  },
  {
    name: 'App respects system dark preference on first load',
    ok: app.includes("matchMedia?.('(prefers-color-scheme: dark)')"),
  },
  {
    name: 'App writes data-theme and color-scheme to document root',
    ok: app.includes('document.documentElement.dataset.theme = theme') &&
      app.includes('document.documentElement.style.colorScheme = theme'),
  },
  {
    name: 'Header exposes an accessible theme toggle',
    ok: header.includes('theme-toggle') &&
      header.includes('aria-label=') &&
      header.includes('Activar modo oscuro') &&
      header.includes('Activar modo claro') &&
      header.includes('Moon') &&
      header.includes('Sun'),
  },
  {
    name: 'Dark theme defines semantic variables',
    ok: indexCss.includes(':root[data-theme="dark"]') &&
      indexCss.includes('--bg-main:') &&
      indexCss.includes('--bg-card:') &&
      indexCss.includes('--text-main:') &&
      indexCss.includes('--input-bg:'),
  },
  {
    name: 'Dark theme covers app surfaces, cards, forms and tables',
    ok: indexCss.includes('.main-content') &&
      indexCss.includes('[class*="card"]') &&
      indexCss.includes('input,') &&
      indexCss.includes('textarea') &&
      indexCss.includes('table,'),
  },
  {
    name: 'Theme toggle is styled responsively',
    ok: headerCss.includes('.theme-toggle') &&
      headerCss.includes('@media (max-width: 600px)') &&
      headerCss.includes(':root[data-theme="dark"] .search-input'),
  },
];

const failed = checks.filter(check => !check.ok);

for (const check of checks) {
  console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} dark mode checks failed.`);
  process.exit(1);
}

console.log('\nAll dark mode checks passed.');
