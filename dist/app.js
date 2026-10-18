import { ANIMALS, DRINKS, DECORATIONS, STORAGE_KEY, initialState, hydrate, dayKey, addDrink, editDrink, removeDrink, totalForDay, weekDays, setGoal, toMl, displayAmount } from './model.js';
import { icon, animalPortrait, scene } from './art.js?v=reactions-2';
import { getTheme, toggleTheme } from './theme.js';
import { createCompanionController, tapOptions } from './behaviors.js?v=reactions-2';

let storageAvailable = true;
let state;
try { state = hydrate(localStorage.getItem(STORAGE_KEY)); } catch { state = initialState(); storageAvailable = false; }
let tab = 'today';
let selectedDay = dayKey();
let lastDay = dayKey();
let toastTimer;
let returnFocus;
const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const toast = document.querySelector('#toast');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const companion = createCompanionController({
  reducedMotion: () => motionPreference.matches,
  isVisible: () => {
    const scene = app.querySelector('.scene-button');
    const rect = scene?.getBoundingClientRect();
    return !document.hidden && !dialog.open && rect && rect.bottom > 0 && rect.top < innerHeight;
  },
  show: behavior => {
    const scene = app.querySelector('.scene-button');
    if (!scene) return;
    if (behavior) { void scene.offsetWidth; scene.dataset.behavior = behavior.id; }
    else delete scene.dataset.behavior;
    const caption = scene.querySelector('.behavior-caption');
    if (caption) caption.textContent = behavior?.caption || '';
    app.querySelectorAll('[data-reaction]').forEach(button => button.classList.toggle('playing', button.dataset.behaviorId === behavior?.id));
  },
});
const sceneObserver = new IntersectionObserver(entries => {
  if (tab !== 'today') return;
  const scene = app.querySelector('.scene-button');
  const entry = entries.find(item => item.target === scene);
  if (!entry) return;
  if (!entry.isIntersecting || document.hidden) companion.attach(null);
  else if (!scene.dataset.behavior) companion.attach(state.animal);
});
motionPreference.addEventListener('change', () => companion.attach(tab === 'today' ? state.animal : null));
const unitLabel = () => state.unit === 'oz' ? 'fl oz' : 'ml';
const amount = n => `${displayAmount(n, state.unit)} <span class="unit">${unitLabel()}</span>`;
const safe = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dateLabel = (key, opts = {}) => new Date(`${key}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', ...opts });
const timeLabel = n => new Date(n).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
const pct = () => Math.min(100, Math.round(totalForDay(state, dayKey()) / state.goal * 100));
function notify(message, action) {
  clearTimeout(toastTimer);
  toast.innerHTML = `<span>${safe(message)}</span>${action ? '<button type="button">Undo</button>' : ''}`;
  toast.classList.add('visible');
  if (action) toast.querySelector('button').onclick = () => { action(); toast.classList.remove('visible'); };
  toastTimer = setTimeout(() => toast.classList.remove('visible'), action ? 10000 : 4500);
}
function save(next) {
  const focused = document.activeElement;
  const focusKey = focused?.dataset ? Object.entries(focused.dataset).find(([k]) => ['quick', 'animal', 'decor'].includes(k)) : null;
  state = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  render();
  if (focusKey) app.querySelector(`[data-${focusKey[0]}="${focusKey[1]}"]`)?.focus({ preventScroll: true });
  if (!storageAvailable) notify('Browser storage is unavailable. Changes will only last for this visit.');
}
function navButton(id, label, glyph) { return `<button class="nav-item ${tab === id ? 'active' : ''}" data-tab="${id}" ${tab === id ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${label}</span></button>`; }
function updateThemeToggle() {
  const button = app.querySelector('[data-action="theme"]');
  if (!button) return;
  const dark = getTheme() === 'dark';
  button.setAttribute('aria-pressed', String(dark));
  button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  button.innerHTML = icon(dark ? 'sun' : 'moon');
}
document.addEventListener('themechange', updateThemeToggle);
function render() {
  document.title = `${({ today: 'Your spring', journal: 'Your journal', retreat: 'Your retreat' })[tab]} · Cozy Springs`;
  app.innerHTML = `<div class="app-shell">
    <aside class="sidebar"><a href="#" class="brand" data-home><img src="./icon.svg" width="43" height="43" alt=""><span>cozy<span class="brand-second">springs</span></span></a><div class="sidebar-rule"></div><nav aria-label="Main navigation">${navButton('today', 'My spring', 'home')}${navButton('journal', 'Journal', 'journal')}${navButton('retreat', 'My retreat', 'leaf')}</nav><div class="sidebar-bottom"><div class="quiet-note">${icon('sun', 27)}<p>A little water.<br>A little wonder.</p></div><button class="nav-item" data-action="settings">${icon('settings')}<span>Settings</span></button><span class="version-label">YOUR LITTLE DAILY RETREAT</span></div></aside>
    <div class="workspace"><header class="topbar"><div class="mobile-brand"><img src="./icon.svg" alt="" width="34" height="34"><span>cozy springs</span></div><span class="desktop-breadcrumb">Your daily retreat <span>/</span> ${{ today: 'My spring', journal: 'Journal', retreat: 'My retreat' }[tab]}</span><div class="topbar-right"><span class="today-date">${new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span><button class="avatar" data-action="companions" aria-label="Choose your animal companion">${animalPortrait(state.animal, 36)}</button><button class="mobile-settings icon-button" data-action="settings" aria-label="Settings">${icon('settings')}</button></div></header>
    <main id="main" tabindex="-1">${!storageAvailable ? '<p class="storage-warning" role="alert">Saving is unavailable in this browser. Your progress will only last for this visit.</p>' : ''}${tab === 'today' ? todayView() : tab === 'journal' ? journalView() : retreatView()}</main>
    <footer class="page-footer"><span>${icon('leaf', 15)} Small sips, at your own pace.</span><span>Saved on this device</span></footer></div>
    <nav class="mobile-nav" aria-label="Mobile navigation">${navButton('today', 'My spring', 'home')}${navButton('journal', 'Journal', 'journal')}${navButton('retreat', 'My retreat', 'leaf')}</nav>
  </div>`;
  app.querySelector('.progress-inner strong')?.setAttribute('data-unit', unitLabel());
  app.querySelector('.topbar-right').insertAdjacentHTML('afterbegin', '<button class="theme-toggle icon-button" data-action="theme" aria-label="Dark mode" aria-pressed="false"></button>');
  updateThemeToggle();
  sceneObserver.disconnect();
  const spring = app.querySelector('.scene-button');
  if (spring) {
    spring.insertAdjacentHTML('beforeend', '<span class="behavior-caption" aria-hidden="true"></span>');
    app.querySelector('.companion-strip').insertAdjacentHTML('afterend', `<div class="companion-play" role="group" aria-label="Play with ${ANIMALS[state.animal].name}"><span>Play together</span><div>${tapOptions(state.animal).map(option => `<button type="button" data-reaction="${option.index}" data-behavior-id="${option.id}">${option.label}</button>`).join('')}</div></div>`);
    sceneObserver.observe(spring);
  }
  companion.attach(spring ? state.animal : null);
  if (!storageAvailable) app.querySelector('.page-footer>span:last-child').textContent = 'Saving unavailable';
}
function todayView() {
  const total = totalForDay(state, dayKey());
  const p = pct();
  const animal = ANIMALS[state.animal];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const next = DECORATIONS.find(d => d.days > state.earnedDays.length);
  return `<div class="page-heading"><div><div class="eyebrow">A MOMENT FOR YOU</div><h1>${greeting}, friend<span class="heading-dot">.</span></h1><p>Your little spring is happy to see you.</p></div><button class="text-button heading-settings" data-action="settings">${icon('settings', 17)} Daily goal</button></div>
  <div class="today-layout"><section class="spring-column" aria-label="Your spring">
    <div class="scene-panel"><div class="scene-caption"><span class="live-dot"></span> ${p >= 100 ? 'Full of little joys' : 'A peaceful little pause'}<span class="scene-weather">${icon('sun', 16)} Cozy, as always</span></div><button class="scene-button" data-action="pet" aria-label="Say hello to ${animal.name}">${scene(state.animal, p, state.decorations)}<span class="pet-hint">Tap to say hello</span></button><div class="companion-strip"><div class="companion-intro"><span class="small-portrait">${animalPortrait(state.animal, 46)}</span><div><strong>${animal.name} <span class="species">the ${animal.species.toLowerCase()}</span></strong><p>${animal.note}</p></div></div><button class="round-button" data-action="companions" aria-label="Change companion">${icon('chevron', 18)}</button></div></div>
    <section class="logging-section"><div class="section-heading"><h2>A sip for you</h2><button class="text-button" data-action="custom">Custom drink ${icon('plus', 16)}</button></div><div class="quick-drinks"><button class="quick-drink" data-quick="water"><span class="drink-symbol water">${icon('drop', 26)}</span><strong>Water</strong><span>${amount(250)}</span><span class="quick-plus">${icon('plus', 16)}</span></button><button class="quick-drink" data-quick="tea"><span class="drink-symbol tea">${icon('tea', 26)}</span><strong>Tea</strong><span>${amount(200)}</span><span class="quick-plus">${icon('plus', 16)}</span></button><button class="quick-drink" data-quick="coffee"><span class="drink-symbol coffee">${icon('cup', 26)}</span><strong>Coffee</strong><span>${amount(180)}</span><span class="quick-plus">${icon('plus', 16)}</span></button></div></section>
    <section class="recent-section"><div class="section-heading"><h2>Today's little sips</h2><button class="text-button" data-tab="journal">View journal ${icon('arrow', 16)}</button></div>${drinkList(dayKey(), 3)}</section>
  </section><aside class="daily-column" aria-label="Daily progress"><section class="progress-panel"><div class="section-heading"><h2>Today's hydration</h2><span class="tiny-icon">${icon('drop', 19)}</span></div><div class="progress-circle" style="--progress:${p * 3.6}deg" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="Daily hydration goal"><div class="progress-inner">${icon('drop', 23)}<strong>${displayAmount(total, state.unit)}</strong><span>of ${displayAmount(state.goal, state.unit)} ${unitLabel()}</span><b>${p}% of your goal</b></div></div><h3>${p >= 100 ? 'A lovely goal day.' : p > 0 ? 'Every little sip counts.' : 'A fresh start awaits.'}</h3><p>${p >= 100 ? 'Your spring is glowing. Enjoy the moment.' : total ? `${displayAmount(Math.max(0, state.goal - total), state.unit)} ${unitLabel()} to your daily goal. You have time.` : 'Your first sip is a lovely place to begin.'}</p><button class="primary-button" data-action="custom">${icon('plus', 19)} Log a drink</button><button class="goal-button" data-action="settings">Adjust daily goal</button></section>
    <section class="keepsake-panel"><span class="keepsake-symbol">${icon(next ? 'leaf' : 'heart', 26)}</span><div class="eyebrow">A LITTLE SOMETHING TO GROW</div><h3>${next ? next.name : 'A retreat of your own'}</h3><p>${next ? `Reach your goal on ${next.days} ${next.days === 1 ? 'day' : 'days'} to welcome ${next.id === 'lilies' ? 'a little bloom' : next.id === 'lanterns' ? 'a warm glow' : 'a tiny friend'} to your spring.` : 'All decorations are yours. Make yourself at home.'}</p><div class="reward-track"><span style="width:${next ? Math.min(100, state.earnedDays.length / next.days * 100) : 100}%"></span></div><div class="reward-label"><span>${state.earnedDays.length} goal ${state.earnedDays.length === 1 ? 'day' : 'days'}</span><button class="text-button" data-tab="retreat">My retreat ${icon('chevron', 14)}</button></div></section>
    <p class="gentle-note">${icon('heart', 17)} Your companion is always happy to see you. Even on the days you miss.</p>
  </aside></div>`;
}
function drinkList(key, limit = Infinity) {
  const drinks = state.drinks.filter(d => dayKey(d.time) === key).sort((a, b) => b.time - a.time).slice(0, limit);
  if (!drinks.length) return `<div class="empty-state">${icon('cup', 27)}<div><strong>No sips logged ${key === dayKey() ? 'yet' : 'this day'}.</strong><p>${key === dayKey() ? 'Have a drink? Add it when you’re ready.' : 'A quiet page in your journal. That’s okay.'}</p></div>${key === dayKey() ? '<button class="text-button" data-action="custom">Add a drink</button>' : ''}</div>`;
  return `<div class="drink-list">${drinks.map(d => `<div class="drink-row"><span class="drink-symbol ${d.type}">${icon(d.type === 'coffee' ? 'cup' : d.type === 'tea' ? 'tea' : 'drop', 20)}</span><div class="drink-row-name"><strong>${DRINKS[d.type]}</strong><span>${timeLabel(d.time)}</span></div><strong class="drink-amount">${amount(d.amount)}</strong><button class="icon-button" data-edit="${safe(d.id)}" aria-label="Edit ${DRINKS[d.type]} at ${timeLabel(d.time)}">${icon('edit', 17)}</button><button class="icon-button delete-button" data-delete="${safe(d.id)}" aria-label="Delete ${DRINKS[d.type]} at ${timeLabel(d.time)}">${icon('trash', 17)}</button></div>`).join('')}</div>`;
}
function journalView() {
  const days = weekDays();
  const weekTotal = days.reduce((s, k) => s + totalForDay(state, k), 0);
  return `<div class="page-heading"><div><div class="eyebrow">ONE DAY AT A TIME</div><h1>Your hydration journal<span class="heading-dot">.</span></h1><p>A small record of showing up for yourself.</p></div><button class="primary-button compact" data-action="custom">${icon('plus', 18)} Log a drink</button></div><section class="journal-chart"><div class="section-heading"><h2>The last seven days</h2><span class="muted">${amount(weekTotal)} logged</span></div><div class="chart-bars">${days.map(k => { const n = totalForDay(state, k); const height = Math.min(100, n / Math.max(state.goal, ...days.map(d => totalForDay(state, d))) * 100); return `<button class="day-bar ${k === selectedDay ? 'selected' : ''}" data-day="${k}" aria-pressed="${k === selectedDay}" aria-label="${dateLabel(k)}: ${displayAmount(n, state.unit)} ${unitLabel()}"><span class="bar-value">${displayAmount(n, state.unit)}</span><span class="bar-track"><span style="height:${Math.max(2, height)}%" class="${n === 0 ? 'zero' : ''}"></span></span><span class="day-name">${k === dayKey() ? 'Today' : dateLabel(k, { weekday: 'short', month: undefined, day: undefined })}</span><span class="day-number">${new Date(`${k}T12:00:00`).getDate()}</span></button>`; }).join('')}</div><p class="chart-note">Displayed against your current goal of ${displayAmount(state.goal, state.unit)} ${unitLabel()}.</p></section><section class="history-section"><div class="section-heading"><h2>${selectedDay === dayKey() ? 'Today' : dateLabel(selectedDay, { weekday: 'long' })}</h2><label class="date-picker">${icon('journal', 17)}<input type="date" aria-label="Choose journal date" id="journal-date" value="${selectedDay}" max="${dayKey()}"></label></div>${drinkList(selectedDay)}</section><div class="journal-summary"><div><strong>${state.drinks.length}</strong><span>drinks logged</span></div><div><strong>${state.earnedDays.length}</strong><span>goal days remembered</span></div><p>No perfect streak required.<br>Your progress has a home here.</p></div>`;
}
function retreatView() {
  return `<div class="page-heading"><div><div class="eyebrow">MAKE YOURSELF AT HOME</div><h1>A retreat of your own<span class="heading-dot">.</span></h1><p>A favorite friend. A few little things that feel like you.</p></div></div><section><div class="section-heading"><h2>Meet your companions</h2><span class="muted">All friends are welcome</span></div><div class="animal-grid">${Object.entries(ANIMALS).map(([id, a]) => `<button class="animal-card ${state.animal === id ? 'chosen' : ''}" data-animal="${id}" aria-pressed="${state.animal === id}"><span class="animal-card-art ${id}">${animalPortrait(id, 150)}</span><span class="animal-card-title">${a.name}${state.animal === id ? `<span class="selected-check">${icon('check', 15)}</span>` : ''}</span><span class="species-label">${a.species}</span><span class="animal-description">${a.detail}</span><span class="animal-choice">${state.animal === id ? 'Your companion' : 'Choose companion'}</span></button>`).join('')}</div></section><section class="decor-section"><div class="section-heading"><h2>Little comforts</h2><span class="muted">${state.earnedDays.length} goal days, fondly remembered</span></div><div class="decor-grid">${DECORATIONS.map(d => { const unlocked = d.days <= state.earnedDays.length; const enabled = state.decorations.includes(d.id); return `<button class="decor-item ${!unlocked ? 'locked' : ''}" data-decor="${d.id}" ${unlocked ? `aria-pressed="${enabled}"` : `aria-disabled="true"`}><span class="decor-art">${decorationArt(d.id)}</span><span class="decor-info"><strong>${d.name}</strong><span>${d.description}</span><b>${unlocked ? enabled ? 'In your spring' : 'Add to spring' : `${d.days} goal days to unlock`}</b></span><span class="decor-state">${icon(unlocked ? enabled ? 'check' : 'plus' : 'lock', 19)}</span></button>`; }).join('')}</div></section><p class="retreat-note">Your keepsakes stay yours, even if you miss a day. Extra drinks never speed up rewards.</p>`;
}
function decorationArt(id) { return `<svg viewBox="0 0 60 60" width="54" height="54" aria-hidden="true">${({ bamboo: '<path d="M39 48V16H19" fill="none" stroke="#879763" stroke-width="9" stroke-linecap="round"/><path d="M19 21v18" stroke="#8eb5ae" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/><ellipse cx="19" cy="45" rx="13" ry="5" fill="#b6cfc1"/>', lilies: '<ellipse cx="30" cy="43" rx="23" ry="10" fill="#8aab7c"/><path d="M17 35q-13-22 5-12 4-27 12-2 21-14 13 10-9 15-30 4" fill="#e6b8a9"/><circle cx="31" cy="32" r="5" fill="#e3bf6c"/>', lanterns: '<path d="M30 4v9m0 33v10" stroke="#867b57" stroke-width="2"/><rect x="15" y="13" width="30" height="34" rx="12" fill="#e8c48b"/><path d="M20 16v27m10-28v30m10-29v27" stroke="#c49c65" fill="none"/><path d="M23 12h14m-14 35h14" stroke="#867b57" stroke-width="3"/>', duck: '<ellipse cx="32" cy="38" rx="21" ry="14" fill="#e8bf61"/><circle cx="21" cy="23" r="12" fill="#efca70"/><path d="m10 23-9 5 12 3" fill="#c98a42"/><circle cx="20" cy="20" r="2" fill="#5b4b32"/><path d="M31 35q12-6 15 1" stroke="#caa14d" stroke-width="2" fill="none"/>' })[id]}</svg>`; }
function openDialog(content) {
  companion.attach(null);
  returnFocus = document.activeElement;
  dialog.innerHTML = `<button class="dialog-close icon-button" aria-label="Close dialog">${icon('close')}</button>${content}`;
  dialog.showModal();
  dialog.querySelector('.dialog-close').onclick = () => dialog.close();
}
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => {
  const active = document.activeElement;
  if (active === document.body || active === dialog || dialog.contains(active)) {
    if (returnFocus?.isConnected) returnFocus.focus(); else document.querySelector('#main')?.focus({ preventScroll: true });
  }
  if (tab === 'today' && !app.querySelector('.scene-button')?.dataset.behavior) companion.attach(state.animal);
});
function drinkDialog(drink) {
  const current = drink ? new Date(drink.time) : new Date();
  const date = dayKey(current);
  const time = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
  openDialog(`<div class="dialog-emblem">${icon('drop', 29)}</div><div class="eyebrow">EVERY LITTLE SIP COUNTS</div><h2 id="dialog-title">${drink ? 'Edit your drink' : 'A sip for you'}</h2><p class="dialog-subtitle">A little care, at your own pace.</p><form id="drink-form"><label for="drink-type">What did you drink?</label><select id="drink-type" name="type">${Object.entries(DRINKS).map(([id, label]) => `<option value="${id}" ${drink?.type === id ? 'selected' : ''}>${label}</option>`).join('')}</select><label for="drink-amount">Amount (${unitLabel()})</label><div class="amount-input"><input id="drink-amount" name="amount" type="number" inputmode="decimal" min="${state.unit === 'oz' ? '0.1' : '1'}" max="${state.unit === 'oz' ? '169' : '5000'}" step="${state.unit === 'oz' ? '0.1' : '1'}" value="${state.unit === 'oz' ? ((drink?.amount || 250) / 29.5735295625).toFixed(1) : drink?.amount || 250}" required><span>${unitLabel()}</span></div><div class="amount-presets">${[150, 250, 500].map(n => `<button type="button" data-amount="${n}">${displayAmount(n, state.unit)} ${unitLabel()}</button>`).join('')}</div><div class="form-columns"><div><label for="drink-date">Date</label><input type="date" id="drink-date" name="date" value="${date}" max="${dayKey()}" required></div><div><label for="drink-time">Time</label><input type="time" id="drink-time" name="time" value="${time}" required></div></div><p class="form-error" id="form-error" role="alert"></p><button class="primary-button" type="submit">${icon('check', 18)} ${drink ? 'Save changes' : 'Log this drink'}</button><p class="form-footnote">Drinks are recorded by volume. Your daily goal is yours to set.</p></form>`);
  dialog.querySelectorAll('[data-amount]').forEach(b => b.onclick = () => { dialog.querySelector('#drink-amount').value = state.unit === 'oz' ? (Number(b.dataset.amount) / 29.5735295625).toFixed(1) : b.dataset.amount; });
  dialog.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      const d = { type: form.get('type'), amount: toMl(Number(form.get('amount')), state.unit), time: new Date(`${form.get('date')}T${form.get('time')}`).getTime() };
      const earned = state.earnedDays.length;
      save(drink ? editDrink(state, drink.id, d) : addDrink(state, d));
      dialog.close();
      if (!drink) companion.react('sip');
      notify(!storageAvailable ? 'Logged for this visit. Browser storage is unavailable.' : state.earnedDays.length > earned ? 'A goal day to remember. Your retreat has a little something new.' : drink ? 'Drink updated.' : 'A little sip, a little care. Drink logged.');
    } catch (err) { dialog.querySelector('#form-error').textContent = err.message; }
  };
}
function settingsDialog() {
  openDialog(`<div class="dialog-emblem">${icon('settings', 28)}</div><h2 id="dialog-title">Make it your own</h2><p class="dialog-subtitle">A daily goal that works for you.</p><form id="settings-form"><label for="goal">Daily goal (${unitLabel()})</label><input id="goal" type="number" min="${state.unit === 'oz' ? 3.4 : 100}" max="${state.unit === 'oz' ? 338 : 10000}" step="${state.unit === 'oz' ? 0.1 : 1}" value="${state.unit === 'oz' ? (state.goal / 29.5735295625).toFixed(1) : state.goal}" required><label for="unit">Display units</label><select id="unit"><option value="ml" ${state.unit === 'ml' ? 'selected' : ''}>Millilitres (ml)</option><option value="oz" ${state.unit === 'oz' ? 'selected' : ''}>US fluid ounces (fl oz)</option></select><p class="settings-note">The goal above uses your current units (${unitLabel()}). Changing display units converts your existing amounts.</p><p class="form-error" id="form-error" role="alert"></p><button class="primary-button" type="submit">Save preferences</button></form><div class="privacy-note">${icon('lock', 17)}<p><strong>Your little corner stays yours.</strong><br>Progress is saved in this browser. No account or cloud sync. Clearing browser data removes your history.</p></div>`);
  dialog.querySelector('form').onsubmit = e => {
    e.preventDefault();
    try { const next = setGoal(state, toMl(Number(dialog.querySelector('#goal').value), state.unit)); next.unit = dialog.querySelector('#unit').value; save(next); dialog.close(); notify(storageAvailable ? 'Preferences saved. Your spring, your pace.' : 'Preferences changed for this visit only.'); }
    catch (err) { dialog.querySelector('#form-error').textContent = err.message; }
  };
}
function companionDialog() {
  openDialog(`<div class="eyebrow">A FRIEND FOR YOUR EVERYDAY</div><h2 id="dialog-title">Who's joining you?</h2><p class="dialog-subtitle">Different personalities. The same warm welcome.</p><div class="companion-options">${Object.entries(ANIMALS).map(([id, a]) => `<button data-choose="${id}" class="companion-option ${state.animal === id ? 'chosen' : ''}" aria-pressed="${state.animal === id}">${animalPortrait(id, 80)}<span><strong>${a.name}</strong><span>${a.species}</span></span>${state.animal === id ? icon('check', 19) : icon('chevron', 19)}</button>`).join('')}</div>`);
  dialog.querySelectorAll('[data-choose]').forEach(b => b.onclick = () => { save({ ...state, animal: b.dataset.choose }); dialog.close(); notify(`${ANIMALS[state.animal].name} is making themself at home.`); });
}
function setTab(next) { tab = next; render(); window.scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('#main').focus({ preventScroll: true }); }
app.addEventListener('click', e => {
  const b = e.target.closest('button, [data-home]');
  if (!b) return;
  if (b.hasAttribute('data-reaction')) {
    companion.attach(state.animal);
    const behavior = companion.react('tap', Number(b.dataset.reaction));
    if (behavior) notify(behavior.message);
    return;
  }
  if (b.dataset.action === 'theme') { if (!toggleTheme()) notify('Theme changed for this visit. Browser storage is unavailable.'); return; }
  if (b.hasAttribute('data-home')) { e.preventDefault(); setTab('today'); return; }
  if (b.dataset.tab) { setTab(b.dataset.tab); return; }
  if (b.dataset.quick) {
    const type = b.dataset.quick;
    const earned = state.earnedDays.length;
    const previousDrinks = state.drinks;
    save(addDrink(state, { type, amount: ({ water: 250, tea: 200, coffee: 180 })[type], time: Date.now() }));
    const addedId = state.drinks.find(d => !previousDrinks.some(x => x.id === d.id))?.id;
    companion.react('sip');
    notify(storageAvailable ? state.earnedDays.length > earned ? 'Goal reached. A little keepsake is waiting in your retreat.' : `${DRINKS[type]} logged. ${ANIMALS[state.animal].name} sends a happy little splash.` : 'Logged for this visit. Browser storage is unavailable.', () => save(removeDrink(state, addedId)));
    return;
  }
  if (b.dataset.edit) { const d = state.drinks.find(x => x.id === b.dataset.edit); if (d) drinkDialog(d); return; }
  if (b.dataset.delete) { const drink = state.drinks.find(x => x.id === b.dataset.delete); if (!drink) return; save(removeDrink(state, drink.id)); notify('Drink removed.', () => { if (!state.drinks.some(d => d.id === drink.id)) save({ ...state, drinks: [...state.drinks, drink] }); }); return; }
  if (b.dataset.animal) { save({ ...state, animal: b.dataset.animal }); notify(`${ANIMALS[state.animal].name} is your companion.`); return; }
  if (b.dataset.decor) { const d = DECORATIONS.find(x => x.id === b.dataset.decor); if (d.days > state.earnedDays.length) { notify(`${d.name} will be yours after ${d.days} goal days. No rush.`); return; } const on = state.decorations.includes(d.id); save({ ...state, decorations: on ? state.decorations.filter(x => x !== d.id) : [...state.decorations, d.id] }); notify(on ? `${d.name} tucked away.` : `${d.name} added to your spring.`); return; }
  if (b.dataset.day) { selectedDay = b.dataset.day; render(); return; }
  if (b.dataset.action === 'custom') drinkDialog();
  if (b.dataset.action === 'settings') settingsDialog();
  if (b.dataset.action === 'companions') companionDialog();
  if (b.dataset.action === 'pet') { companion.attach(state.animal); const behavior = companion.react('tap'); if (behavior) notify(behavior.message); }
});
app.addEventListener('change', e => { if (e.target.id === 'journal-date' && /^\d{4}-\d{2}-\d{2}$/.test(e.target.value) && e.target.value <= dayKey()) { selectedDay = e.target.value; render(); } });
function checkDay() { if (lastDay !== dayKey()) { lastDay = dayKey(); selectedDay = lastDay; render(); } }
setInterval(checkDay, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDay(); companion.attach(!document.hidden && tab === 'today' ? state.animal : null); });
window.addEventListener('storage', e => { if (e.key === STORAGE_KEY || e.key === null) { state = hydrate(e.key === null ? null : e.newValue); render(); } });
render();
