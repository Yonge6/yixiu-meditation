(function () {
  "use strict";

  const previewButtons = [...document.querySelectorAll("[data-audio-preview]")];
  if (!previewButtons.length) return;

  let active = null;

  function report(event, parameters) {
    window.dispatchEvent(new CustomEvent("yixiu:analytics", {
      detail: { event, ...parameters },
    }));
  }

  function updateButton(button, playing) {
    button.setAttribute("aria-pressed", String(playing));
    button.classList.toggle("is-playing", playing);
    const label = button.querySelector("[data-preview-label]");
    if (label) label.textContent = playing ? button.dataset.pauseLabel : button.dataset.playLabel;
  }

  function stopCurrent() {
    if (!active) return;
    active.audio.pause();
    updateButton(active.button, false);
    active = null;
  }

  for (const button of previewButtons) {
    const audio = new Audio(button.dataset.audioPreview);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0.72;

    button.addEventListener("click", async () => {
      if (active?.button === button && !audio.paused) {
        stopCurrent();
        return;
      }

      stopCurrent();
      active = { button, audio };
      try {
        await audio.play();
        updateButton(button, true);
        document.querySelector("[data-after-preview]")?.removeAttribute("hidden");
        report("yixiu_playback_start", {
          selected_scene: button.dataset.scene,
          placement: button.dataset.analyticsPlacement,
        });
      } catch {
        active = null;
        updateButton(button, false);
        report("yixiu_playback_error", {
          selected_scene: button.dataset.scene,
          placement: button.dataset.analyticsPlacement,
        });
      }
    });

    audio.addEventListener("pause", () => updateButton(button, false));
  }

  window.addEventListener("pagehide", stopCurrent);
}());
