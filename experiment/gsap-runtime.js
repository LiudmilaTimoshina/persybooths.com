// Staging experiment: reuse the version already loaded by Webflow.
// Fail before application initialization if the host prerequisites differ.
export const gsap = window.gsap;
export const ScrollTrigger = window.ScrollTrigger;

if (gsap?.version !== '3.15.0' || ScrollTrigger?.version !== '3.15.0') {
  throw new Error('[Persy GSAP experiment] Expected Webflow GSAP and ScrollTrigger 3.15.0. Restore the baseline bundle.');
}
