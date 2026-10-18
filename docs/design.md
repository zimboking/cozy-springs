# Cozy Springs, iteration one

Approved direction: mobile-first hydration app with capybara, otter and frog companions, a responsive retreat, fast editable drink logging, saved history, and permanent decorations. Working title: Cozy Springs. No social simulation or wellness expansion.

Visual thesis: warm paper, sage ink and painted shapes make a quiet bathhouse feel welcoming. Typography uses a rounded system sans for utility and Georgia for gentle editorial headings. Green identifies actions; peach belongs to the animals. ENERGY 2 / RHYTHM 2 / MOTION 2. Scene shading communicates water depth, rather than decorating controls.

Content: Today contains daily progress, the interactive spring, quick logging and recent drinks. Journal contains seven real local calendar days and editable drink history. Retreat contains companion selection and earned decorations. Settings contains daily goal and display units.

Interaction: water ripples respond to logging; animals bob and react to taps; dialogs open quickly and restore keyboard focus. Reduced motion is respected. No animation blocks logging.

Data: versioned localStorage, validated on read. Millilitres are canonical; display supports ml and US fl oz. Daily progress uses local calendar dates. Goals are user-set, not medical advice. Rewards are awarded once per completed day and remain after edits or missed days. Overflow earns no extra reward. No seeded activity. Data remains in this browser; no accounts or sync.

Implementation plan: (1) Write and run failing domain tests for date boundaries, validation, unit conversion, capped rewards, persistence and editing. (2) Implement pure domain functions in dist/model.js. (3) Build semantic views in dist/app.js with SVG art in dist/art.js and responsive styles. (4) Run node tests and syntax checks; browser-test logging, edits, deletion/undo, reload, settings, pets, decorations, empty history, keyboard dialogs and mobile overflow. (5) Package and privately publish with Sites.
