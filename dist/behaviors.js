const reaction = (id, caption, message, duration = 2200) => ({ id, caption, message, duration });
const behaviors = {
  capybara: {
    tap: [reaction('capy-stretch', 'Biiiig stretch.', 'Mochi stretches their little paws. Being cozy is hard work.'), reaction('capy-wiggle', 'Happy ears!', 'Mochi wiggles their ears just for you.'), reaction('capy-doze', 'Just resting my eyes…', 'Mochi settles into a tiny, very contented nap.', 2800)],
    idle: [reaction('capy-doze', 'Just five more minutes…', 'Mochi is having a little snooze.', 2800), reaction('capy-wiggle', 'A happy little wiggle.', 'Mochi wiggles their ears.')],
    sip: [reaction('capy-love', 'A sip and a smile.', 'Mochi sends you a warm little thank-you.')],
  },
  otter: {
    tap: [reaction('otter-toss', 'My favorite pebble!', 'Pebble tosses their favorite stone and catches it again.'), reaction('otter-wave', 'Oh, hello you!', 'Pebble gives you a cheerful little paw wave.'), reaction('otter-roll', 'Life is better afloat.', 'Pebble rocks from side to side, perfectly happy.')],
    idle: [reaction('otter-toss', 'One very good pebble.', 'Pebble is playing with their favorite stone.'), reaction('otter-roll', 'Floating through life.', 'Pebble enjoys a gentle float.')],
    sip: [reaction('otter-splash', 'A tiny celebration!', 'Pebble celebrates your drink with a happy splash.')],
  },
  frog: {
    tap: [reaction('frog-hop', 'A little hop for you!', 'Clover does a tiny happy hop.'), reaction('frog-croak', 'Ribbit. ♡', 'Clover puffs up for a little, silent ribbit.'), reaction('frog-blink', 'Hello, lovely human.', 'Clover gives you a slow, friendly blink.')],
    idle: [reaction('frog-blink', 'Taking it all in.', 'Clover blinks peacefully at the spring.'), reaction('frog-croak', 'A quiet little ribbit.', 'Clover has a little croak to themself.')],
    sip: [reaction('frog-bubbles', 'Sip, sip. Ribbit!', 'Clover blows a few happy little bubbles.')],
  },
};

export function chooseBehavior(animal, trigger, index = 0) {
  const entries = (behaviors[animal] || behaviors.capybara)[trigger] || behaviors.capybara.tap;
  return entries[Math.abs(Math.trunc(index)) % entries.length];
}

export function tapOptions(animal) {
  const labels = { capybara: ['Stretch', 'Ear wiggle', 'Snooze'], otter: ['Toss pebble', 'Wave hello', 'Rock & float'], frog: ['Happy hop', 'Ribbit', 'Slow blink'] };
  const id = Object.hasOwn(labels, animal) ? animal : 'capybara';
  return labels[id].map((label, index) => ({ label, index, id: behaviors[id].tap[index].id }));
}

export function createCompanionController({ show, isVisible = () => true, reducedMotion = () => false, schedule = setTimeout, cancel = clearTimeout }) {
  let animal = null;
  let idleTimer;
  let endTimer;
  const counts = new Map();
  function clear() { cancel(idleTimer); cancel(endTimer); idleTimer = endTimer = undefined; show(null); }
  function planIdle() {
    if (!animal || reducedMotion() || !isVisible()) return;
    idleTimer = schedule(() => react('idle'), 12000 + Math.random() * 6000);
  }
  function react(trigger = 'tap', selectedIndex) {
    if (!animal || !isVisible()) return null;
    clear();
    const key = `${animal}:${trigger}`;
    const index = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? selectedIndex : counts.get(key) || 0;
    counts.set(key, index + 1);
    const result = chooseBehavior(animal, trigger, index);
    if (!reducedMotion()) {
      show(result);
      endTimer = schedule(() => { show(null); planIdle(); }, result.duration);
    }
    return result;
  }
  function attach(nextAnimal) { clear(); animal = nextAnimal; planIdle(); }
  return { attach, react };
}
