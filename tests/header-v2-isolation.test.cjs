const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(resolve(__dirname, '../src/modules/headerV2.js'), 'utf8')
  .replace("import { gsap } from 'gsap';", 'const gsap = window.testGsap || {};')
  .replace('export function initHeaderV2()', 'function initHeaderV2()');

function environment(hostname, roots) {
  let domQueries = 0;
  const context = vm.createContext({
    location: { hostname },
    document: {
      querySelectorAll(selector) {
        domQueries++;
        assert.equal(selector, 'header[data-pb-header="v2"]');
        return roots;
      },
    },
    window: {},
  });
  vm.runInContext(source, context);
  return { context, queries: () => domQueries, init: () => vm.runInContext('initHeaderV2()', context) };
}

test('unrelated hosts do not read or mutate the DOM', () => {
  for (const host of ['other.webflow.io', 'example.com', 'other.canvas.webflow.com', 'persybooths-uk.canvas.webflow.com.example.com']) {
    const env = environment(host, []);
    env.init();
    assert.equal(env.queries(), 0);
    assert.equal(env.context.window.PersyHeaderV2, undefined);
  }
});

test('compact menu closes when a desktop breakpoint event arrives after returning to compact width', () => {
  class Element extends EventTarget {
    attributes = new Map();
    style = {};

    setAttribute(name, value) { this.attributes.set(name, value); }
    getAttribute(name) { return this.attributes.get(name); }
    contains() { return false; }
  }

  const compact = new EventTarget();
  compact.matches = true;
  const trigger = new Element();
  const panel = new Element();
  const overlay = new Element();
  const menu = new Element();
  menu.querySelector = selector => selector.includes('overlay') ? overlay : panel;
  menu.getBoundingClientRect = () => ({ height: 0 });
  const component = {
    dataset: {},
    querySelector: selector => selector.startsWith('.mobile-menu') ? menu : {
      querySelector: () => trigger,
    },
  };
  const window = new EventTarget();
  window.testGsap = { killTweensOf() {}, to() {}, fromTo() {} };
  const document = new EventTarget();
  document.documentElement = { lang: 'en', style: { overflow: 'auto' } };
  document.body = { style: { overflow: '' } };
  const context = vm.createContext({
    component, window, document,
    matchMedia: query => query.includes('1280px') ? compact : { matches: false },
  });
  vm.runInContext(source + '\ninitMenu(component);', context);

  trigger.dispatchEvent(new Event('click'));
  window.dispatchEvent(new Event('resize'));
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(document.body.style.overflow, 'hidden');

  // The event recorded entry into desktop before the viewport changed back.
  compact.dispatchEvent(Object.assign(new Event('change'), { matches: false }));
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(menu.getAttribute('aria-hidden'), 'true');
  assert.equal(menu.inert, true);
  assert.equal(menu.style.display, 'none');
  assert.equal(document.documentElement.style.overflow, 'auto');
  assert.equal(document.body.style.overflow, '');

  trigger.dispatchEvent(new Event('click'));
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  compact.matches = false;
  window.dispatchEvent(new Event('resize'));
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(document.body.style.overflow, '');
});

for (const host of ['www.persybooths.com', 'persybooths.com', 'www.persybooths.co.uk', 'persybooths.co.uk', 'persybooths-uk.webflow.io', 'persybooths-com-a171e119102a6875fb6aff4.webflow.io', 'persybooths-com-a171e119102a6875fb6aff4.canvas.webflow.com', 'persybooths-uk.canvas.webflow.com']) {
  test(`${host}: legacy pages receive no component listeners`, () => {
    const env = environment(host, []);
    env.init();
    assert.equal(env.queries(), 1);
    assert.equal(env.context.window.PersyHeaderV2.version, '1.2.1-preview.1');
  });

  test(`${host}: reinitializing a ready component does not add handlers`, () => {
    const root = {
      dataset: { pbV2MenuReady: '1', pbV2LocaleReady: '1', pbV2EscapeReady: '1', pbV2A11yReady: '1' },
      querySelector() { throw new Error('Ready component must not be initialized twice'); },
      addEventListener() { throw new Error('Duplicate listener'); },
    };
    const env = environment(host, [root]);
    env.init();
    env.init();
    assert.equal(env.queries(), 2);
  });
}
