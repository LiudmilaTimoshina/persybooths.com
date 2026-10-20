# COM production Header v2

The release bundle contains the unchanged base entry plus Header v2. Build with:

`npx esbuild src/index-staging.js --bundle --splitting --format=esm --outdir=dist/releases/header-v2 --entry-names=bundle --chunk-names=chunks/[name]-[hash] --minify`

Load this pinned release instead of the base JS bundle only on persybooths.com / www.persybooths.com pages containing `header[data-pb-header="v2"]`. Select it in the existing Footer loader, where the header DOM is already parsed. Do not add a second module script, async injection, or change the existing CSS URL. This preserves module loading before DOMContentLoaded and avoids running the base entry twice.

The runtime additionally requires an enabled host and the v2 header marker. Each initializer guards against duplicate listeners. UK production remains excluded. Staging keeps its currently pinned bundle; this release does not alter UK settings or shared production assets.

Rollback: restore the saved COM Footer loader that uses window.PersyBundleUrl, then publish COM. No components, class lists, critical CSS, form submission handlers, or production baseline bundle are changed by this release.
