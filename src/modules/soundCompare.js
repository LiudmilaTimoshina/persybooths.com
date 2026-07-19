import { gsap } from "gsap";

const TRACK_DURATION = 45;

const OUTSIDE_AUDIO_URL =
  "https://cdn.prod.website-files.com/6801d6dc5d6eee6b305b8333/68d4f3a55d5e088a819a848b_Persy%20Booths_AMB_45s_No%20Filter_V5.mp3";

const INSIDE_AUDIO_URL =
  "https://cdn.prod.website-files.com/6801d6dc5d6eee6b305b8333/68d4f3a52d008733491a68fc_Persy%20Booths_AMB_45s_Filter_V5.mp3";

export function soundCompare() {
  const animationTarget = document.querySelector(
    "[data-sound-animation-target]"
  );

  if (!animationTarget) return;

  const playButton = animationTarget.querySelector(
    '[data-sound-play="button"]'
  );
  const playIcon = animationTarget.querySelector(
    '[data-sound-play="icon-play"]'
  );
  const pauseIcon = animationTarget.querySelector(
    '[data-sound-play="icon-pause"]'
  );

  const environmentButtons = animationTarget.querySelectorAll(
    "[data-sound-environment]"
  );
  const environmentActiveBg = animationTarget.querySelector(
    "[data-sound-active-environment]"
  );
  const envControlsWrap = animationTarget.querySelector(
    ".product-sound_env-controls"
  );

  const outsideNoiseWave = animationTarget.querySelector(
    '[data-sound-wave="outside"]'
  );
  const insideNoiseWave = animationTarget.querySelector(
    '[data-sound-wave="inside"]'
  );

  if (
    !playButton ||
    !playIcon ||
    !pauseIcon ||
    !environmentActiveBg ||
    !envControlsWrap ||
    !outsideNoiseWave ||
    !insideNoiseWave
  ) {
    console.warn("[Sound compare] Required elements are missing.");
    return;
  }

  const outsideNoise = new Audio();
  const insideNoise = new Audio();

  outsideNoise.preload = "none";
  insideNoise.preload = "none";

  insideNoise.muted = true;

  let isPrepared = false;
  let isPlaying = false;
  let currentActiveEnvironment = "outside";
  let resizeTimeout;

  const soundWaveTl = gsap.timeline({ paused: true });

  soundWaveTl.fromTo(
    animationTarget.querySelectorAll(".animated-sound-wave"),
    {
      drawSVG: "100% 100%",
    },
    {
      drawSVG: "0% 100%",
      duration: TRACK_DURATION,
      ease: "none",
    }
  );

  function prepareAudio() {
    if (isPrepared) return;

    isPrepared = true;

    outsideNoise.src = OUTSIDE_AUDIO_URL;
    insideNoise.src = INSIDE_AUDIO_URL;

    outsideNoise.load();
    insideNoise.load();
  }

  function syncAudioPositions() {
    const timelineTime = soundWaveTl.time();

    if (
      Number.isFinite(outsideNoise.duration) &&
      Math.abs(outsideNoise.currentTime - timelineTime) > 0.15
    ) {
      outsideNoise.currentTime = timelineTime;
    }

    if (
      Number.isFinite(insideNoise.duration) &&
      Math.abs(insideNoise.currentTime - timelineTime) > 0.15
    ) {
      insideNoise.currentTime = timelineTime;
    }
  }

  function toggleEnvironment(environment) {
    if (environment === "outside") {
      outsideNoise.muted = false;
      insideNoise.muted = true;

      outsideNoiseWave.style.opacity = "1";
      insideNoiseWave.style.opacity = "0";
    } else {
      outsideNoise.muted = true;
      insideNoise.muted = false;

      insideNoiseWave.style.opacity = "1";
      outsideNoiseWave.style.opacity = "0";
    }
  }

  function showPlayIcon() {
    playIcon.style.display = "flex";
    pauseIcon.style.display = "none";
  }

  function showPauseIcon() {
    playIcon.style.display = "none";
    pauseIcon.style.display = "flex";
  }

  async function playAudio() {
    prepareAudio();
    syncAudioPositions();

    try {
      await Promise.all([
        outsideNoise.play(),
        insideNoise.play(),
      ]);

      isPlaying = true;
      showPauseIcon();
      soundWaveTl.play();
    } catch (error) {
      isPlaying = false;
      showPlayIcon();
      soundWaveTl.pause();

      console.warn("[Sound compare] Audio play failed:", error);
    }
  }

  function pauseAudio() {
    isPlaying = false;

    outsideNoise.pause();
    insideNoise.pause();

    soundWaveTl.pause();
    showPlayIcon();
  }

  function toggleAudio() {
    if (isPlaying) {
      pauseAudio();
      return;
    }

    playAudio();
  }

  function resetAudio() {
    isPlaying = false;

    outsideNoise.pause();
    insideNoise.pause();

    outsideNoise.currentTime = 0;
    insideNoise.currentTime = 0;

    soundWaveTl.pause();
    soundWaveTl.progress(0);

    showPlayIcon();
  }

  function setEnvironmentActiveBtn(activeButton) {
    const wrapRect = envControlsWrap.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();

    const btnLeft = btnRect.left - wrapRect.left;

    gsap.to(environmentActiveBg, {
      width: activeButton.offsetWidth,
      left: btnLeft,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  function handleResize() {
    const activeButton = animationTarget.querySelector(
      `[data-sound-environment="${currentActiveEnvironment}"]`
    );

    if (activeButton) {
      setEnvironmentActiveBtn(activeButton);
    }
  }

  playButton.addEventListener(
    "pointerdown",
    prepareAudio,
    { once: true }
  );

  playButton.addEventListener("click", toggleAudio);

  environmentButtons.forEach((button) => {
    const environment = button.dataset.soundEnvironment;

    if (environment === "outside") {
      setEnvironmentActiveBtn(button);
    }

    button.addEventListener("click", () => {
      toggleEnvironment(environment);
      currentActiveEnvironment = environment;
      setEnvironmentActiveBtn(button);
    });
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });

  outsideNoise.addEventListener("ended", resetAudio);
  insideNoise.addEventListener("ended", resetAudio);
}
