export function externalVideoPlayer() {
	const externalVideos = document.querySelectorAll(
  "[data-external-video-wrap]:not(.design-accordion_video-wrap)"
);

	if (!externalVideos.length) return;

	function toggleBtnState(videoButton, action) {
		if (action === "play") {
			videoButton.dataset.externalVideoBtn = "pause";
		} else {
			videoButton.dataset.externalVideoBtn = "play";
		}
	}

	function toggleVideo(videoEl, action) {
		if (action === "play") {
			videoEl.play();
		} else {
			videoEl.pause();
		}
	}

	function toggleVideoControls(videoButton, videoEl, action) {
		if (action === "play") {
			videoButton.style.opacity = 0;
			videoButton.style.pointerEvents = "none";
			videoEl.controls = true;
		} else {
			videoButton.style.opacity = 100;
			videoButton.style.pointerEvents = "auto";
			videoEl.controls = false;
		}
	}

	externalVideos.forEach((externalVideo) => {
		// Set video SRC from data attribute if there is one (for components like slider)
		const videoURL = externalVideo.dataset.externalVideoWrap;

		// Get video element for play/pause
		const videoEl = externalVideo.querySelector("video");

		// Play and Pause functionality
		const videoButton = externalVideo.querySelector("[data-external-video-btn]");

		if (videoURL) {
			const sourceEl = videoEl.querySelector("source");
			sourceEl.src = videoURL;
		}

		videoEl.load();

		videoButton.addEventListener("click", (e) => {
			e.preventDefault();

			const action = videoButton.dataset.externalVideoBtn;

			toggleVideo(videoEl, action);
			toggleVideoControls(videoButton, videoEl, action);
		});

		videoEl.addEventListener("pause", () => {
			toggleVideoControls(videoButton, videoEl, "pause");
		});

		videoEl.addEventListener("ended", () => {
			toggleBtnState(videoButton, "pause");
		});
	});
}
