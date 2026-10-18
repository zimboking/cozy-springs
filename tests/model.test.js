import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, hydrate, dayKey, addDrink, editDrink, removeDrink, totalForDay, weekDays, setGoal, toMl, displayAmount } from '../dist/model.js';

const now = new Date(2026, 9, 18, 12, 30).getTime();
test('starts empty with a companion and no fabricated history', () => {
  const s = initialState();
  assert.equal(s.drinks.length, 0);
  assert.equal(totalForDay(s, dayKey(now)), 0);
  assert.deepEqual(s.earnedDays, []);
});
test('uses local dates including midnight and year boundaries', () => {
  assert.equal(dayKey(new Date(2026, 0, 1, 0, 1)), '2026-01-01');
  assert.equal(dayKey(new Date(2025, 11, 31, 23, 59)), '2025-12-31');
  const days = weekDays(new Date(2026, 0, 2));
  assert.equal(days[0], '2025-12-27');
  assert.equal(days[6], '2026-01-02');
});
test('logs real amounts and excludes other days', () => {
  let s = addDrink(initialState(), { type: 'water', amount: 250, time: now });
  s = addDrink(s, { type: 'tea', amount: 200, time: now - 86400000 });
  assert.equal(totalForDay(s, dayKey(now)), 250);
  assert.equal(s.drinks.length, 2);
});
test('rejects invalid amounts, types, timestamps and goals', () => {
  for (const amount of [-1, 0, NaN, Infinity, 5001]) assert.throws(() => addDrink(initialState(), { type: 'water', amount, time: now }));
  assert.throws(() => addDrink(initialState(), { type: '<script>', amount: 200, time: now }));
  assert.throws(() => addDrink(initialState(), { type: 'water', amount: 200, time: NaN }));
  for (const goal of [0, 99, 10001, Infinity]) assert.throws(() => setGoal(initialState(), goal));
});
test('earns once per completed day, never for extra volume, and keeps memories after editing', () => {
  let s = addDrink(initialState(), { type: 'water', amount: 2000, time: now });
  s = addDrink(s, { type: 'water', amount: 1000, time: now });
  assert.deepEqual(s.earnedDays, [dayKey(now)]);
  s = removeDrink(s, s.drinks[0].id);
  assert.equal(s.earnedDays.length, 1);
});
test('edits and removes the intended drink without mutating previous state', () => {
  const before = addDrink(initialState(), { type: 'water', amount: 250, time: now });
  const after = editDrink(before, before.drinks[0].id, { type: 'coffee', amount: 180, time: now });
  assert.equal(before.drinks[0].amount, 250);
  assert.equal(after.drinks[0].amount, 180);
  assert.equal(after.drinks[0].type, 'coffee');
  assert.equal(removeDrink(after, after.drinks[0].id).drinks.length, 0);
  assert.throws(() => editDrink(after, 'missing', { type: 'water', amount: 200, time: now }));
});
test('restores valid saves but recovers corrupt or unknown versions', () => {
  const s = addDrink(initialState(), { type: 'water', amount: 250, time: now });
  assert.deepEqual(hydrate(JSON.stringify(s)), s);
  for (const raw of ['invalid', 'null', '{"version":99}', '{"version":1,"drinks":{}}']) assert.deepEqual(hydrate(raw), initialState());
  assert.equal(hydrate(JSON.stringify({ ...s, animal: '<script>', goal: -2 })).animal, 'capybara');
  assert.equal(hydrate(JSON.stringify({ ...s, drinks: [{ type: 'water', amount: -1 }] })).drinks.length, 0);
});
test('converts US fluid ounces without changing canonical storage', () => {
  assert.equal(toMl(8, 'oz'), 237);
  assert.equal(displayAmount(250, 'ml'), '250');
  assert.equal(displayAmount(250, 'oz'), '8.5');
});
