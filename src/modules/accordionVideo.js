export function accordionVideo() {
  const videoWraps = document.querySelectorAll(
    ".design-accordion_video-wrap"
  );

  if (!videoWraps.length) return;

  function resetBlock(wrap) {
    const video = wrap.querySelector(".accordion-video-element");
    const poster = wrap.querySelector(".accordion-video-poster");
    const button = wrap.querySelector(".external-video_play-btn");

    if (!video) return;

    video.pause();
    video.controls = false;
    video.style.opacity = "0";

    if (poster) {
      poster.style.display = "block";
    }

    if (button) {
      button.style.opacity = "1";
      button.style.pointerEvents = "auto";
    }
  }

  videoWraps.forEach((wrap) => {
    const video = wrap.querySelector(".accordion-video-element");
    const poster = wrap.querySelector(".accordion-video-poster");
    const button = wrap.querySelector(".external-video_play-btn");

    if (!video || !button) return;

    let isLoaded = Boolean(video.getAttribute("src"));

    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const src = video.dataset.src;

      if (!src) {
        console.warn(
          "Accordion video: data-src is missing",
          video
        );
        return;
      }

      videoWraps.forEach((otherWrap) => {
        if (otherWrap !== wrap) {
          resetBlock(otherWrap);
        }
      });

      if (!isLoaded) {
        video.src = src;
        video.load();
        isLoaded = true;
      }

      try {
        await video.play();

        video.style.opacity = "1";
        video.controls = true;

        if (poster) {
          poster.style.display = "none";
        }

        button.style.opacity = "0";
        button.style.pointerEvents = "none";
      } catch (error) {
        console.warn("Accordion video play failed", error);
      }
    });

    video.addEventListener("pause", () => {
      button.style.opacity = "1";
      button.style.pointerEvents = "auto";
      video.controls = false;
    });

    video.addEventListener("ended", () => {
      button.style.opacity = "1";
      button.style.pointerEvents = "auto";

      video.controls = false;
      video.currentTime = 0;
      video.style.opacity = "0";

      if (poster) {
        poster.style.display = "block";
      }
    });
  });
}