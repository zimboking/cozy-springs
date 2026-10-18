const key = 'cozy-springs-theme';
const system = matchMedia('(prefers-color-scheme: dark)');
let preference;
try { preference = localStorage.getItem(key); } catch { /* A theme still works when browser storage is blocked. */ }
if (!['light', 'dark'].includes(preference)) preference = null;
export function getTheme() { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }
function apply(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#1b241f' : '#f8f7f2';
  document.dispatchEvent(new Event('themechange'));
}
export function toggleTheme() {
  preference = getTheme() === 'dark' ? 'light' : 'dark';
  apply(preference);
  try { localStorage.setItem(key, preference); return true; } catch { return false; }
}
system.addEventListener('change', () => { if (!preference) apply(system.matches ? 'dark' : 'light'); });
window.addEventListener('storage', e => {
  if (e.key !== key && e.key !== null) return;
  preference = ['light', 'dark'].includes(e.newValue) ? e.newValue : null;
  apply(preference || (system.matches ? 'dark' : 'light'));
});
apply(preference || (system.matches ? 'dark' : 'light'));
