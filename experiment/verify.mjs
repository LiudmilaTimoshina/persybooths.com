import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

// Git on this Windows host checks out CRLF; compare normalized text.
const hash = path => createHash('sha256').update(readFileSync(path, 'utf8').replaceAll('\r\n', '\n')).digest('hex');
const baselineFiles = ['bundle.js', 'bundle.css', ...readdirSync('dist/chunks').filter(f => f.endsWith('.js')).map(f => `chunks/${f}`)];
for (const file of baselineFiles) {
  assert.equal(hash(`dist/${file}`), hash(`experiment-dist/baseline/${file}`), `Baseline differs from published revision: ${file}`);
}
assert.equal(hash('experiment-dist/baseline/bundle.css'), hash('experiment-dist/treatment/bundle.css'), 'CSS changed');
assert.equal(hash('dist/chunks/Draggable-MIPN3ZMS.js'), hash('experiment-dist/treatment/chunks/Draggable-MIPN3ZMS.js'), 'Draggable changed');
const shim = readFileSync('experiment/gsap-runtime.js', 'utf8').replaceAll('export const ', 'const ');
const expected = { version: '3.15.0' };
vm.runInNewContext(shim, { window: { gsap: expected, ScrollTrigger: expected } });
assert.throws(() => vm.runInNewContext(shim, { window: {} }), /Expected Webflow/);
assert.throws(() => vm.runInNewContext(shim, { window: { gsap: { version: '3.14.0' }, ScrollTrigger: expected } }), /Expected Webflow/);
const results = JSON.parse(readFileSync('experiment/build-results.json', 'utf8'));
function initialBytes(outputs) {
  const entry = outputs.find(o => o.path.endsWith('/bundle.js'));
  const visited = new Set();
  function visit(path) {
    if (visited.has(path)) return;
    visited.add(path);
    const output = outputs.find(o => o.path === path);
    for (const imp of output.imports.filter(i => i.kind === 'import-statement' && !i.external)) visit(imp.path);
  }
  visit(entry.path);
  return [...visited].reduce((sum, path) => sum + outputs.find(o => o.path === path).gzipBytes, 0);
}
const before = initialBytes(results.baseline), after = initialBytes(results.treatment);
console.log(JSON.stringify({ passed: true, baselineMatchesPublishedRevision: baselineFiles.length,
  cssUnchanged: true, draggableUnchanged: true, shimChecks: 3,
  initialJsGzipEstimate: { before, after, saved: before - after, savedPercent: ((before-after)/before*100).toFixed(1) },
  browserFunctionalTests: 'NOT RUN', lcpTests: 'NOT RUN' }, null, 2));
