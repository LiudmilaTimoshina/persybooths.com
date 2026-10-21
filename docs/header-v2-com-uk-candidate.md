# Header v2 1.2.0 — COM / UK release candidate

Prepared for staging evaluation only. Publishing files to the Git branch/CDN does not change the URLs pinned by either live site.

Build: `npm run build:header-v2-release`. This uses the existing shared entry (base site initialization followed by isolated Header v2) and writes `dist/releases/header-v2/`. Keep the production baseline `dist/bundle.js` and current CSS URL unchanged.

Runtime permits COM, UK, and their two staging domains. Enhancements require `header[data-pb-header="v2"]`; legacy headers do not receive v2 listeners. Footer classes and styles are unchanged. Base behavior remains included for old components and forms. Contains guards for empty CMS sliders and mobile breadcrumb spacing on the four Truths About Booths pages.

Staging evaluation: append a hostname-gated `window.PersyBundleUrl` override in the Head of selected legacy and v2 test pages. Use the candidate as the single module bundle, never as a second script. Save the existing Head first. Current production selection, URLs and host conditions stay untouched.

Future production activation (NOT performed by this preparation): pin this candidate as PBv2 on both sites, and select it only when the new header marker exists; legacy pages retain their old baseline. Review page-specific older overrides and staging-only patches before rollout. Do not change staging GB link routing on production.

Rollback staging: restore each saved test page Head and republish staging. Rollback future production: restore the previous per-site loader selection and publish only that site.
