import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function dottedBoothPin() {
	const dots = document.querySelector('[data-dots-pin="image"]');
	if (!dots) return;

	let mm = gsap.matchMedia();

	mm.add("(min-width: 992px)", () => {
		// Pinnning dotted booth image
		let dotsPin = ScrollTrigger.create({
			trigger: dots,
			pin: dots,
			pinSpacing: false,
			start: "center center",
			endTrigger: '[data-features-scroll="content-layer"]',
			end: "top top",
			onLeave: () => {
				gsap.set(dots, { opacity: 0 });
			},
			onEnterBack: () => {
				gsap.set(dots, { opacity: 1 });
			},
		});
	});
}

export function boothScrollAnimation() {
	const contentLayer = document.querySelector('[data-features-scroll="content-layer"]');
	if (!contentLayer) return;
	const imageLayer = document.querySelector('[data-features-scroll="image-layer"]');
	const leftItems = document.querySelectorAll('[data-features-scroll="left-item"]');
	const rightItems = document.querySelectorAll('[data-features-scroll="right-item"]');
	const modalBtns = document.querySelectorAll('[data-features-scroll="modal-trigger"]');
	const boothImgWrap = document.querySelector('[data-features-scroll="booth-img-wrap"]');
	const boothImg = document.querySelector('[data-features-scroll="booth-img"]');
	const animationBuffer = 800;

	if (boothImg.complete) {
		initScrollAnimation();
	} else {
		boothImg.addEventListener("load", initScrollAnimation);
	}

	function initScrollAnimation() {
		// Calculations for boothPin end
		const windowHeight = window.innerHeight;
		const imgHeight = boothImg.offsetHeight;
		const bottomSpace = (windowHeight - imgHeight) / 2;

		// Timeline for booth image scaling
		let boothScaleTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: imageLayer,
				start: "top top",
				end: () => {
					return "+=" + animationBuffer * leftItems.length;
				},
				scrub: true,
			},
		});

		boothScaleTimeline.to(boothImgWrap, {
			scale: 0.9, // Target scale, adjust as needed
			ease: "none",
		});

		let contentLayerPin = ScrollTrigger.create({
			trigger: contentLayer,
			start: "top top",
			pin: true,
			end: () => {
				return "+=" + animationBuffer * leftItems.length;
			},
			pinspacing: true,
		});

		let imageLayerPin = ScrollTrigger.create({
			trigger: imageLayer,
			pin: true,
			start: "top top",
			end: () => {
				return "+=" + (animationBuffer * leftItems.length + 700 + bottomSpace);
			},
			pinSpacing: false,
		});

		// Creating scroll animation for each feature item
		leftItems.forEach((leftItem, index) => {
			const rightItem = rightItems[index];
			const modalBtn = modalBtns[index];
			let featuresChangeTl = gsap.timeline({
				scrollTrigger: {
					toggleActions: "play none none reverse",
					trigger: ".features-scroll_wrap",
					start: () => {
						return index * animationBuffer + "px";
					},
					end: "+=200px",
					scrub: false,
					preventOverlaps: true,
				},
			});

			if (index !== 0) {
				featuresChangeTl
					.to([leftItems[index - 1], rightItems[index - 1], modalBtns[index - 1]], {
						opacity: 0,
					})
					.fromTo(
						[leftItem, rightItem, modalBtn],
						{
							opacity: 0,
						},
						{
							opacity: 1,
						}
					);
			}
		});
	}
	ScrollTrigger.refresh();
}

export function usageHoverAnimation() {
	const headings = document.querySelectorAll('[data-usage-hover="heading"]');
	const images = document.querySelectorAll('[data-usage-hover="image"]');

	// Ensure there are both headings and images
	if (!headings.length || !images.length) return;

	headings.forEach((heading, index) => {
		// Getting current heading image
		const image = images[index];

		heading.addEventListener("mouseenter", () => {
			gsap.to(image, { autoAlpha: 1, duration: 0.2 });
			gsap.to(heading, {
				opacity: 1,
				duration: 0.2,
			});

			// Changing sibling headings
			headings.forEach((sibling) => {
				if (sibling !== heading) {
					sibling.classList.add("no-hover");
					gsap.to(sibling, {
						opacity: 0.25,
						duration: 0.2,
					});
				}
			});

			// Hiding sibling images
			images.forEach((sibling) => {
				if (sibling !== image) {
					gsap.to(sibling, { autoAlpha: 0, duration: 0.2 });
				}
			});
		});

		heading.addEventListener("mouseleave", () => {
			// Reset all headings to black when mouse leaves
			headings.forEach((sibling) => {
				sibling.classList.remove("no-hover");
			});
		});
	});
}

export function reasonsSliderHover() {
	const slides = document.querySelectorAll('[data-reasons-slider="slide"]');
	if (!slides.length) return;

	const swiperWrapper = document.querySelector('[data-reasons-slider="wrap"]');
	let descriptionMaxHeight = 0;

	let mm = gsap.matchMedia();

	mm.add("(min-width: 992px)", () => {
		slides.forEach((slide, index) => {
			const slideContent = slide.querySelector('[data-reasons-slider="content"]');
			const slideDescription = slide.querySelector('[data-reasons-slider="description"]');
			const descriptionHeight = slideDescription.offsetHeight;
			if (descriptionHeight > descriptionMaxHeight) {
				descriptionMaxHeight = descriptionHeight;
			}
			let hoverTl = gsap.timeline({ paused: true });

			hoverTl
				.to(slideContent, {
					backgroundColor: "#E8EFBD",
					duration: 0.2,
					y: "-0.5rem",
				})
				.to(
					slideDescription,
					{
						y: "-100%",
						duration: 0.2,
					},
					"<"
				);

			slide.addEventListener("mouseover", () => {
				hoverTl.play();
			});
			slide.addEventListener("mouseout", () => {
				hoverTl.reverse();
			});
		});

		// Adjust slider wrap top-padding to match the heighest description
		gsap.set(swiperWrapper, {
			paddingTop: descriptionMaxHeight + "px",
		});
	});
}

export function rotatingText() {
	const wordWraps = document.querySelectorAll('[data-rotating-text="wrap"]');
	if (!wordWraps.length) return;

	wordWraps.forEach((wrap) => {
		const words = gsap.utils.toArray(".product-hero_rotating-text", wrap);

		if (!words.length) return;

		const tl = gsap.timeline({
			repeat: -1,
		});
		gsap.set(words, {
			yPercent: (i) => (i ? 100 : 0),
			opacity: 1,
		});

		words.forEach((word, i) => {
			const next = words[i + 1];

			if (next) {
				// Animate current word up and next word into view
				tl.to(word, { yPercent: -100, duration: 0.8, ease: "power2.out" }, "+=1.5").to(next, { yPercent: 0, duration: 0.8, ease: "power2.out" }, "<");
			} else {
				// Final word: animate up and loop back to the first word
				tl.to(word, { yPercent: -100, duration: 0.8, ease: "power2.out" }, "+=1.5").fromTo(
					words[0],
					{ yPercent: 100 },
					{ yPercent: 0, immediateRender: false, duration: 0.8, ease: "power2.out" },
					"<"
				);
			}
		});
	});
}

export function indexMobilityPinAnimation() {
	const pinSection = document.querySelector('[data-index-mobility-animation="section"]');
	if (!pinSection) return;

	const nextSection = pinSection.nextElementSibling; // Select next element
	const videoBlock = pinSection.querySelector('[data-index-mobility-animation="video-block"]');

	let mm = gsap.matchMedia();

	mm.add("(min-width: 992px)", () => {
		let pinAnimation = gsap.timeline({
			scrollTrigger: {
				refreshPriority: -1,
				trigger: videoBlock,
				pin: videoBlock,
				pinSpacing: false,
				start: "center center",
				endTrigger: nextSection,
				end: "top top",
				scrub: 0.1,
			},
		});

		// Add the animation to the timeline
		pinAnimation.to(videoBlock, {
			scale: 0.85,
			ease: "linear",
		});

		ScrollTrigger.refresh();
	});
}

export function indexHeroScroll() {
	const heroSection = document.querySelector('[data-index-hero-scroll="section"]');
	if (!heroSection) return;

	const heroSwiper = document.querySelector('[data-index-hero-scroll="swiper"]');

	// create
	let mm = gsap.matchMedia();

	// add a media query. When it matches, the associated function will run
	mm.add("(min-width: 992px)", () => {
		let tl = gsap.timeline({
			scrollTrigger: {
				trigger: heroSection,
				start: "top top",
				end: "bottom top",
				scrub: 0.01,
			},
		});

		tl.to(heroSection, {
			borderBottomLeftRadius: "10px",
			borderBottomRightRadius: "10px",
			duration: 0.1,
		}).to(
			heroSwiper,
			{
				y: "15%",
				ease: "linear",
			},
			"<"
		);
	});
}

export async function draggableCardsAnimation() {
	const cards = document.querySelectorAll(
		'[data-draggable-cards="card"]'
	);

	if (!cards.length) return;

	const cardsContainer = document.querySelector(
		'[data-draggable-cards="container"]'
	);

	if (!cardsContainer) return;

	const { Draggable } = await import("gsap/Draggable");

	gsap.registerPlugin(Draggable);

	const mm = gsap.matchMedia();

	mm.add("(min-width: 769px)", () => {
		const instances = [];

		cards.forEach((card) => {
			const createdInstances = Draggable.create(card, {
				bounds: cardsContainer,
			});

			instances.push(...createdInstances);
		});

		return () => {
			instances.forEach((instance) => instance.kill());
		};
	});
}

export function aboutValuesListHover() {
	const valueItems = document.querySelectorAll('[data-values-hover="item"]');

	if (!valueItems.length) return;

	// Set active item
	function setActiveItem(hoveredItem) {
		valueItems.forEach((item) => {
			item.classList.toggle("is-active", item === hoveredItem);
		});
	}

	// Disable hover on all except the current item
	function debounceHover(hoveredItem) {
		valueItems.forEach((item) => {
			item.classList.toggle("no-hover", item !== hoveredItem);
		});
	}

	// Remove hover locks
	function resetHoverState() {
		valueItems.forEach((item) => {
			item.classList.remove("no-hover");
		});
	}

	// Event Listeners
	valueItems.forEach((item, index) => {
		if (index === 0) {
			setActiveItem(item);
		}

		item.addEventListener("mouseenter", () => {
			debounceHover(item);
			setActiveItem(item);
		});

		item.addEventListener("mouseleave", resetHoverState);
	});
}

export function aboutCardsExpand() {
	const button = document.querySelector('[data-about-expand="button"]');
	if (!button) return;

	const container = document.querySelector('[data-about-expand="container"]');
	const cardsWrap = container.querySelector('[data-about-expand="cards-wrap"]');
	const overlay = container.querySelector('[data-about-expand="overlay"]');

	const cardsHeight = cardsWrap.offsetHeight;

	button.addEventListener("click", () => {
		gsap.to(container, {
			height: cardsHeight,
			duration: 0.5,
			ease: "power2.inOut",
		});
		gsap.set(overlay, {
			autoAlpha: 0,
		});
	});
}

export function productFeaturesVideo() {
	const featureItems = document.querySelectorAll(".product-features_wrap");
	if (!featureItems.length) return;

	featureItems.forEach((item) => {
		const featureVideo = item.querySelector("video");
		const featureImage = item.querySelector(".product-features_image");
		item.addEventListener("mouseenter", () => {
			if (featureVideo) {
				featureVideo.play();
			}
			if (featureImage && featureVideo) {
				gsap.to(featureImage, {
					opacity: 0,
					duration: 0.3,
				});
			}
		});
		item.addEventListener("mouseleave", () => {
			if (featureVideo) {
				featureVideo.currentTime = 0;
				featureVideo.pause();
			}
			if (featureImage && featureVideo) {
				gsap.to(featureImage, {
					opacity: 1,
					duration: 0.3,
				});
			}
		});
	});
}

export function initStackingNav() {
	const cards = document.querySelectorAll(".comparison-features_card");

	if (!cards.length) return;

	cards.forEach((card, index) => {
		const previousCards = Array.from(cards).slice(0, index);

		// Scale animation for stacking cards
		gsap
			.timeline({
				scrollTrigger: {
					trigger: card,
					start: "top 100%", // Start at 35% for smoother transitions
					end: "top top",
					scrub: 1,
				},
			})
			.to(previousCards, {
				scale: (i) => 1 - 0.064 * (index - i), // Reduce size by 64px per card
				ease: "power1.out", // Smooth easing
			});

		// Overlay opacity animation
		const overlay = card.querySelector(".comaprison-features_card-overlay");
		if (overlay) {
			gsap
				.timeline({
					scrollTrigger: {
						trigger: card,
						start: "top 60%", // Start opacity change when overlap begins
						end: "bottom top", // Gradual fade as card moves
						scrub: 1,
					},
				})
				.to(overlay, {
					opacity: 1, // Animate overlay to full opacity
					duration: 20, // Extend duration for slower transition
					ease: "power1.inOut",
				});
		}
	});
}

export function imageParallaxAnimation() {
	const parallaxWraps = document.querySelectorAll("[data-image-parallax]");

	if (!parallaxWraps.length) return;

	parallaxWraps.forEach((wrap) => {
		const images = wrap.querySelectorAll("img");

		let tl = gsap.timeline();

		ScrollTrigger.create({
		trigger: wrap,
		start: "top bottom",
		end: "bottom top",
		scrub: true,
		animation: tl,
		});

		tl.to(images, {
			top: "0%",
			ease: "linear",
			overwrite: true,
		});
	});
}
