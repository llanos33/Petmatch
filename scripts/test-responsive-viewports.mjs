import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const frontendDir = path.join(root, 'frontend');
const distDir = path.join(frontendDir, 'dist');
const distIndex = path.join(distDir, 'index.html');
const host = '127.0.0.1';
const previewPort = Number(process.env.RESPONSIVE_PREVIEW_PORT || 4173);
const chromePort = Number(process.env.RESPONSIVE_CHROME_PORT || 9223);
const baseUrl = `http://${host}:${previewPort}`;

const routes = [
  '/',
  '/category/Alimentos',
  '/category/Juguetes',
  '/cart',
  '/login',
  '/register',
  '/premium',
  '/consultations',
  '/pets/new',
  '/buscar?q=alimento',
  '/servicios',
  '/blog',
];

const viewports = [
  { name: 'mobile-sm', width: 360, height: 740 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
];

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  return candidates.find(candidate => fs.existsSync(candidate));
}

async function waitForUrl(url, timeoutMs = 20000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Keep waiting.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
  }[extension] || 'application/octet-stream';
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', baseUrl);
    const decodedPath = decodeURIComponent(url.pathname);
    const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath;
    const filePath = path.normalize(path.join(distDir, requestedPath));
    const isInsideDist = filePath.startsWith(path.normalize(distDir));
    const finalPath = isInsideDist && fs.existsSync(filePath) && fs.statSync(filePath).isFile()
      ? filePath
      : distIndex;

    res.setHeader('Content-Type', getContentType(finalPath));
    fs.createReadStream(finalPath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(previewPort, host, () => resolve(server));
  });
}

async function waitForJson(url, timeoutMs = 20000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {
      // Keep waiting.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function createCdpClient(wsUrl) {
  if (typeof WebSocket === 'undefined') {
    throw new Error('This test requires Node.js with global WebSocket support.');
  }

  let id = 0;
  const pending = new Map();
  const ws = new WebSocket(wsUrl);

  ws.addEventListener('message', async event => {
    let data = event.data;
    if (data instanceof ArrayBuffer) {
      data = Buffer.from(data).toString('utf8');
    } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
      data = await data.text();
    } else if (Buffer.isBuffer(data)) {
      data = data.toString('utf8');
    }

    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  return {
    async send(method, params = {}) {
      await ready;
      const messageId = ++id;
      ws.send(JSON.stringify({ id: messageId, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(messageId, { resolve, reject });
        setTimeout(() => {
          if (pending.has(messageId)) {
            pending.delete(messageId);
            reject(new Error(`CDP command timed out: ${method}`));
          }
        }, 15000);
      });
    },
    async close() {
      await ready.catch(() => {});
      ws.close();
    },
  };
}

async function runViewportCheck(client, route, viewport) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 768,
  });
  await client.send('Page.navigate', { url: `${baseUrl}${route}` });
  await new Promise(resolve => setTimeout(resolve, 1800));

  const result = await client.send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const doc = document.documentElement;
      const body = document.body;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const overflowX = Math.max(doc.scrollWidth, body.scrollWidth) - viewportWidth;
      const visibleElements = Array.from(document.querySelectorAll('body *'))
        .filter((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            rect.width > 1 &&
            rect.height > 1 &&
            rect.bottom > 0 &&
            rect.top < viewportHeight;
        });
      const offenders = visibleElements
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === 'string' ? el.className.slice(0, 120) : '',
            text: (el.innerText || el.alt || '').replace(/\\s+/g, ' ').trim().slice(0, 80),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        })
        .filter((item) => item.left < -2 || item.right > viewportWidth + 2)
        .slice(0, 8);
      const brokenImages = Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src)
        .slice(0, 5);
      return {
        title: document.title,
        path: location.pathname + location.search,
        viewportWidth,
        scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
        overflowX,
        offenders,
        brokenImages,
      };
    })()`,
  });

  return result.result.value;
}

async function main() {
  if (!fs.existsSync(distIndex)) {
    throw new Error('frontend/dist does not exist. Run npm.cmd run build first.');
  }

  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error('Chrome or Edge was not found. Set CHROME_PATH to run responsive checks.');
  }

  const preview = await startStaticServer();
  const chromeUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'petmatch-responsive-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--disable-crash-reporter',
    '--disable-breakpad',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${chromeUserDataDir}`,
    `--remote-debugging-port=${chromePort}`,
    'about:blank',
  ], { stdio: 'ignore', windowsHide: true });

  const failures = [];
  let client;

  try {
    await waitForUrl(baseUrl);
    const version = await waitForJson(`http://${host}:${chromePort}/json/version`);
    client = createCdpClient(version.webSocketDebuggerUrl);
    await client.send('Target.createTarget', { url: 'about:blank' });
    const pages = await waitForJson(`http://${host}:${chromePort}/json/list`);
    const page = pages.find(target => target.type === 'page');
    await client.close();
    client = createCdpClient(page.webSocketDebuggerUrl);
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    for (const viewport of viewports) {
      for (const route of routes) {
        const check = await runViewportCheck(client, route, viewport);
        const hasOverflow = check.overflowX > 2 && check.offenders.length > 0;
        const hasBrokenImages = check.brokenImages.length > 0;
        const ok = !hasOverflow && !hasBrokenImages;

        console.log(`${ok ? 'PASS' : 'FAIL'} ${viewport.name} ${viewport.width}x${viewport.height} ${route}`);
        if (!ok) {
          failures.push({ viewport, route, check });
          if (hasOverflow) {
            console.log(`  overflowX=${check.overflowX}px`);
            for (const offender of check.offenders) {
              console.log(`  offender=${offender.tag}.${offender.className} right=${offender.right} text="${offender.text}"`);
            }
          }
          if (hasBrokenImages) {
            console.log(`  brokenImages=${check.brokenImages.join(', ')}`);
          }
        }
      }
    }
  } finally {
    await client?.close().catch(() => {});
    preview.close();
    chrome.kill();
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} responsive viewport checks failed.`);
    process.exit(1);
  }

  console.log('\nAll responsive viewport checks passed.');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
