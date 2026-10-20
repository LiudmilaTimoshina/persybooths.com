import './index.js';
import { initHeaderV2 } from './modules/headerV2.js';

// The legacy bundle registers/initializes first, then v2 enhances its interactions.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderV2, { once: true });
} else {
  initHeaderV2();
}
window.addEventListener('load', initHeaderV2, { once: true });
