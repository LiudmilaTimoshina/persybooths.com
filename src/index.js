// Importing custom css
import "./custom-styles.css";
import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Importing JS from /modules
import { showroomMap, showroomSearch } from "./modules/showroomMap.js";
import {
	testimonialsSlider,
	reasonsSlider,
	productImagesSlider,
	productImagesSlider2,
	productFeaturesSlider,
	productMobilitySlider,
	mobileUsageSwiper,
	mobileProductCustomizeSwiper,
	homeHeroSlides,
	aboutGallerySlider,
	aboutValuesSlider,
	mobileKnowledgeBlogSlider,
	knowledgePostGallerySlider,
	thingsToWatchLandingSlider,
	boothFeaturesSlider,
	gallerySlider,
	productCompareSlider,
	soundFeaturesSlider,
	accordionSyncImagesSlider,
} from "./modules/sliders.js";
import { customCursorAnimation } from "./modules/cursor.js";
import { customFormValidation, quoteFormQtyInput, formUTMparameters, formPageField, customFormSelect, honeyPot } from "./modules/forms.js";
import { cookiesPopup } from "./modules/cookies.js";
import {
	dottedBoothPin,
	boothScrollAnimation,
	usageHoverAnimation,
	reasonsSliderHover,
	rotatingText,
	indexMobilityPinAnimation,
	indexHeroScroll,
	draggableCardsAnimation,
	aboutValuesListHover,
	aboutCardsExpand,
	productFeaturesVideo,
	initStackingNav,
	imageParallaxAnimation,
} from "./modules/animations.js";
import { accordionAnimation } from "./modules/accordion.js";
import { smoothScroll, nestedLenisScroll, toggleScroll } from "./modules/smoothScroll.js";
//import { overlayScrollbar } from "./modules/scrollbar.js";
import { displayCurrentYear, getCartCount } from "./modules/utils.js";
import { externalVideoPlayer } from "./modules/externalVideoPlayer.js";
import { productCompare } from "./modules/productCompare.js";
import { soundCompare } from "./modules/soundCompare.js";

function sideModalAnimation() {
	// Getting all modals on the page
	const modals = document.querySelectorAll("[data-modal]");
	if (!modals.length) return;

	let activeTl = null;
	const modalTimelines = {};

	function openModal(modalTl, modal) {
		modalTl.play();
		toggleScroll(true);
		activeTl = modalTl;
		window.location.hash = modal.getAttribute("data-modal");
	}

	function closeModal() {
		activeTl.reverse();
		toggleScroll();
		// Remove hash from URL without reloading the page
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}

	// Loop through each modal
	modals.forEach((modal) => {
		// Getting the modal's name
		const modalName = modal.getAttribute("data-modal");

		// Getting all triggers for this modal
		const triggers = document.querySelectorAll(`[data-modal-trigger="${modalName}"]`);

		// Getting other modal's elements
		const modalWrap = modal.querySelector('[data-modal-el="wrap"]');
		const modalOverlay = modal.querySelector('[data-modal-el="overlay"]');
		const closeBtns = modal.querySelectorAll('[data-modal-el="close-btn"]');

		// Create the timeline for this modal
		let modalTl = gsap.timeline({ paused: true });

		modalTl
			.set(modal, {
				display: "flex",
			})
			.fromTo(
				modalWrap,
				{
					x: "100%",
				},
				{
					x: "0%",
					duration: 0.8,
					ease: "power3.inOut",
				}
			)
			.fromTo(
				modalOverlay,
				{
					opacity: 0,
				},
				{
					opacity: 0.1,
					duration: 0.3,
					ease: "linear",
				},
				"<"
			);

		// Store the timeline in an object using modalName as the key
		modalTimelines[modalName] = { timeline: modalTl, modal: modal };

		// Attach click event to each trigger to open the modal
		triggers.forEach((trigger) => {
			trigger.addEventListener("click", (e) => {
				e.preventDefault();
				openModal(modalTl, modal);
			});
		});

		// Attach close event listeners
		closeBtns.forEach((btn) => {
			btn.addEventListener("click", (event) => {
				closeModal();
			});
		});

		// Close modal via overlay click
		modalOverlay.addEventListener("click", () => {
			closeModal();
		});
	});

	// Open popup if URL hash matches any popup's data-popup attribute on page load
	window.addEventListener("load", () => {
		const hash = window.location.hash.substring(1); // Remove the `#` from the hash
		if (hash && modalTimelines[hash]) {
			const { timeline, modal } = modalTimelines[hash];
			openModal(timeline, modal);
		}
	});
}

function productStickyNav() {
	const productBar = document.querySelector('[data-product-bar="sticky-bar"]');
	if (!productBar) return;
	const heroSection = document.querySelector('[data-product-bar="hero"]');
	const footer = document.querySelector("footer");

	// Create the animation for showing the product bar when hero section leaves the viewport
	let showTl = gsap.timeline({
		scrollTrigger: {
			trigger: heroSection,
			start: "bottom top",
			toggleActions: "play none none reverse",
		},
	});
	showTl
		.set(productBar, {
			display: "flex",
		})
		.fromTo(
			productBar,
			{
				y: "1rem",
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.3,
				ease: "power3.out",
			}
		);

	// Create a separate animation for hiding the product bar when the footer enters the viewport
	let hideTl = gsap.timeline({
		scrollTrigger: {
			trigger: footer,
			start: "top bottom",
			end: "top top",
			toggleActions: "play none none reverse",
		},
	});
	hideTl
		.to(productBar, {
			y: "1rem",
			opacity: 0,
			duration: 0.3,
			ease: "power3.out",
		})
		.set(productBar, {
			display: "none",
		});
}

function popupAnimation() {
	// Getting all popups on the page
	const popups = document.querySelectorAll("[data-popup]");
	if (!popups.length) return;

	// Store the timelines with their corresponding popups
	const popupTimelines = {};

	// Utility function to open popup
	function openPopup(popupTl, popup) {
		toggleScroll(true);
		popupTl.play();
		// Update the URL hash without reloading the page
		window.location.hash = popup.getAttribute("data-popup");
	}

	// Utility function to close popup
	function closePopup(popupTl) {
		toggleScroll();
		popupTl.reverse();
		// Remove hash from URL without reloading the page
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}

	// Loop through each popup
	popups.forEach((popup) => {
		// Getting the popup's name
		const popupName = popup.getAttribute("data-popup");

		// Getting all triggers for this popup
		const triggers = document.querySelectorAll(`[data-popup-trigger="${popupName}"]`);

		// Getting other popup elements
		const popupWrap = popup.querySelector('[data-popup-el="wrap"]');
		const popupOverlay = popup.querySelector('[data-popup-el="overlay"]');
		const closeBtn = popup.querySelector('[data-popup-el="close-btn"]');

		// Create the timeline for this popup
		let popupTl = gsap.timeline({ paused: true });

		popupTl
			.set(popup, {
				display: "flex",
			})
			.fromTo(
				popupWrap,
				{
					y: "2rem",
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.3,
					ease: "power3.inOut",
				}
			)
			.fromTo(
				popupOverlay,
				{
					opacity: 0,
				},
				{
					opacity: 0.1,
					duration: 0.3,
					ease: "linear",
				},
				"<"
			);

		// Store the timeline in an object using popupName as the key
		popupTimelines[popupName] = { timeline: popupTl, popup: popup };

		// Attach click event to each trigger to open the popup
		triggers.forEach((trigger) => {
			trigger.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				openPopup(popupTl, popup);
			});
		});

		// Attach close event listeners
		closeBtn.addEventListener("click", (e) => {
			e.preventDefault();
			closePopup(popupTl);
		});

		// Close popup via overlay click
		popupOverlay.addEventListener("click", (e) => {
			e.preventDefault();
			closePopup(popupTl);
		});
	});

	// Open popup if URL hash matches any popup's data-popup attribute on page load
	window.addEventListener("load", () => {
		const hash = window.location.hash.substring(1); // Remove the `#` from the hash
		if (hash && popupTimelines[hash]) {
			const { timeline, popup } = popupTimelines[hash];
			openPopup(timeline, popup);
		}
	});
}

function mobileMenuAnimation() {
	const mobileMenu = document.querySelector('[data-mobile-menu="menu"]');
	if (!mobileMenu) return;

	const menuTrigger = document.querySelector('[data-mobile-menu="trigger"]');
	const menuWrap = mobileMenu.querySelector('[data-mobile-menu="wrap"]');
	const menuOverlay = mobileMenu.querySelector('[data-mobile-menu="overlay"]');
	const accordionButtons = document.querySelectorAll('[data-accordion="accordion-item"]');

	let menuOpen = false;

	let mm = gsap.matchMedia();

	mm.add("(max-width: 991px)", () => {
		// Change "auto" height value when accordion is activated for menu animation
		accordionButtons.forEach((button) => {
			button.addEventListener("click", () => {
				setTimeout(() => {
					menuTl.invalidate();
				}, 500);
			});
		});

		menuTl = gsap.timeline({
			paused: true,
			onStart: () => {
				gsap.set(mobileMenu, { display: "block" }); // Ensure display is set to block when animation starts
			},
			onReverseComplete: () => {
				gsap.set(mobileMenu, { display: "none" }); // Hide menu when reverse animation completes
			},
		});

		menuTl
			.fromTo(
				mobileMenu,
				{
					height: 0,
				},
				{
					height: "auto",
					duration: 0.7,
					ease: "power3.inOut",
				}
			)
			.fromTo(
				menuOverlay,
				{
					opacity: 0,
				},
				{
					opacity: 0.1,
					duration: 0.3,
					ease: "linear",
				},
				"<"
			);

		menuTrigger.addEventListener("click", () => {
			if (!menuOpen) {
				menuTrigger.textContent = "Close";
				menuTl.play();
				menuOpen = true;
			} else {
				menuTrigger.textContent = "Menu";
				menuTl.reverse();
				menuOpen = false;
			}
		});

		menuOverlay.addEventListener("click", () => {
			menuTrigger.textContent = "Menu";
			menuTl.reverse();
			menuOpen = false;
		});
	});
}

function indexStoryImagesParallax() {
	const imagesWrap = document.querySelector('[data-index-story-parallax="images-wrap"]');
	if (!imagesWrap) return;

	const bigImage = imagesWrap.querySelector('[data-index-story-parallax="big-img"]');
	const smallImages = imagesWrap.querySelectorAll('[data-index-story-parallax="small-img"]');

	let tl = gsap.timeline({
		scrollTrigger: {
			trigger: imagesWrap,
			start: "top bottom",
			end: "bottom top",
			scrub: 1,
			ease: "linear",
		},
	});

	tl.fromTo(
		bigImage,
		{
			y: "3%",
		},
		{
			y: "-1%",
		}
	).fromTo(
		smallImages,
		{
			y: "-5%",
		},
		{
			y: "5%",
			ease: "linear",
		},
		"<"
	);
}

function navBgAnimation() {
	const navLinks = document.querySelectorAll('.header_nav [data-nav-bg-animation="link"]');
	if (!navLinks.length) return;

	const navBlob = document.querySelector('[data-nav-bg-animation="blob"]');
	const navWrap = document.querySelector('[data-nav-bg-animation="nav-wrap"]');
	const navContainer = navBlob.parentElement;
	let blobHidden = true;
	let currentLink;

	// Variable to check if subpage is current url
	const currentUrl = window.location.href;

	// Logic for product inner pages
	function isActiveNav(link) {
		return link.classList.contains("w--current") || link.querySelector(".w--current");
	}

	function getLinkInfo(link) {
		const linkCoords = link.getBoundingClientRect();
		const navCoords = navContainer.getBoundingClientRect();

		// Calculate the left position relative to the parent container
		const leftPosition = linkCoords.left - navCoords.left;

		const data = {
			width: linkCoords.width,
			leftPosition: leftPosition,
		};

		return data;
	}

	function moveBlob(target, instant = false) {
		const { width, leftPosition } = getLinkInfo(target);
		const duration = !instant ? 0.3 : 0;

		gsap.to(navBlob, {
			width: width,
			left: leftPosition,
			duration: duration,
			ease: "power2.out",
		});
	}

	function showBlob() {
		blobHidden = false;
		gsap.to(navBlob, {
			opacity: 1,
			duration: 0.2,
		});
	}
	function hideBlob() {
		blobHidden = true;
		gsap.to(navBlob, {
			opacity: 0,
			duration: 0.3,
		});
	}

	navLinks.forEach((link) => {
		// Toggle blob if page = link
		if (isActiveNav(link)) {
			currentLink = link;
			moveBlob(link, true);
			showBlob();
		}

		link.addEventListener("mouseenter", () => {
			if (blobHidden) {
				moveBlob(link, true);
				showBlob();
			} else {
				moveBlob(link);
			}
		});

		link.addEventListener("mouseleave", () => {
			if (currentLink && currentLink !== link) {
				moveBlob(currentLink);
			} else if (currentLink === link) {
				return;
			}
		});
	});

	navWrap.addEventListener("mouseleave", () => {
		if (!currentLink) {
			hideBlob();
		}
	});
}

function menuDropdownAnimation() {
	const menuTriggers = document.querySelectorAll('[data-dropdown-menu="trigger"]');
	if (!menuTriggers.length) return;

	menuTriggers.forEach((menuTrigger) => {
		const menuWrap = menuTrigger.querySelector('[data-dropdown-menu="wrap"]');
		const contentWrap = menuTrigger.querySelector('[data-dropdown-menu="content"]');

		const menuHeight = contentWrap.scrollHeight;

		let menuTl = gsap.timeline({ paused: true });

		menuTl.set(menuWrap, {
			display: "flex",
		});
		menuTl.to(menuWrap, {
			height: "auto",
			duration: 0.6,
			ease: "power3.inOut",
		});

		menuTrigger.addEventListener("mouseenter", () => {
			menuTl.play();
		});
		menuTrigger.addEventListener("mouseleave", () => {
			menuTl.reverse();
		});
	});
}

function footerParallax() {
	const footer = document.querySelector("footer");
	if (!footer) return;

	const sections = document.querySelectorAll("section");
	const lastSection = sections[sections.length - 1];

	const footerWrap = document.querySelector(".footer_fixed-wrap");
	const footerHeight = footerWrap.scrollHeight;
	footer.style.height = footerHeight + "px";

	let tl = gsap.timeline({
		scrollTrigger: {
			trigger: footer,
			start: "top bottom",
			end: "bottom bottom",
			scrub: 0.01,
		},
	});

	tl.from(
		footerWrap,
		{
			y: "40%",
			ease: "linear",
		},

		"<"
	);
}

function faqAnchorScroll() {
	const anchorLinks = document.querySelectorAll("[data-faq-anchor]");
	if (!anchorLinks.length) return;

	const anchorSections = Array.from(anchorLinks).map((anchor) => {
		const sectionId = "faq-" + anchor.getAttribute("data-faq-anchor");
		return document.getElementById(sectionId);
	});

	// Loop through each section and set up a ScrollTrigger
	anchorSections.forEach((section, index) => {
		if (!section) return;

		ScrollTrigger.create({
			trigger: section,
			start: "top 40%",
			end: "bottom 40%",
			toggleClass: {
				targets: anchorLinks[index], // Add class to the corresponding link
				className: "is-current",
			},
		});
	});

	anchorLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			// Get target faq section
			const targetId = link.getAttribute("data-faq-anchor");
			const targetElement = document.getElementById("faq-" + targetId);

			if (targetElement) {
				lenis.scrollTo(targetElement, {
					duration: 1,
					offset: -window.innerHeight * 0.2, // Offset by 40% of viewport height
					easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), // Ease-in-out easing
				});
			}
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	//overlayScrollbar();
	gsap.registerPlugin(ScrollTrigger);
	// gsap.registerPlugin(Draggable);
	gsap.registerPlugin(DrawSVGPlugin);
	smoothScroll();
	nestedLenisScroll();
	$.validator.setDefaults({
		ignore: [], // Do not ignore any hidden elements
	});
	indexHeroScroll();
	homeHeroSlides();
	dottedBoothPin();
	boothScrollAnimation();
	sideModalAnimation();
	customCursorAnimation();
	usageHoverAnimation();
	reasonsSlider();
	reasonsSliderHover();
	testimonialsSlider();
	displayCurrentYear();
	getCartCount();
	quoteFormQtyInput();
	productImagesSlider();
	productImagesSlider2();
	rotatingText();
	productFeaturesSlider();
	accordionAnimation();
	productMobilitySlider();
	productStickyNav();
	popupAnimation();
	mobileMenuAnimation();
	productFeaturesVideo();
	mobileUsageSwiper();
	mobileProductCustomizeSwiper();
	customFormValidation();
	indexMobilityPinAnimation();
	indexStoryImagesParallax();
	cookiesPopup();
	navBgAnimation();
	menuDropdownAnimation();
	formUTMparameters();
	formPageField();
	// footerParallax();
	customFormSelect();
	faqAnchorScroll();
	draggableCardsAnimation();
	aboutValuesListHover();
	aboutGallerySlider();
	aboutValuesSlider();
	aboutCardsExpand();
	showroomMap();
	showroomSearch();
	mobileKnowledgeBlogSlider();
	knowledgePostGallerySlider();
	thingsToWatchLandingSlider();
	boothFeaturesSlider();
	gallerySlider();
	initStackingNav();
	externalVideoPlayer();
	productCompare();
	productCompareSlider();
	soundCompare();
	soundFeaturesSlider();
	imageParallaxAnimation();
	accordionSyncImagesSlider();
	honeyPot();
	setTimeout(() => {
		ScrollTrigger.sort();
		ScrollTrigger.refresh();
	}, 1000);
});
