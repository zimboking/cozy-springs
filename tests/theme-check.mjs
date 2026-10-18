import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Signature/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
try {
  await page.goto('http://127.0.0.1:4173');
  const toggle = page.getByRole('button', { name: 'Dark mode', exact: true });
  await toggle.waitFor({ timeout: 3000 });
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
  await toggle.focus();
  await page.keyboard.press('Space');
  assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('[data-quick="water"]').click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('.drink-row').count(), 1);
  await mkdir('output/playwright', { recursive: true });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const tab of ['today', 'journal', 'retreat']) {
      await page.locator(`[data-tab="${tab}"]`).filter({ visible: true }).first().click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await page.locator('[data-tab="today"]').filter({ visible: true }).first().click();
    await page.screenshot({ path: `output/playwright/dark-${width}.png`, fullPage: true });
  }
  await page.locator('[data-action="custom"]').filter({ visible: true }).first().click();
  assert.equal(await page.locator('dialog').evaluate(el => getComputedStyle(el).colorScheme), 'dark');
  await page.keyboard.press('Escape');
  await toggle.click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.reload();
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
  await page.evaluate(() => localStorage.removeItem('cozy-springs-theme'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  assert.deepEqual(errors, []);
  console.log('PASS: keyboard toggle, persisted preference, hydration retained, system preference, live system changes, dark dialogs, three views at 320/390/1440px, no page errors.');
} finally { await browser.close(); }
