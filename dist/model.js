export const DRINKS = { water: 'Water', tea: 'Tea', coffee: 'Coffee', other: 'Other drink' };
export const ANIMALS = { capybara: { name: 'Mochi', species: 'Capybara', note: 'A little slower. A little softer.', detail: 'An expert in doing absolutely nothing. Loves warm water and a towel on the head.' }, otter: { name: 'Pebble', species: 'Otter', note: 'A little splash of happiness.', detail: 'A playful floating companion. Collects smooth stones and enjoys a good splash.' }, frog: { name: 'Clover', species: 'Frog', note: 'Small sips. Happy little hops.', detail: 'Your quiet pond friend. Happiest on a lily pad, listening to the water.' } };
export const DECORATIONS = [{ id: 'bamboo', name: 'Bamboo fountain', days: 0, description: 'A gentle trickle for your spring.' }, { id: 'lilies', name: 'Water lilies', days: 1, description: 'A little bloom for your first goal day.' }, { id: 'lanterns', name: 'Paper lanterns', days: 3, description: 'A warm glow after three goal days.' }, { id: 'duck', name: 'Bath-time duck', days: 7, description: 'A tiny visitor after seven goal days.' }];
export const STORAGE_KEY = 'cozy-springs-v1';
export function initialState() { return { version: 1, goal: 2000, unit: 'ml', animal: 'capybara', drinks: [], earnedDays: [], decorations: ['bamboo'] }; }
export function dayKey(time = Date.now()) { const d = new Date(time); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function weekDays(time = Date.now()) { const d = new Date(time); d.setHours(12, 0, 0, 0); return Array.from({ length: 7 }, (_, i) => { const n = new Date(d); n.setDate(n.getDate() - 6 + i); return dayKey(n); }); }
export function totalForDay(state, key) { return state.drinks.filter(d => dayKey(d.time) === key).reduce((s, d) => s + d.amount, 0); }
function validDrink(d) { return d && Object.hasOwn(DRINKS, d.type) && Number.isFinite(d.amount) && d.amount >= 1 && d.amount <= 5000 && Number.isFinite(d.time) && d.time >= 0 && d.time <= Date.now() + 60000; }
function checkedDrink(d) { if (!validDrink(d)) throw new Error('Choose a drink, an amount from 1 to 5,000 ml, and a time that is not in the future.'); return { type: d.type, amount: Math.round(d.amount), time: d.time }; }
function award(state, key) { return totalForDay(state, key) >= state.goal && !state.earnedDays.includes(key) ? { ...state, earnedDays: [...state.earnedDays, key] } : state; }
export function addDrink(state, drink) { const d = checkedDrink(drink); return award({ ...state, drinks: [...state.drinks, { ...d, id: globalThis.crypto.randomUUID() }] }, dayKey(d.time)); }
export function editDrink(state, id, drink) { const d = checkedDrink(drink); if (!state.drinks.some(x => x.id === id)) throw new Error('That drink could not be found.'); return award({ ...state, drinks: state.drinks.map(x => x.id === id ? { ...d, id } : x) }, dayKey(d.time)); }
export function removeDrink(state, id) { return { ...state, drinks: state.drinks.filter(d => d.id !== id) }; }
export function setGoal(state, goal) { if (!Number.isFinite(goal) || goal < 100 || goal > 10000) throw new Error('Choose a daily goal from 100 to 10,000 ml.'); return { ...state, goal: Math.round(goal) }; }
export function toMl(amount, unit) { return Math.round(unit === 'oz' ? amount * 29.5735295625 : amount); }
export function displayAmount(amount, unit) { return unit === 'oz' ? (amount / 29.5735295625).toFixed(1) : Math.round(amount).toLocaleString('en-US'); }
export function hydrate(raw) {
  const base = initialState();
  try {
    const s = JSON.parse(raw);
    if (s?.version !== 1 || !Array.isArray(s.drinks)) return base;
    const earnedDays = Array.isArray(s.earnedDays) ? [...new Set(s.earnedDays.filter(x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)))] : [];
    const seen = new Set();
    const drinks = s.drinks.filter(d => { if (!validDrink(d) || typeof d.id !== 'string' || seen.has(d.id)) return false; seen.add(d.id); return true; }).map(d => ({ id: d.id, type: d.type, amount: Math.round(d.amount), time: d.time }));
    return { version: 1, goal: Number.isFinite(s.goal) && s.goal >= 100 && s.goal <= 10000 ? Math.round(s.goal) : base.goal, unit: s.unit === 'oz' ? 'oz' : 'ml', animal: Object.hasOwn(ANIMALS, s.animal) ? s.animal : base.animal, drinks, earnedDays, decorations: Array.isArray(s.decorations) ? [...new Set(s.decorations.filter(id => DECORATIONS.some(d => d.id === id && d.days <= earnedDays.length)))] : base.decorations };
  } catch { return base; }
}
