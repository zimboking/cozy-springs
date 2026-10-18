import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseBehavior, createCompanionController } from '../dist/behaviors.js';

test('each companion has three distinct tap reactions that cycle without repeating', () => {
  for (const animal of ['capybara', 'otter', 'frog']) {
    const reactions = [0, 1, 2, 3].map(n => chooseBehavior(animal, 'tap', n));
    assert.equal(new Set(reactions.slice(0, 3).map(r => r.id)).size, 3);
    assert.equal(reactions[0].id, reactions[3].id);
    assert.ok(reactions.every(r => r.message && r.duration <= 3000));
  }
  assert.notEqual(chooseBehavior('capybara', 'tap', 0).id, chooseBehavior('otter', 'tap', 0).id);
});
test('idle and sip reactions are animal-specific and unknown animals are safe', () => {
  for (const animal of ['capybara', 'otter', 'frog']) {
    assert.notEqual(chooseBehavior(animal, 'idle', 0).id, chooseBehavior(animal, 'idle', 1).id);
    assert.ok(chooseBehavior(animal, 'sip').message);
  }
  assert.equal(chooseBehavior('unknown', 'tap', 0).id, chooseBehavior('capybara', 'tap', 0).id);
});

test('choosing a tap reaction plays it and the following tap continues from there', () => {
  const controller = createCompanionController({ show: () => {}, schedule: () => 0, cancel: () => {} });
  controller.attach('capybara');
  assert.equal(controller.react('tap', 2).id, 'capy-doze');
  assert.equal(controller.react('tap').id, 'capy-stretch');
  assert.equal(controller.react('tap', 1).id, 'capy-wiggle');
  assert.equal(controller.react('tap').id, 'capy-doze');
});
test('controller cancels old reactions on scene replacement and respects reduced motion', () => {
  let reduced = false;
  let active = true;
  let queue = [];
  const effects = [];
  const controller = createCompanionController({
    reducedMotion: () => reduced,
    isVisible: () => active,
    schedule: (fn, ms) => { const job = { fn, ms }; queue.push(job); return job; },
    cancel: job => { queue = queue.filter(x => x !== job); },
    show: r => effects.push(r?.id || null),
  });
  controller.attach('frog');
  assert.equal(queue.length, 1);
  controller.react('tap');
  assert.equal(effects.at(-1), 'frog-hop');
  controller.attach(null);
  assert.equal(queue.length, 0);
  reduced = true;
  controller.attach('otter');
  assert.equal(queue.length, 0);
  const result = controller.react('tap');
  assert.ok(result.message);
  assert.equal(effects.at(-1), null);
  reduced = false;
  active = false;
  controller.attach('capybara');
  assert.equal(queue.length, 0);
  assert.equal(controller.react('idle'), null);
});
