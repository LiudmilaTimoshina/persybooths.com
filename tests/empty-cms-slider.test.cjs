const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').resolve(__dirname, '../src/modules/sliders.js'), 'utf8');
const fn = source.slice(source.indexOf('export function productCompareSlider()'), source.indexOf('export function soundFeaturesSlider()')).replace('export ', '');
const blogFn = source.slice(source.indexOf('export function mobileKnowledgeBlogSlider()'), source.indexOf('export function knowledgePostGallerySlider()')).replace('export ', '');

test('the related-blog slider skips absent or empty CMS collections and initializes populated collections', () => {
  for (const state of ['absent', 'empty', 'populated']) {
    const target = state === 'absent' ? null : { querySelector: () => state === 'populated' ? {} : null };
    let calls = 0;
    const context = vm.createContext({
      document: { querySelector: () => target },
      Swiper: function () { calls++; },
    });
    vm.runInContext(blogFn + '\nmobileKnowledgeBlogSlider();', context);
    assert.equal(calls, state === 'populated' ? 1 : 0);
  }
});

test('an empty localized CMS target does not abort later valid sliders or site initialization', () => {
  const empty = { querySelector: () => null };
  const populated = { querySelector: () => ({}) };
  const initialized = [];
  const context = vm.createContext({
    document: { querySelectorAll: () => [empty, populated] },
    Swiper: function (target) { initialized.push(target); },
  });
  vm.runInContext(fn + '\nproductCompareSlider();', context);
  assert.deepEqual(initialized, [populated]);
});
