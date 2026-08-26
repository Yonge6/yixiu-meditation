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

  const afterPreview = document.querySelector("[data-after-preview]");
  const shareButton = afterPreview ? document.createElement("button") : null;
  let shareFeedbackTimer = null;

  function sharePlacement() {
    return (active?.button.dataset.analyticsPlacement || "intent_preview").replace(/_preview$/, "_share");
  }

  function shareUrl(placement) {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const url = new URL(canonical || window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("utm_source", "share");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "scene_share");
    url.searchParams.set("utm_content", placement);
    return url.toString();
  }

  function setShareFeedback(label) {
    if (!shareButton) return;
    window.clearTimeout(shareFeedbackTimer);
    shareButton.textContent = label;
    shareFeedbackTimer = window.setTimeout(() => {
      shareButton.textContent = "Share this sound";
    }, 2400);
  }

  if (shareButton) {
    shareButton.type = "button";
    shareButton.className = "intent-share";
    shareButton.textContent = "Share this sound";
    shareButton.setAttribute("aria-live", "polite");
    afterPreview.appendChild(shareButton);

    shareButton.addEventListener("click", async () => {
      const placement = sharePlacement();
      const url = shareUrl(placement);
      const title = document.querySelector("h1")?.textContent?.trim() || document.title;
      const text = document.querySelector('meta[name="description"]')?.content || "Listen with Yixiu.";
      let method;

      shareButton.disabled = true;
      try {
        if (typeof navigator.share === "function") {
          await navigator.share({ title, text, url });
          method = "native";
          setShareFeedback("Shared");
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          method = "clipboard";
          setShareFeedback("Link copied");
        } else {
          throw new Error("Sharing is unavailable");
        }

        report("yixiu_share", {
          share_method: method,
          shared_url: url,
          placement,
        });
      } catch (error) {
        if (error?.name !== "AbortError") setShareFeedback("Could not share");
      } finally {
        shareButton.disabled = false;
      }
    });
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
