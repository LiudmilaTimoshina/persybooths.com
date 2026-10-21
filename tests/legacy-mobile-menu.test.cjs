const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(require('node:path').resolve(__dirname, '../src/index.js'), 'utf8')
  .split('function mobileMenuAnimation() {')[1].split('function indexStoryImagesParallax()')[0];

test('legacy menu survives repeated breakpoint entry without duplicate listeners or stale timers', () => {
  function element() {
    const events = new Map();
    return {
      textContent: 'Menu',
      addEventListener(type, fn) { if (!events.has(type)) events.set(type, new Set()); events.get(type).add(fn); },
      removeEventListener(type, fn) { events.get(type)?.delete(fn); },
      click() { for (const fn of events.get('click') || []) fn(); },
      count() { return events.get('click')?.size || 0; },
    };
  }
  const trigger = element(), overlay = element(), accordion = element();
  const menu = { querySelector: s => s.includes('overlay') ? overlay : {} };
  let enter, played = 0, reversed = 0, invalidated = 0, nextTimer = 0;
  const timers = new Map();
  const context = vm.createContext({
    document: {
      querySelector: s => s.includes('trigger') ? trigger : menu,
      querySelectorAll: () => [accordion],
    },
    setTimeout(fn) { timers.set(++nextTimer, fn); return nextTimer; },
    clearTimeout(id) { timers.delete(id); },
    gsap: {
      matchMedia: () => ({ add(query, callback) { assert.equal(query, '(max-width: 991px)'); enter = callback; } }),
      timeline: () => ({ fromTo() { return this; }, play() { played++; }, reverse() { reversed++; }, invalidate() { invalidated++; } }),
      set() {},
    },
  });
  vm.runInContext('function mobileMenuAnimation() {' + source + '\nmobileMenuAnimation();', context);
  for (let cycle = 0; cycle < 5; cycle++) {
    const exit = enter();
    assert.equal(trigger.count(), 1);
    assert.equal(overlay.count(), 1);
    assert.equal(accordion.count(), 1);
    trigger.click();
    assert.equal(trigger.textContent, 'Close');
    assert.equal(played, cycle * 2 + 1);
    overlay.click();
    assert.equal(trigger.textContent, 'Menu');
    assert.equal(reversed, cycle + 1);
    trigger.click(); // Exit while open must reset its label/state for next entry.
    accordion.click();
    assert.equal(timers.size, 1);
    exit();
    assert.equal(trigger.textContent, 'Menu');
    assert.equal(trigger.count() + overlay.count() + accordion.count(), 0);
    assert.equal(timers.size, 0);
    trigger.click();
    assert.equal(played, cycle * 2 + 2);
  }
  assert.equal(invalidated, 0);
});
