import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade, Thumbs } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { gsap } from "gsap";

export function testimonialsSlider() {
	const swiperTarget = document.querySelector(".testimonials-slider_swiper");
	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Autoplay, Pagination, Navigation],
		loop: true,
		speed: 800,
		autoplay: {
			delay: 6000,
		},
		slidesPerView: 1,
		centeredSlides: true,
		spaceBetween: 20,
		breakpoints: {
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 32,
			},
		},
		pagination: {
			el: ".testimonials-slider_pagination",
			bulletClass: "swiper-bullet",
			bulletActiveClass: "is-active",
			clickable: true,
		},
		navigation: {
			prevEl: ".testimonials-slider_swiper-btn.prev",
			nextEl: ".testimonials-slider_swiper-btn.next",
		},
	});
}

export function reasonsSlider() {
	const swiperTarget = document.querySelector(".reasons-slider_swiper");
	if (!swiperTarget) return;

	// Dynamic numeration of slides
	const slides = document.querySelectorAll('[data-reasons-slider="slide"]');
	slides.forEach((slide, index) => {
		const slideCount = slide.querySelector('[data-reasons-slider="count"]');
		if (index < 10) {
			slideCount.textContent = "0" + (index + 1);
		} else {
			slideCount.textContent = index + 1;
		}
	});

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation],
		slidesPerView: 1.3,
		speed: 600,
		spaceBetween: 16,
		breakpoints: {
			992: {
				slidesPerView: 4.5,
				spaceBetween: 8,
			},
			768: {
				slidesPerView: 2.7,
				spaceBetween: 20,
			},
		},
		// Navigation arrows
		navigation: {
			disabledClass: "is-disabled",
			nextEl: ".reasons-slider_btn-next",
			prevEl: ".reasons-slider_btn-prev",
		},
	});
}

export function productImagesSlider() {
	const swiperTargets = document.querySelectorAll(".product-hero_swiper");
	if (!swiperTargets.length) return;

	swiperTargets.forEach((swiperTarget) => {
		const swiper = new Swiper(swiperTarget, {
			modules: [Pagination, Navigation],
			slidesPerView: 1,
			loop: true,
			speed: 600,
			spaceBetween: 0,
			pagination: {
				el: ".product-hero_swiper-pagination",
				bulletClass: "swiper-bullet",
				bulletActiveClass: "is-active",
				clickable: true,
			},
			navigation: {
				nextEl: ".product-hero_swiper-btn.is-next",
				prevEl: ".product-hero_swiper-btn.is-prev",
			},
		});
	});
}

export function productImagesSlider2() {
	const gallerySwiperWraps = document.querySelectorAll("[data-product-gallery-wrap]");
	if (!gallerySwiperWraps.length) return;

	gallerySwiperWraps.forEach((wrap) => {
		const mainSwiperTarget = wrap.querySelector('[data-swiper-target="product-images"]');
		const thumbSwiperTarget = wrap.querySelector('[data-swiper-target="product-thumbs"]');
		if (!mainSwiperTarget || !thumbSwiperTarget) return;

		const thumbSwiper = new Swiper(thumbSwiperTarget, {
			slidesPerView: "auto",
			spaceBetween: 4,
		});

		const mainSwiper = new Swiper(mainSwiperTarget, {
			modules: [Pagination, Navigation, Thumbs],
			slidesPerView: 1,
			loop: true,
			speed: 600,
			spaceBetween: 0,
			thumbs: {
				swiper: thumbSwiper,
			},
			navigation: {
				nextEl: ".product-hero2_swiper-btn.is-next",
				prevEl: ".product-hero2_swiper-btn.is-prev",
			},
		});
	});
}

export function productFeaturesSlider() {
	const swiperTarget = document.querySelector(".product-features_swiper");
	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation],
		slidesPerView: 1.4,
		speed: 600,
		spaceBetween: 16,
		breakpoints: {
			768: {
				slidesPerView: 2.6,
				spaceBetween: 20,
			},
			992: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
		},
		navigation: {
			disabledClass: "is-disabled",
			nextEl: ".product-features_btn-next",
			prevEl: ".product-features_btn-prev",
		},
	});
}

export function productMobilitySlider() {
	const swiperTarget = document.querySelector(".product-mobility_swiper");
	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation],
		slidesPerView: "auto",
		speed: 800,
		spaceBetween: 16,
		breakpoints: {
			992: {
				spaceBetween: 20,
			},
		},
		navigation: {
			nextEl: ".product-mobility_swiper-btn.is-next",
			prevEl: ".product-mobility_swiper-btn.is-prev",
		},
	});
}

export function mobileUsageSwiper() {
	const swiperTarget = document.querySelector('[data-usage-swiper="target"]');
	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		slidesPerView: 1.3,
		speed: 600,
		spaceBetween: 16,
		breakpoints: {
			768: {
				slidesPerView: 2.7,
				spaceBetween: 20,
			},
		},
	});
}

export function mobileProductCustomizeSwiper() {
	const swiperTarget = document.querySelector('[data-mobile-customize-slides="target"]');
	if (!swiperTarget) return;

	const breakpoint = window.matchMedia("(max-width: 991px)");

	let swiper = null;
	const wrapper = swiperTarget.querySelector('[data-mobile-customize-slides="wrap"]');
	const slides = swiperTarget.querySelectorAll('[data-mobile-customize-slides="slide"]');

	function addSwiperClasses() {
		wrapper.classList.add("swiper-wrapper");
		slides.forEach((slide) => {
			slide.classList.add("swiper-slide");
		});
	}

	function removeSwiperClasses() {
		wrapper.classList.remove("swiper-wrapper");
		slides.forEach((slide) => {
			slide.classList.remove("swiper-slide");
		});
	}

	function initSwiper() {
		addSwiperClasses(); // Add classes before initializing Swiper
		swiper = new Swiper(swiperTarget, {
			slidesPerView: 1.1,
			speed: 600,
			spaceBetween: 16,
			breakpoints: {
				768: {
					spaceBetween: 20,
					slidesPerView: 2,
				},
			},
		});
	}

	function destroySwiper() {
		if (swiper) {
			swiper.destroy(true, true);
			swiper = null;
		}
		removeSwiperClasses(); // Remove classes after destroying Swiper
	}

	breakpoint.addEventListener("change", (event) => {
		if (event.matches) {
			initSwiper();
		} else {
			destroySwiper();
		}
	});

	// Try to init swiper when page loads if the breakpoint matches
	if (breakpoint.matches) {
		initSwiper();
	} else {
		destroySwiper();
	}
}

export function homeHeroSlides() {
	const swiperTarget = document.querySelector('[data-home-swiper="target"]');
	if (!swiperTarget) return;

	const slides = swiperTarget.querySelectorAll(".swiper-slide");
	if (slides.length > 1) {
		const swiper = new Swiper(swiperTarget, {
			modules: [Pagination, Autoplay],
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			allowTouchMove: true,
			breakpoints: {
				992: {
					allowTouchMove: false,
				},
			},
			speed: 1000,
			loop: true,
			pagination: {
				el: ".home-hero_swiper-pagination",
				bulletClass: "swiper-bullet",
				bulletActiveClass: "is-active",
				clickable: true,
			},
		});

		// Rotating text animation
		const rotatingTextWrap = document.querySelector('[data-swiper-text="wrap"]');
		const words = gsap.utils.toArray(".product-hero_rotating-text", rotatingTextWrap);

		gsap.set(words, {
			yPercent: (i) => (i ? 100 : 0),
			opacity: 1,
		});

		let previousSlideIndex = 0; // To keep track of the previously active slide

		swiper.on("slideChangeTransitionStart", function () {
			const currentSlideIndex = swiper.realIndex;

			// Animate the previous active word out by moving it UP
			gsap.to(words[previousSlideIndex], {
				yPercent: -100,
				duration: 0.8,
				ease: "power2.out",
				onComplete: () => {
					// Reset the previous word to prepare it for the next cycle
					gsap.set(words[previousSlideIndex], { yPercent: 100 });
				},
			});

			// Animate the current active word into view by moving it UP from the bottom
			gsap.fromTo(
				words[currentSlideIndex],
				{ yPercent: 100 },
				{
					yPercent: 0,
					duration: 0.8,
					ease: "power2.out",
				}
			);

			// Update previousSlideIndex to the current one
			previousSlideIndex = currentSlideIndex;
		});
	}
}

export function aboutGallerySlider() {
	const swiperTarget = document.querySelector(".about-gallery_swiper");

	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Autoplay],
		loop: true,
		speed: 800,
		autoplay: {
			delay: 1000,
		},

		centeredSlides: true,
		spaceBetween: 20,
		slidesPerView: 1.8,

		breakpoints: {
			992: {
				slidesPerView: 5,
				spaceBetween: 32,
			},
			768: {
				slidesPerView: 4,
			},
		},
	});
}

export function aboutValuesSlider() {
	const swiperTarget = document.querySelector(".about-values_swiper");

	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation],
		slidesPerView: 1.3,
		speed: 600,
		spaceBetween: 16,
		breakpoints: {
			992: {
				slidesPerView: 2.7,
				spaceBetween: 20,
			},
			768: {
				slidesPerView: 2.7,
			},
		},
		// Navigation arrows
		navigation: {
			disabledClass: "is-disabled",
			nextEl: ".about-values_slider_nav-btn.is-next",
			prevEl: ".about-values_slider_nav-btn.is-prev",
		},
	});
}

export function mobileKnowledgeBlogSlider() {
	const swiperTarget = document.querySelector("[data-knowledge-blog-swiper]");

	// Empty CMS collections omit Swiper's required wrapper.
	if (!swiperTarget || !swiperTarget.querySelector('.swiper-wrapper')) return;

	const swiper = new Swiper(swiperTarget, {
		slidesPerView: 1.3,
		speed: 600,
		spaceBetween: 16,
		breakpoints: {
			767: {
				slidesPerView: 2.3,
			},
		},
	});
}

export function knowledgePostGallerySlider() {
	const swiperTarget = document.querySelector("[data-knowledge-gallery-swiper]");

	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation],
		slidesPerView: "auto",
		speed: 800,
		spaceBetween: 16,
		breakpoints: {
			992: {
				spaceBetween: 20,
			},
		},
		navigation: {
			nextEl: ".knowledge-block_gallery_swiper-btn.is-next",
			prevEl: ".knowledge-block_gallery_swiper-btn.is-prev",
		},
	});
}

export function thingsToWatchLandingSlider() {
	const sliderOneElement = document.querySelector(".things-to-watch-out-for-mobile_swiper");
	if (sliderOneElement) {
		new Swiper(sliderOneElement, {
			modules: [Navigation],
			slidesPerView: 1.3,
			speed: 600,
			spaceBetween: 16,
			breakpoints: {
				992: {
					slidesPerView: 4.5,
					spaceBetween: 8,
				},
				768: {
					slidesPerView: 2.7,
					spaceBetween: 20,
				},
			},
			navigation: {
				disabledClass: "is-disabled",
				nextEl: ".things-to-watch-out-for-mobile_slider-btn-next",
				prevEl: ".things-to-watch-out-for-mobile_slider-btn-prev",
			},
		});
	}

	const sliderTwoElement = document.querySelector(".things-to-watch-out-for-mobile_swiper-2");
	if (sliderTwoElement) {
		new Swiper(sliderTwoElement, {
			modules: [Navigation],
			slidesPerView: 1.3,
			speed: 600,
			spaceBetween: 16,
			breakpoints: {
				992: {
					slidesPerView: 4.5,
					spaceBetween: 8,
				},
				768: {
					slidesPerView: 2.7,
					spaceBetween: 20,
				},
			},
			navigation: {
				disabledClass: "is-disabled",
				nextEl: ".things-to-watch-out-for-mobile_slider-btn-next-2",
				prevEl: ".things-to-watch-out-for-mobile_slider-btn-prev-2",
			},
		});
	}
}

export function boothFeaturesSlider() {
	const swiperTarget = document.querySelector('[data-features-slider="target"]');

	if (!swiperTarget) return;

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation, Autoplay],
		autoplay: {
			delay: 3000,
		},
		loop: true,
		slidesPerView: 1.3,
		speed: 800,
		spaceBetween: 20,
		breakpoints: {
			768: {
				centeredSlides: true,
				slidesPerView: 4,
			},
			992: {
				slidesPerView: 4.2,
				centeredSlides: true,
				spaceBetween: 32,
			},
		},
		navigation: {
			nextEl: ".features-slider_swiper-btn.is-next",
			prevEl: ".features-slider_swiper-btn.is-prev",
		},
	});
}

export function gallerySlider() {
	const swiperTargets = document.querySelectorAll('[data-swiper-target="gallery"]');

	if (!swiperTargets.length) return;

	swiperTargets.forEach((target) => {
		const swiper = new Swiper(target, {
			modules: [Navigation, Autoplay],
			slidesPerView: 1.1,
			speed: 800,
			spaceBetween: 20,
			breakpoints: {
				768: {
					slidesPerView: 1.5,
				},
				992: {
					spaceBetween: 32,
					slidesPerView: "auto",
				},
			},
		});

		// Get all navigation buttons
		const prevButtons = document.querySelectorAll(".gallery-slider_cursor-nav-btn.prev, .gallery-slider_nav-btn.prev");
		const nextButtons = document.querySelectorAll(".gallery-slider_cursor-nav-btn.next, .gallery-slider_nav-btn.next");

		// Function to update disabled states
		const updateNavigationState = () => {
			const isBeginning = swiper.isBeginning;
			const isEnd = swiper.isEnd;

			// Update prev buttons
			prevButtons.forEach((button) => {
				if (isBeginning) {
					button.classList.add("is-disabled");
				} else {
					button.classList.remove("is-disabled");
				}
			});

			// Update next buttons
			nextButtons.forEach((button) => {
				if (isEnd) {
					button.classList.add("is-disabled");
				} else {
					button.classList.remove("is-disabled");
				}
			});
		};

		// Add event listeners for navigation
		prevButtons.forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				if (!button.classList.contains("is-disabled")) {
					swiper.slidePrev();
				}
			});
		});

		nextButtons.forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				if (!button.classList.contains("is-disabled")) {
					swiper.slideNext();
				}
			});
		});

		// Listen to swiper events to update navigation state
		swiper.on("slideChange", updateNavigationState);
		swiper.on("reachBeginning", updateNavigationState);
		swiper.on("reachEnd", updateNavigationState);
		swiper.on("fromEdge", updateNavigationState);

		// Set initial state
		updateNavigationState();
	});
}

export function productCompareSlider() {
	const swiperTargets = document.querySelectorAll('[data-swiper-target="product-compare"]');

	if (!swiperTargets.length) return;

	swiperTargets.forEach((target) => {
		// Localized CMS fallbacks can render an empty collection without its wrapper.
		// Swiper requires that wrapper; skip empty targets so site initialization continues.
		if (!target.querySelector('.swiper-wrapper')) return;
		const swiper = new Swiper(target, {
			slidesPerView: 1.05,
			speed: 800,
			spaceBetween: 4,
			breakpoints: {
				768: {
					slidesPerView: 1.5,
				},
			},
		});
	});
}

export function soundFeaturesSlider() {
	const swiperTargets = document.querySelectorAll('[data-swiper-target="sound-features"]');

	if (!swiperTargets.length) return;

	let swiperInstances = [];
	let initBreakpoint = 991;

	function initSwipers() {
		swiperTargets.forEach((target) => {
			const swiper = new Swiper(target, {
				slidesPerView: 1.3,
				speed: 800,
				spaceBetween: 20,
				breakpoints: {
					768: {
						slidesPerView: 1.5,
					},
				},
			});

			swiperInstances.push(swiper);
		});
	}

	function destroySwipers() {
		swiperInstances.forEach((instance) => {
			instance.destroy(true, true);
		});
	}

	function breakpointHandler() {
		const viewportWidth = window.innerWidth;
		if (viewportWidth <= initBreakpoint) {
			initSwipers();
		} else {
			destroySwipers();
		}
	}

	// Init or not init swiper on page load
	breakpointHandler();

	window.addEventListener("resize", breakpointHandler);
}

export function accordionSyncImagesSlider() {
	const swiperTargets = document.querySelectorAll('[data-swiper-target="accordion-img-sync"]');

	if (!swiperTargets.length) return;

	swiperTargets.forEach((target) => {
		const accordionSyncName = target.getAttribute("data-accordion-sync");
		const accordionSyncInstance = document.querySelector(`[data-swiper-sync="${accordionSyncName}"]`);

		const swiper = new Swiper(target, {
			// allowTouchMove: false,
			modules: [EffectFade],
			effect: "fade",
			fadeEffect: {
				crossFade: true, // This ensures proper fade transition
			},
			speed: 600,
			slidesPerView: 1,
			spaceBetween: 0,
		});

		if (accordionSyncInstance) {
			accordionSyncInstance.addEventListener("accordionChange", (e) => {
				const { activeIndex, animationDuration } = e.detail;

				swiper.slideTo(activeIndex, animationDuration);
			});
		}
	});
}
