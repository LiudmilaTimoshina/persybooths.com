const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(resolve(__dirname, '../src/modules/headerV2.js'), 'utf8')
  .replace("import { gsap } from 'gsap';", 'const gsap = {};')
  .replace('export function initHeaderV2()', 'function initHeaderV2()');

function environment(path = '/nl/truths-about-booths/durability', inline = '') {
  const state = { bottom: 145, scroll: 0, base: 122, font: 16, queries: 0, frame: null, observers: 0 };
  const props = new Map(inline ? [['padding-top', inline]] : []);
  const padding = {
    style: {
      getPropertyValue: key => props.get(key) || '',
      getPropertyPriority: () => '',
      setProperty: (key, value) => props.set(key, value),
      removeProperty: key => props.delete(key),
    },
    getBoundingClientRect: () => ({ top: -state.scroll }),
  };
  const crumbs = {
    getClientRects: () => [1],
    getBoundingClientRect: () => ({ bottom: state.bottom - state.scroll }),
  };
  const component = { dataset: {}, parentElement: { querySelector: () => crumbs } };
  const root = {};
  const mobile = { matches: true, addEventListener() {} };
  const context = vm.createContext({
    location: { pathname: path },
    document: {
      documentElement: root,
      querySelector() { state.queries++; return padding; },
    },
    window: { addEventListener() {} },
    matchMedia: () => mobile,
    getComputedStyle: node => node === root
      ? { fontSize: state.font + 'px' }
      : { paddingTop: props.get('padding-top') || state.base + 'px' },
    requestAnimationFrame(fn) { state.frame = fn; return 1; },
    ResizeObserver: class {
      constructor(fn) { state.observers++; state.resize = fn; }
      observe() {}
    },
  });
  vm.runInContext(source, context);
  context.component = component;
  const init = () => vm.runInContext('initArticleBreadcrumbSpacing(component)', context);
  const flush = () => { const fn = state.frame; state.frame = null; if (fn) fn(); };
  return { state, props, component, mobile, init, flush };
}

test('wrapped breadcrumbs reserve a full text-size gap above article metadata', () => {
  for (const prefix of ['', '/de', '/fr', '/nl']) {
    const e = environment(prefix + '/truths-about-booths/durability');
    e.init(); e.flush();
    assert.equal(e.props.get('padding-top'), '161px');
  }
});

test('a later wrap increase and decrease are recalculated from authored padding', () => {
  const e = environment(); e.init(); e.flush();
  e.state.bottom = 180; e.state.resize(); e.flush();
  assert.equal(e.props.get('padding-top'), '196px');
  e.state.bottom = 120; e.state.resize(); e.flush();
  assert.equal(e.props.get('padding-top'), '136px');
});

test('existing larger hero spacing is preserved', () => {
  const e = environment(); e.state.base = 220; e.init(); e.flush();
  assert.equal(e.props.has('padding-top'), false);
});

test('desktop restores the original inline value', () => {
  const e = environment(undefined, '100px'); e.init(); e.flush();
  e.mobile.matches = false; e.state.resize(); e.flush();
  assert.equal(e.props.get('padding-top'), '100px');
});

test('scrolling does not change the spacing calculation', () => {
  const e = environment(); e.state.scroll = 1200; e.init(); e.flush();
  assert.equal(e.props.get('padding-top'), '161px');
});

test('gap follows font size rather than a language-specific constant', () => {
  const e = environment(); e.state.font = 20; e.init(); e.flush();
  assert.equal(e.props.get('padding-top'), '165px');
});

test('unrelated pages do not query or change their content', () => {
  const e = environment('/products/persy-one'); e.init(); e.flush();
  assert.equal(e.state.queries, 0);
  assert.equal(e.props.size, 0);
});

test('repeated initialization does not attach duplicate observers', () => {
  const e = environment(); e.init(); e.init(); e.flush();
  assert.equal(e.state.observers, 1);
});
