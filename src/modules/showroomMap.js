import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { gsap } from "gsap";

export async function showroomMap() {
	const mapContainer = document.querySelector('[data-showroom-map="container"]');

	if (!mapContainer) return;

	const zoomLevel = parseInt(mapContainer.dataset.zoom) || 5;
	const centerLat = parseFloat(mapContainer.dataset.centerLat) || 51.0569311;
	const centerLng = parseFloat(mapContainer.dataset.centerLng) || 5.177956;

	const centerCoordinate = { lat: centerLat, lng: centerLng };

	const showroomListItems = document.querySelectorAll("[data-showroom-list-item]");
	let markers = [];

	// Importing libraries
	const { Map } = await google.maps.importLibrary("maps");
	const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

	const zoomInButton = document.querySelector('[data-showroom-zoom-btn="zoom-in"]');
	const zoomOutButton = document.querySelector('[data-showroom-zoom-btn="zoom-out"]');

	// Showroom content wraps
	const listWrap = document.querySelector('[data-showroom-list="wrap"]');
	const infoWrap = document.querySelector('[data-showroom-info="wrap"]');

	// Active marker var for removing class when another info window is open
	let activeMarker = null;

	// Showroom info data elements
	const showroomClose = document.querySelector('[data-showroom-info="close"]');
	const showroomInfoName = document.querySelector('[data-showroom-info="name"]');
	const showroomInfoDescription = document.querySelector('[data-showroom-info="description"]');
	const showroomInfoAddress = document.querySelector('[data-showroom-info="address"]');
	const showroomInfoHours = document.querySelector('[data-showroom-info="hours"]');
	const showroomInfoHoursBlock = document.querySelector('[data-showroom-info="hours-block"]');
	const showroomInfoBooking = document.querySelector('[data-showroom-info="booking"]');

	// Functions

	function findClusterContainingMarker(marker) {
		for (const [clusterElement, markersInCluster] of clusterToMarkersMap.entries()) {
			if (markersInCluster.includes(marker)) {
				return clusterElement; // Return the cluster's DOM element
			}
		}
		return null; // If no cluster found
	}

	function displayMarkerTooltip(name, address, marker) {
		infoWindow.setContent(`<div class="showroom_map_tooltip-wrap">
			<h3 class="button-style-s">${name}</h3>
			<span class="button-style-s text-color-dark-grey">${address}</span>
			</div>`);
		infoWindow.open(marker.map, marker);
	}

	function hideMarkerTooltip() {
		infoWindow.close();
	}

	function zoomInToLocation(marker) {
		// Zoom in to location
		let bounds = new google.maps.LatLngBounds();
		bounds.extend(marker.position);
		map.fitBounds(bounds);
		// Optionally, prevent zooming in too much
		setTimeout(() => {
			if (map.getZoom() > 13) {
				// Adjust max zoom level as needed
				map.setZoom(13);
			}
		}, 300); // Give time for fitBounds to apply
	}

	function displayFullInfo(itemData, marker) {
		// Center map to the active marker
		// map.panTo(marker.position);
		// map.setZoom(6);

		showroomInfoName.textContent = itemData.name;
		showroomInfoDescription.textContent = itemData.description;
		showroomInfoAddress.textContent = itemData.address;
		showroomInfoBooking.href = itemData.booking;
		// Spliting working hours by ;
		const splitHours = itemData.hours.split(";");
		showroomInfoHours.innerHTML = splitHours.join("<br>");

		// Hide hours info row if no hours set
		if (!showroomInfoHours.textContent) {
			gsap.set(showroomInfoHoursBlock, {
				autoAlpha: 0,
			});
		} else {
			gsap.set(showroomInfoHoursBlock, {
				autoAlpha: 1,
			});
		}

		if (activeMarker) {
			activeMarker.content.classList.remove("is-open");
		}

		marker.content.classList.add("is-open");
		activeMarker = marker;

		let tl = gsap.timeline();

		tl.set(listWrap, {
			position: "absolute",
		})
			.set(infoWrap, {
				position: "static",
			})
			.to(infoWrap, {
				autoAlpha: 1,
				duration: 0.2,
				ease: "linear",
			})
			.to(
				listWrap,
				{
					autoAlpha: 0,
					duration: 0.2,
					ease: "linear",
				},
				"<"
			);
	}

	function hideFullInfo() {
		if (activeMarker) {
			activeMarker.content.classList.remove("is-open");
		}

		map.setZoom(5);

		let tl = gsap.timeline();

		tl.set(infoWrap, {
			position: "absolute",
		})
			.set(listWrap, {
				position: "static",
			})
			.to(listWrap, {
				autoAlpha: 1,
				duration: 0.2,
				ease: "linear",
			})
			.to(
				infoWrap,
				{
					autoAlpha: 0,
					duration: 0.2,
					ease: "linear",
				},
				"<"
			);
	}

	// 1. Initialize the map
	const map = new Map(mapContainer, {
		center: centerCoordinate,
		zoom: zoomLevel,
		fullscreenControl: false,
		mapTypeControl: false,
		streetViewControl: false,
		zoomControl: false,
		mapId: "85116a18845892ec", // Replace with your valid Map ID
		gestureHandling: "cooperative",
	});

	// Disabling lenis when using CMD + Mousewheel to zoomin/out
	mapContainer.addEventListener("wheel", (event) => {
		if (event.ctrlKey || event.metaKey) {
			window.lenis?.stop();

			// Wait for the zooming to stop, then re-enable Lenis
			clearTimeout(window.zoomTimeout);
			window.zoomTimeout = setTimeout(() => {
				window.lenis?.start();
			}, 300); // Adjust delay as needed
		}
	});

	// Create an InfoWindow instance
	const infoWindow = new google.maps.InfoWindow();

	// 2. Add markers to the map
	showroomListItems.forEach((listItem) => {
		// Getting data for each list item
		let itemData = {};
		itemData.name = listItem.getAttribute("data-showroom-list-name");
		itemData.address = listItem.getAttribute("data-showroom-list-address");
		itemData.description = listItem.getAttribute("data-showroom-list-description");
		itemData.slug = listItem.getAttribute("data-showroom-list-item");
		itemData.lat = Number(listItem.getAttribute("data-showroom-list-lat"));
		itemData.lng = Number(listItem.getAttribute("data-showroom-list-lng"));
		itemData.hours = listItem.getAttribute("data-showroom-list-hours");
		itemData.booking = listItem.getAttribute("data-showroom-list-booking");

		// Creating custom marker
		const customMarker = document.createElement("div");
		customMarker.className = "showroom_map_marker-wrap";
		customMarker.setAttribute("data-showroom-marker-item", itemData.slug);
		customMarker.innerHTML = `
		<div class="showroom_map_marker-icon">
            <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M8.00078 1.3999C10.5968 1.3999 12.7008 3.5039 12.7008 6.0999C12.7008 10.9649 8.00078 14.6249 8.00078 14.6249C8.00078 14.6249 3.30078 10.9649 3.30078 6.0999C3.30078 3.5039 5.40478 1.3999 8.00078 1.3999Z" stroke="currentColor" stroke-miterlimit="10"/>
	<path d="M8.00116 7.79284C8.87984 7.79284 9.59216 7.08052 9.59216 6.20184C9.59216 5.32315 8.87984 4.61084 8.00116 4.61084C7.12247 4.61084 6.41016 5.32315 6.41016 6.20184C6.41016 7.08052 7.12247 7.79284 8.00116 7.79284Z" stroke="currentColor" stroke-miterlimit="10"/>
	</svg>
	</div>
	
        `;

		// Add an advanced marker
		const marker = new AdvancedMarkerElement({
			map,
			position: { lat: itemData.lat, lng: itemData.lng },
			content: customMarker,
			gmpClickable: true,
			title: itemData.name,
		});

		markers.push(marker);

		marker.addListener("click", () => {
			displayMarkerTooltip(itemData.name, itemData.address, marker);
			displayFullInfo(itemData, marker);
			zoomInToLocation(marker);
		});

		marker.content.addEventListener("mouseenter", () => {
			const relatedListItem = document.querySelector(`[data-showroom-list-item=${itemData.slug}]`);
			if (relatedListItem) {
				relatedListItem.classList.add("is-hovered");
			}
		});

		marker.content.addEventListener("mouseleave", () => {
			const relatedListItem = document.querySelector(`[data-showroom-list-item=${itemData.slug}]`);
			if (relatedListItem) {
				relatedListItem.classList.remove("is-hovered");
			}
		});

		listItem.addEventListener("mouseenter", () => {
			const relatedMarker = document.querySelector(`[data-showroom-marker-item="${itemData.slug}"]`);
			if (relatedMarker) {
				relatedMarker.classList.add("is-hovered");
			}

			// Find and highlight the cluster that contains this marker
			const marker = markers.find((m) => m.position.lat === itemData.lat && m.position.lng === itemData.lng);
			if (marker) {
				const cluster = findClusterContainingMarker(marker);
				if (cluster) {
					cluster.classList.add("is-hovered");
				}
			}
		});

		listItem.addEventListener("click", () => {
			displayMarkerTooltip(itemData.name, itemData.address, marker);
			displayFullInfo(itemData, marker);
			zoomInToLocation(marker);
		});

		listItem.addEventListener("mouseleave", () => {
			const relatedMarker = document.querySelector(`[data-showroom-marker-item="${itemData.slug}"]`);
			if (relatedMarker) {
				relatedMarker.classList.remove("is-hovered");
			}

			// Remove highlight from the cluster
			const marker = markers.find((m) => m.position.lat === itemData.lat && m.position.lng === itemData.lng);
			if (marker) {
				const cluster = findClusterContainingMarker(marker);
				if (cluster) {
					cluster.classList.remove("is-hovered");
				}
			}
		});
	});

	// Add event listeners for zoom buttons
	zoomInButton.addEventListener("click", (e) => {
		e.preventDefault();
		map.setZoom(map.getZoom() + 1);
	});
	zoomOutButton.addEventListener("click", (e) => {
		e.preventDefault();
		map.setZoom(map.getZoom() - 1);
	});

	// Add event listener to info wrap close btn
	showroomClose.addEventListener("click", () => {
		hideFullInfo();
		hideMarkerTooltip();
	});

	// 3. Add clustering with a custom renderer

	// Map to store cluster elements and their associated markers
	let clusterToMarkersMap = new window.Map();

	const markerCluster = new MarkerClusterer({
		markers,
		map,
		renderer: {
			render: ({ count, position, markers }) => {
				// Create custom cluster content
				const clusterElement = document.createElement("div");
				clusterElement.className = "showroom_map_cluster-marker caption-style-m";
				clusterElement.textContent = count; // Number of markers in the cluster

				// Store the cluster's markers inside our tracking Map
				clusterToMarkersMap.set(clusterElement, markers);
				return new google.maps.marker.AdvancedMarkerElement({
					position,
					content: clusterElement,
					gmpClickable: true,
				});
			},
		},
	});

	// Clear clusters on zoom change (when google reredners clusters)
	google.maps.event.addListener(map, "zoom_changed", () => {
		clusterToMarkersMap.clear();
	});
}

export function showroomSearch() {
	const searchInput = document.querySelector('[data-showroom-search="input"]');
	const listItems = document.querySelectorAll('[data-showroom-search="item"]');

	if (!searchInput || !listItems.length) return;

	let listArray = [];

	const listContainer = document.querySelector('[data-showroom-search="container"]');
	const listWrap = document.querySelector('[data-showroom-search="list"]');
	const clearBtn = document.querySelector('[data-showroom-search="clear"]');
	const form = document.querySelector('[data-showroom-search="form"]');
	const emptyBlock = document.querySelector('[data-showroom-search="empty-state"]');
	const loadMoreButton = document.querySelector('[data-showroom-load-more="btn"]');

	let loadMoreClicked = false;
	let loadMorePosts = [];
	let isEmptyState = false;

	// Creating object with list elements and their filter values

	listItems.forEach((post, index) => {
		let postData = {};
		// Get post values for filtering
		postData.element = post;
		postData.cityName = post.getAttribute("data-showroom-list-name").toLowerCase();
		postData.cityAddress = post.getAttribute("data-showroom-list-address").toLowerCase();

		// Create object entry
		listArray.push(postData);
	});

	function showEmptyState() {
		let tl = gsap.timeline();

		tl.set(emptyBlock, {
			display: "flex",
		})
			.set(listContainer, {
				display: "none",
			})
			.to(emptyBlock, {
				autoAlpha: 1,
				duration: 0.2,
				ease: "linear",
			});

		isEmptyState = true;
	}

	function hideEmptyState() {
		let tl = gsap.timeline();

		tl.set(emptyBlock, {
			display: "none",
			autoAlpha: 0,
		}).set(listContainer, {
			display: "block",
		});

		isEmptyState = false;
	}

	function filterItems(filterValue = "") {
		let filteredElements = [];
		listArray.forEach((post) => {
			// Check if either the city name or the address matches the input
			if (post.cityName.includes(filterValue) || post.cityAddress.includes(filterValue)) {
				// Show valid posts
				filteredElements.push(post.element);
			}
		});

		return filteredElements;
	}

	function updateList(filteredElements) {
		// Reset loadMorePosts array
		loadMorePosts = [];
		filteredElements.forEach((element, index) => {
			element.classList.remove("load-more-hide");
			if (index > 4 && !loadMoreClicked) {
				element.classList.add("load-more-hide");
				loadMorePosts.push(element);
			}
			listWrap.append(element);
		});
	}

	function showLoadMorePosts() {
		loadMorePosts.forEach((post) => {
			post.classList.remove("load-more-hide");
		});

		loadMoreButton.style.display = "none";
		loadMoreClicked = true;
	}

	function filterController(filterValue) {
		// 1. Get filtered elements array
		let filteredElements = filterItems(filterValue);

		// 2. Handle emtpy state
		if (!isEmptyState && !filteredElements.length) {
			showEmptyState();
		} else if (isEmptyState && filteredElements.length) {
			hideEmptyState();
		}

		// 3. Clear DOM list
		listWrap.innerHTML = "";

		// 4. Append filtered items
		updateList(filteredElements);

		// 5. Show or hide "View all" on mobile
		if (!loadMoreClicked && filteredElements.length > 5) {
			loadMoreButton.style.display = "block";
		} else if (!loadMoreClicked && filteredElements.length <= 5) {
			loadMoreButton.style.display = "none";
		}
	}

	filterController("");

	clearBtn.addEventListener("click", () => {
		searchInput.value = "";
		filterController();
	});

	searchInput.addEventListener("keyup", () => {
		const filterValue = searchInput.value.toLowerCase();
		filterController(filterValue);
	});

	loadMoreButton.addEventListener("click", showLoadMorePosts);

	// Prevent search input form from submitting
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		event.stopPropagation();
	});
}
