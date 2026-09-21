import { build } from 'esbuild';
import { resolve } from 'node:path';
import { writeFileSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const common = {
  entryPoints: ['src/index.js'], bundle: true, splitting: true, format: 'esm',
  entryNames: 'bundle', chunkNames: 'chunks/[name]-[hash]', minify: true,
  metafile: true, logLevel: 'info',
};

const baseline = await build({ ...common, outdir: 'experiment-dist/baseline' });
const treatment = await build({ ...common, outdir: 'experiment-dist/treatment', plugins: [{
  name: 'reuse-webflow-gsap',
  setup(builder) {
    builder.onResolve({ filter: /^(gsap|gsap\/ScrollTrigger)$/ }, () => ({
      path: resolve('experiment/gsap-runtime.js'),
    }));
  },
}] });

const forbidden = Object.keys(treatment.metafile.inputs).filter(path =>
  /node_modules\/gsap\/(?:gsap-core|CSSPlugin|ScrollTrigger|Observer|index)\.js$/.test(path)
);
if (forbidden.length) throw new Error(`Unexpected duplicate core: ${forbidden.join(', ')}`);
for (const name of ['DrawSVGPlugin', 'Draggable']) {
  if (!Object.keys(treatment.metafile.inputs).some(p => p.endsWith(`/gsap/${name}.js`))) {
    throw new Error(`Required plugin missing: ${name}`);
  }
}

function summarize(result) {
  return Object.entries(result.metafile.outputs).map(([path, info]) => ({
    path, bytes: info.bytes, gzipBytes: gzipSync(readFileSync(path)).length,
    imports: info.imports,
  }));
}
const results = { sourceCommit: 'eff370aa15bc7f4536cd13564e1ff3d4fbe3bb93',
  baseline: summarize(baseline), treatment: summarize(treatment),
  note: 'gzip sizes are local estimates, not browser transfer measurements. No LCP claim.' };
writeFileSync('experiment/build-results.json', JSON.stringify(results, null, 2));
writeFileSync('experiment/baseline-meta.json', JSON.stringify(baseline.metafile, null, 2));
writeFileSync('experiment/treatment-meta.json', JSON.stringify(treatment.metafile, null, 2));
console.log(JSON.stringify(results, null, 2));
