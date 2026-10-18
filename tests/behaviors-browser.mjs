import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Signature/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.clock.install();
await page.addInitScript(() => { Math.random = () => 0; });
await mkdir('output/playwright', { recursive: true });
try {
  await page.goto('http://127.0.0.1:4173');
  await page.locator('.scene-button').waitFor();
  await page.clock.runFor(12500);
  assert.equal(await page.locator('.scene-button').getAttribute('data-behavior'), 'capy-doze');
  const expected = { capybara: ['capy-stretch', 'capy-wiggle', 'capy-doze'], otter: ['otter-toss', 'otter-wave', 'otter-roll'], frog: ['frog-hop', 'frog-croak', 'frog-blink'] };
  for (const [animal, reactions] of Object.entries(expected)) {
    await page.locator('[data-action="companions"]').first().click();
    await page.locator(`[data-choose="${animal}"]`).click();
    await page.clock.runFor(350);
    const scene = page.locator('.scene-button');
    for (const id of reactions) {
      await scene.focus();
      await page.keyboard.press('Enter');
      assert.equal(await scene.getAttribute('data-behavior'), id);
      assert.ok(await scene.locator('.behavior-caption').innerText());
      assert.ok(await scene.locator('.animal-body').evaluate(el => el.getAnimations({ subtree: true }).length > 0));
      await page.clock.runFor(450);
      await page.screenshot({ path: `output/playwright/${id}.png` });
    }
    await page.locator('[data-quick="water"]').click();
    assert.equal(await scene.getAttribute('data-behavior'), ({ capybara: 'capy-love', otter: 'otter-splash', frog: 'frog-bubbles' })[animal]);
    await page.clock.runFor(2500);
    assert.equal(await scene.getAttribute('data-behavior'), null);
  }
  await page.setViewportSize({ width: 320, height: 844 });
  await page.locator('.scene-button').scrollIntoViewIfNeeded();
  await page.locator('.scene-button').click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.scene-button').click();
  assert.equal(await page.locator('.scene-button').getAttribute('data-behavior'), null);
  assert.ok((await page.locator('#toast').innerText()).includes('Clover'));
  assert.equal(await page.locator('.animal-body').first().evaluate(el => el.getAnimations({ subtree: true }).length), 0);
  await page.locator('[data-tab="journal"]').filter({ visible: true }).first().click();
  await page.clock.runFor(20000);
  assert.equal(await page.locator('.scene-button').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS: idle reaction, nine distinct keyboard tap reactions, three sip reactions, animation cleanup, phone width, reduced motion and navigation cleanup; no page errors.');
} finally { await browser.close(); }
