# Shared Header v2 staging build

This branch starts at deployed commit `eff370aa15bc7f4536cd13564e1ff3d4fbe3bb93`, not current main. It intentionally excludes later, unrelated site changes.

- `src/modules/headerV2.js`: shared COM/UK compact menu, locale UI state, modal Escape, keyboard accessibility. It only runs on the two exact Webflow staging hosts and `header[data-pb-header="v2"]`.
- `src/index-staging.js`: runs the existing site initializer before Header v2. It supports loading before or after DOMContentLoaded.
- `dist/staging/header-v2/`: isolated built assets. Existing production `dist/bundle.js` and CSS are unchanged.

Build: `npm ci --ignore-scripts`, then `npm run build:header-v2-staging`.

Isolation tests: `node --test tests/header-v2-isolation.test.cjs`.

## Webflow integration

Keep critical Header CSS in Head so the 1280px layout does not depend on JavaScript. Keep existing bundle CSS pinned to the deployed version. No new layout CSS is introduced by this staging build.

The site Head configures the bundle URL based on the exact staging hostname. The site Footer uses a small parser-inserted module tag to preserve module/DOMContentLoaded ordering, requesting one project bundle. On production hostnames the configured URL remains the deployed baseline. Do not publish production as part of this experiment.

Remove former inline `pb-header-v2-runtime` blocks on the enrolled pages. Do not duplicate the bundle or HubSpot handlers in component embeds.

COM retains its locale URL mapping and localized EU/GB form integrations. UK retains its UK URL mapping, whitelist, GB label, and UK form integrations. The UK legacy locale UI initializer skips Header v2 after applying URL mapping/label configuration. Header v2 is the sole owner of its menu UI state.

The standard production build does not include Header v2. A future production release needs a separate approved integration and removal of the staging-only guard after validation.

## Rollback

COM: restore saved site Head/Footer Custom Code and the saved Before-body blocks for Sustainability, Persy One, and Blog & Articles categories. Publish staging only.

UK: restore saved site Head/Footer Custom Code. This restores one inline v2 runtime and critical CSS in the global Head, so keep sandbox's cleaned page Head (noindex only) and Before-body block (Contact Form only). Do not also restore sandbox's old duplicate runtime/CSS. Publish staging only.

Do not combine the new bundle with the old inline runtime. Keep production domains unchecked.

The surrounding task output folder contains the exact pre-change Webflow code, QA results, and screenshots. No form submissions are included in QA.
