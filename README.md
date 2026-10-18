# Cozy Springs

Live app: https://zimboking.github.io/cozy-springs/

This is a separate repository for the Cozy Springs pivot. The original `zimboking/Water-habit-app-2` repository remains unchanged.

## GitHub Pages

Pushes to `main` run the hydration tests and syntax checks, then deploy the static `dist/` directory through GitHub Actions. In repository Settings → Pages, the publishing source is GitHub Actions. No hosting keys or secrets are needed.

Progress is saved separately for each website origin. History on the earlier private preview stays there and does not automatically transfer to GitHub Pages.

The next iteration of CapySpa: a mobile-first hydration companion with three animated animal friends, an illustrated spring, editable drink history, and permanent retreat decorations.

## Run locally

Requires Node.js 20 or newer. No runtime dependencies or package installation required.

```sh
npm start
```

Open http://127.0.0.1:4173. Run `npm test` for domain tests and `npm run check` for JavaScript syntax validation. `dist/` is ready for static hosting.

## Included

- Capybara Mochi, otter Pebble and frog Clover, available from the start.
- Three tap reactions per companion, occasional idle moments, and a celebration when you log a drink. Tap the spring repeatedly to see different reactions. No sound plays. Behaviors pause off-screen, in dialogs and in background tabs; reduced-motion users still receive written tap responses.
- One-tap water, tea and coffee; custom drink volumes and dates; edit, delete and undo.
- User-set daily goal, millilitres or US fluid ounces, and real calendar-based history.
- Local browser persistence, day rollover, saved-data validation and multi-tab updates.
- Four retreat decorations, unlocked at 0, 1, 3 and 7 completed goal days. Rewards remain after edits and missed days. Extra volume earns no extra rewards. Adjusting the goal alone does not award a goal day.
- Keyboard-accessible native dialogs, reduced-motion styles and responsive layouts.
- Header dark-mode toggle, saved separately from hydration data. On a first visit the theme follows your device; the spring also changes to an evening palette.

## Boundaries

This version stores data in localStorage on this browser and origin. It has no sign-in, cloud synchronization, social features, push notifications, or offline service worker. Clearing site data removes history. The 2,000 ml starting goal is an editable default, not an individualized recommendation. Drinks count by logged volume; no hydration ratios or health insights are inferred.

The application is built with native browser modules, CSS and original SVG illustrations. Google Fonts is optional; system fonts work when it is unavailable. The original CapySpa GitHub repository has not been modified.

## Browser verification

`tests/browser-check.mjs` runs real Chrome checks with Playwright. It uses the bundled Codex Playwright package on this machine; adapt the module and browser executable paths for another development environment. Screenshots are written to ignored `output/playwright/`.
