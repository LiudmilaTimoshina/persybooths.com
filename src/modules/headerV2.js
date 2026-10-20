import { gsap } from 'gsap';

const STAGING_HOSTS = new Set([
  'persybooths-uk.webflow.io',
  'persybooths-com-a171e119102a6875fb6aff4.webflow.io',
]);

function initMenu(component) {
  if (component.dataset.pbV2MenuReady === '1') return;
  const language = document.documentElement.lang.split('-')[0];
  const mq = matchMedia('(width < 1280px)');
  const labels = ({ de: ['Menü', 'Schließen'], fr: ['Menu', 'Fermer'], nl: ['Menu', 'Sluiten'] })[language] || ['Menu', 'Close'];
    const header = component.querySelector('[class*="header_wrap"].exp-header-normalized-20261007');
    const menu = component.querySelector('.mobile-menu[data-mobile-menu="v2-menu"]');
    const trigger = header?.querySelector('[data-mobile-menu="trigger"]');
    const panel = menu?.querySelector('[data-mobile-menu="wrap"]');
    const overlay = menu?.querySelector('[data-mobile-menu="overlay"]');
    if (!header || !menu || !trigger || !panel || !overlay || !gsap) {
      console.warn('[Header v2] Missing dependency; stock behavior retained.');
      return;
    }
    // The authored v2-menu attribute prevents stock menu initialization.
    component.dataset.pbV2MenuReady = '1';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const on = (el, name, fn, options) => el.addEventListener(name, fn, options);
    let opened = false;
    let scrollState = null;
    let previousFocus = null;
    menu.id ||= 'pb-v2-mobile-menu';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-controls', menu.id);
    function lock() {
      if (scrollState) return;
      const doc = document.documentElement;
      const body = document.body;
      const lenis = window.lenis;
      scrollState = { docOverflow: doc.style.overflow, bodyOverflow: body.style.overflow, lenis, resumeLenis: !!lenis && !lenis.isStopped };
      doc.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (scrollState.resumeLenis) lenis.stop();
    }
    function unlock() {
      if (!scrollState) return;
      document.documentElement.style.overflow = scrollState.docOverflow;
      document.body.style.overflow = scrollState.bodyOverflow;
      if (scrollState.resumeLenis) scrollState.lenis.start();
      scrollState = null;
    }
    function sync() {
      trigger.textContent = opened ? labels[1] : labels[0];
      trigger.setAttribute('aria-expanded', String(opened));
      menu.setAttribute('aria-hidden', String(!opened));
      menu.inert = !opened;
    }
    function focusables() {
      return [...header.querySelectorAll('a[href],button,[tabindex]'), ...menu.querySelectorAll('a[href],button,[tabindex]')]
        .filter(el => el.tabIndex >= 0 && !el.closest('[inert]') && !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
    }
    function close({ immediate = false, restoreFocus = true } = {}) {
      opened = false;
      gsap.killTweensOf([menu, overlay]);
      sync();
      unlock();
      if (restoreFocus && (menu.contains(document.activeElement) || (!mq.matches && document.activeElement === trigger))) {
        const dest = mq.matches ? trigger : header.querySelector('.exp-header-logo-stable-20261007');
        (dest || previousFocus)?.focus({ preventScroll: true });
      }
      const finish = () => { menu.style.display = 'none'; menu.style.height = ''; overlay.style.opacity = '0'; };
      if (immediate || reduced.matches) finish();
      else {
        gsap.to(menu, { height: 0, duration: .7, ease: 'power3.inOut', onComplete: finish });
        gsap.to(overlay, { opacity: 0, duration: .3, ease: 'linear' });
      }
    }
    function open() {
      if (!mq.matches || opened) return;
      previousFocus = document.activeElement;
      const startHeight = menu.getBoundingClientRect().height;
      opened = true;
      gsap.killTweensOf([menu, overlay]);
      menu.style.display = 'block';
      sync();
      lock();
      gsap.fromTo(menu, { height: startHeight }, { height: 'auto', duration: reduced.matches ? 0 : .7, ease: 'power3.inOut', onComplete: () => { if (opened) menu.style.height = 'auto'; } });
      gsap.to(overlay, { opacity: .1, duration: reduced.matches ? 0 : .3, ease: 'linear' });
    }
    on(trigger, 'click', event => { if (!mq.matches) return; event.preventDefault(); opened ? close() : open(); });
    on(trigger, 'keydown', event => { if (mq.matches && event.key === ' ') { event.preventDefault(); opened ? close() : open(); } });
    on(overlay, 'click', () => close());
    on(document, 'keydown', event => {
      if (!opened) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); trigger.focus({ preventScroll: true }); }
      if (event.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) { event.preventDefault(); return; }
      const index = els.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); els[els.length - 1].focus(); }
      else if (!event.shiftKey && (index < 0 || index === els.length - 1)) { event.preventDefault(); els[0].focus(); }
    });
    // Capture runs before existing modal handlers: release this menu's lock first.
    on(menu, 'click', event => {
      const link = event.target.closest('a,button');
      if (!link || link.matches('[data-accordion="trigger"]')) return;
      if (link.matches('[data-modal-trigger],[data-popup-trigger]') || (link.getAttribute('href') && link.getAttribute('href') !== '#')) close({ immediate: true, restoreFocus: false });
    }, { capture: true });
    const mediaChange = () => { if (!mq.matches) close({ immediate: true }); };
    mq.addEventListener('change', mediaChange);
    close({ immediate: true, restoreFocus: false });

}
function initLocale(component) {
  if (component.dataset.pbV2LocaleReady === '1') return;
    const root = component.querySelector('[class*="header_locale-switch"]');
    const trigger = root?.querySelector('.locale-switch_button');
    const menu = root?.querySelector('[class*="locale-switch_menu"]');
    if (!trigger || !menu) return;
    component.dataset.pbV2LocaleReady = '1';
    menu.id = 'pb-v2-locale-options';
    trigger.setAttribute('role', 'button');
    trigger.tabIndex = 0;
    trigger.setAttribute('aria-controls', menu.id);
    const setOpen = (open) => {
      trigger.setAttribute('aria-expanded', String(open));
      menu.style.display = open ? 'flex' : 'none';
      menu.style.opacity = open ? '1' : '0';
      menu.inert = !open;
      menu.setAttribute('aria-hidden', String(!open));
    };
    setOpen(false);
    trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); trigger.click(); }
      if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); menu.querySelector('a[href]:not([style*="display: none"])')?.focus(); }
    });
    root.addEventListener('keydown', (event) => { if (event.key === 'Escape') { setOpen(false); trigger.focus(); } });
    root.addEventListener('focusout', (event) => { if (!root.contains(event.relatedTarget)) setOpen(false); });
    document.addEventListener('click', (event) => { if (!root.contains(event.target)) setOpen(false); });

}
function initFormEscape(component) {
  if (component.dataset.pbV2EscapeReady === '1') return;
  component.dataset.pbV2EscapeReady = '1';
  var opener = null;
  var closing = new WeakSet();
  var visible = function (el) { return el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]'); };
  component.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-modal-trigger="quote"], [data-popup-trigger="download-brochure"]');
    if (trigger) opener = trigger;
  }, true);
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    var modal = Array.from(component.querySelectorAll('[data-modal="quote"], [data-popup="download-brochure"]')).find(visible);
    if (!modal || closing.has(modal)) return;
    var close = modal.querySelector('[data-modal-el="close-btn"], [data-popup-el="close-btn"]');
    if (!close) return;
    event.preventDefault();
    closing.add(modal);
    var previousOpener = opener;
    var observer = new MutationObserver(function () {
      if (getComputedStyle(modal).display !== 'none') return;
      observer.disconnect();
      closing.delete(modal);
      requestAnimationFrame(function () {
        var target = visible(previousOpener) ? previousOpener : Array.from(component.querySelectorAll('[class*="header_mobile-menu-btn"]')).find(visible);
        if (target) target.focus({ preventScroll: true });
      });
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });
    close.click();
  });

}
function initA11y(component) {
  if (component.dataset.pbV2A11yReady === '1') return;
    var header = component.querySelector('[class*="header_wrap"].exp-header-normalized-20261007');
    var mobile = component.querySelector('.mobile-menu');
    if (!header || !mobile) return;
    component.dataset.pbV2A11yReady = '1';
    var compact = matchMedia('(width < 1280px)');
    var states = [];
    var driving = false;

    function animate(state, open) {
      // Reuse the bundle's mouseenter/mouseleave handlers, not a second timeline.
      driving = true;
      try { state.wrap.dispatchEvent(new MouseEvent(open ? 'mouseenter' : 'mouseleave')); }
      finally { driving = false; }
    }
    function sync(state, open) {
      state.open = open;
      state.link.setAttribute('aria-expanded', String(open));
      state.panel.setAttribute('aria-hidden', String(!open));
      state.panel.inert = !open;
    }
    function close(state, restoreFocus) {
      if (!state.open) return;
      state.keyboard = false;
      if (restoreFocus) state.link.focus({ preventScroll: true });
      sync(state, false);
      animate(state, false);
    }
    function closeOthers(current) {
      states.forEach(function (state) {
        if (state !== current) close(state, state.panel.contains(document.activeElement));
      });
    }
    function open(state, keyboard) {
      if (compact.matches) return;
      closeOthers(state);
      state.keyboard = keyboard;
      sync(state, true);
      animate(state, true);
    }
    function firstLink(state) {
      requestAnimationFrame(function () {
        if (!state.open || compact.matches) return;
        var target = Array.from(state.panel.querySelectorAll('a[href],button,[tabindex]')).find(function (el) {
          return el.tabIndex >= 0 && !el.disabled && !el.closest('[inert]') && el.getClientRects().length;
        });
        if (target) target.focus({ preventScroll: true });
      });
    }

    header.querySelectorAll('[data-dropdown-menu="trigger"]').forEach(function (wrap, index) {
      var link = wrap.querySelector(':scope > a');
      var panel = wrap.querySelector('[data-dropdown-menu="wrap"]');
      if (!link || !panel) return;
      var href = link.getAttribute('href') || '';
      var placeholder = href === '#';
      if (!placeholder && /#$/.test(href)) {
        var url = new URL(href, location.href);
        placeholder = url.origin === location.origin && url.pathname === location.pathname;
      }
      var state = { wrap: wrap, link: link, panel: panel, open: false, keyboard: false };
      states.push(state);
      if (!panel.id) panel.id = 'pb-v2-desktop-panel-' + index;
      link.setAttribute('aria-controls', panel.id);
      if (placeholder) link.setAttribute('role', 'button');
      sync(state, false);

      wrap.addEventListener('mouseenter', function (event) {
        if (event.target !== wrap || driving || compact.matches) return;
        closeOthers(state);
        sync(state, true);
      }, true);
      wrap.addEventListener('mouseleave', function (event) {
        if (event.target !== wrap || driving) return;
        // Do not collapse a keyboard-focused panel when the mouse moves away.
        if (state.keyboard && wrap.contains(document.activeElement)) {
          event.stopImmediatePropagation();
          return;
        }
        state.keyboard = false;
        sync(state, false);
      }, true);
      wrap.addEventListener('focusin', function (event) {
        if (panel.contains(event.target)) state.keyboard = true;
      });
      wrap.addEventListener('focusout', function () {
        // Native Tab briefly leaves activeElement on body between focus events.
        // A microtask here can inert the destination before the browser focuses it.
        requestAnimationFrame(function () {
          if (wrap.contains(document.activeElement)) return;
          state.keyboard = false;
          if (!wrap.matches(':hover')) close(state, false);
        });
      });
      link.addEventListener('keydown', function (event) {
        if (compact.matches || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          open(state, true);
          firstLink(state);
        } else if (event.key === ' ' || (placeholder && event.key === 'Enter')) {
          event.preventDefault();
          if (event.repeat) return;
          if (state.open && state.keyboard) close(state, false);
          else open(state, true);
        }
        // Enter on Products/Knowledge Base/About still follows its real hub URL.
      });
      if (placeholder) link.addEventListener('click', function (event) {
        if (compact.matches) return;
        event.preventDefault();
        if (event.detail === 0 && state.open && state.keyboard) close(state, false);
        else open(state, event.detail === 0);
      });
      wrap.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape' || !state.open || compact.matches) return;
        event.preventDefault();
        event.stopPropagation();
        close(state, true);
      });
    });
    compact.addEventListener('change', function () {
      states.forEach(function (state) { close(state, false); });
    });

    mobile.querySelectorAll('[data-accordion="accordion-item"]').forEach(function (item, index) {
      var trigger = item.querySelector('[data-accordion="trigger"]');
      var panel = item.querySelector('[data-accordion="expand-wrap"]');
      if (!trigger || !panel) return;
      if (!panel.id) panel.id = 'pb-v2-accordion-panel-' + index;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-controls', panel.id);
      function syncAccordion() {
        // is-open is owned by the existing accordion, including sibling close.
        var expanded = item.classList.contains('is-open');
        if (!expanded && panel.contains(document.activeElement)) trigger.focus({ preventScroll: true });
        trigger.setAttribute('aria-expanded', String(expanded));
        panel.setAttribute('aria-hidden', String(!expanded));
        panel.inert = !expanded;
      }
      new MutationObserver(syncAccordion).observe(item, { attributes: true, attributeFilter: ['class'] });
      syncAccordion();
      trigger.addEventListener('keydown', function (event) {
        if (event.key !== ' ') return;
        event.preventDefault();
        if (!event.repeat) trigger.click();
      });
    });
}


export function initHeaderV2() {
  if (!STAGING_HOSTS.has(location.hostname)) return;
  document.querySelectorAll('header[data-pb-header="v2"]').forEach(component => {
    initMenu(component);
    initLocale(component);
    initFormEscape(component);
    initA11y(component);
  });
  window.PersyHeaderV2 = Object.freeze({ version: '1.1.0-staging', init: initHeaderV2 });
}
