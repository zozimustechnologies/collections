#!/usr/bin/env node
// Generates all store assets using Puppeteer.
// Usage: node screenshot.js

import puppeteer from 'puppeteer';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const OUT = resolve(__dirname, 'storeassets');
const file = (name) => 'file://' + resolve(__dirname, 'storeassets', name);

async function shot(page, htmlFile, width, height, outName, dpr = 3) {
  await page.setViewport({ width, height, deviceScaleFactor: dpr });
  await page.goto(file(htmlFile), { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: resolve(OUT, outName),
    clip: { x: 0, y: 0, width, height },
  });
  console.log(`✓  ${outName}  (${width * dpr}×${height * dpr} @ ${dpr}x)`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Extension logo — 300×300
  await shot(page, 'logo-300x300.html', 300, 300, 'extensionlogo.png');

  // Small promotional tile — 440×280
  await shot(page, 'tile-440x280.html', 440, 280, 'smallpromotionaltile.png');

  // Large promotional tile — 1400×560
  await shot(page, 'tile-1400x560.html', 1400, 560, 'largepromotionaltile.png');

  // Screenshot 1280×800 — collections list view
  await shot(page, 'preview-list.html', 1280, 800, 'screenshot-1280x800.png');

  // Screenshot 640×400 — collection detail view
  await shot(page, 'preview-detail.html', 640, 400, 'screenshot-640x400.png');

  await browser.close();
  console.log('\nAll store assets saved to storeassets/');
})();