const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(resolve(__dirname, '../src/modules/headerV2.js'), 'utf8')
  .replace("import { gsap } from 'gsap';", 'const gsap = {};')
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

test('production and unrelated hosts do not read or mutate the DOM', () => {
  for (const host of ['www.persybooths.com', 'www.persybooths.co.uk', 'other.webflow.io']) {
    const env = environment(host, []);
    env.init();
    assert.equal(env.queries(), 0);
    assert.equal(env.context.window.PersyHeaderV2, undefined);
  }
});

for (const host of ['persybooths-uk.webflow.io', 'persybooths-com-a171e119102a6875fb6aff4.webflow.io']) {
  test(`${host}: legacy pages receive no component listeners`, () => {
    const env = environment(host, []);
    env.init();
    assert.equal(env.queries(), 1);
    assert.equal(env.context.window.PersyHeaderV2.version, '1.1.0-staging');
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
