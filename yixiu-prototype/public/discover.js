(function () {
  "use strict";

  const previewButtons = [...document.querySelectorAll("[data-audio-preview]")];
  if (!previewButtons.length) return;

  let active = null;
  const timerRoot = document.querySelector("[data-preview-timer]");
  const timerButtons = timerRoot ? [...timerRoot.querySelectorAll("[data-preview-minutes]")] : [];
  const timerStatus = timerRoot?.querySelector("[data-preview-timer-status]");
  const timerPlacement = timerRoot?.dataset.analyticsPlacement || "sleep_landing_timer";
  let selectedMinutes = Number(timerButtons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.previewMinutes || 0);
  let timerRemainingSeconds = selectedMinutes * 60;
  let timerInterval = null;
  let timerDeadline = null;

  function report(event, parameters) {
    window.dispatchEvent(new CustomEvent("yixiu:analytics", {
      detail: { event, ...parameters },
    }));
  }

  function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")} remaining`;
  }

  function clearPreviewTimer() {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetPreviewTimer() {
    clearPreviewTimer();
    timerDeadline = null;
    timerRemainingSeconds = selectedMinutes * 60;
    if (timerStatus && selectedMinutes) timerStatus.textContent = formatTimer(timerRemainingSeconds);
  }

  function completePreviewTimer() {
    clearPreviewTimer();
    timerDeadline = null;
    if (active) {
      active.audio.pause();
      updateButton(active.button, false);
      active = null;
    }
    if (timerStatus) timerStatus.textContent = "Timer complete";
    report("yixiu_preview_timer_complete", {
      duration_minutes: selectedMinutes,
      placement: timerPlacement,
    });
  }

  function startPreviewTimer() {
    if (!selectedMinutes) return;
    resetPreviewTimer();
    timerDeadline = Date.now() + timerRemainingSeconds * 1000;
    timerInterval = window.setInterval(() => {
      timerRemainingSeconds = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
      if (timerRemainingSeconds <= 0) {
        completePreviewTimer();
        return;
      }
      if (timerStatus) timerStatus.textContent = formatTimer(timerRemainingSeconds);
    }, 1000);
  }

  for (const timerButton of timerButtons) {
    timerButton.addEventListener("click", () => {
      selectedMinutes = Number(timerButton.dataset.previewMinutes);
      for (const button of timerButtons) button.setAttribute("aria-pressed", String(button === timerButton));
      resetPreviewTimer();
      report("yixiu_preview_timer_select", {
        duration_minutes: selectedMinutes,
        placement: timerPlacement,
      });
    });
  }

  const afterPreview = document.querySelector("[data-after-preview]");
  const shareButton = afterPreview ? document.createElement("button") : null;
  const pinterestLink = afterPreview ? document.createElement("a") : null;
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

  function pinterestPlacement() {
    return sharePlacement().replace(/_share$/, "_pinterest");
  }

  function pinterestDestination(placement) {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const url = new URL(canonical || window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("utm_source", "pinterest");
    url.searchParams.set("utm_medium", "organic_share");
    url.searchParams.set("utm_campaign", "scene_share");
    url.searchParams.set("utm_content", placement);
    return url.toString();
  }

  function pinterestCreateUrl(placement) {
    const url = new URL("https://www.pinterest.com/pin/create/button/");
    const title = document.querySelector('meta[property="og:title"]')?.content
      || document.querySelector("h1")?.textContent?.trim()
      || document.title;
    const description = document.querySelector('meta[name="description"]')?.content || "Listen with Yixiu.";
    const image = document.querySelector('meta[property="og:image"]')?.content;
    url.searchParams.set("url", pinterestDestination(placement));
    if (image) url.searchParams.set("media", image);
    url.searchParams.set("description", `${title}\n\n${description}`);
    return url.toString();
  }

  function updatePinterestLink() {
    if (!pinterestLink) return;
    pinterestLink.href = pinterestCreateUrl(pinterestPlacement());
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

  if (pinterestLink) {
    pinterestLink.className = "intent-pinterest";
    pinterestLink.textContent = "Save to Pinterest";
    pinterestLink.target = "_blank";
    pinterestLink.rel = "noopener noreferrer";
    pinterestLink.setAttribute("aria-label", "Save this sound to Pinterest");
    updatePinterestLink();
    afterPreview.appendChild(pinterestLink);

    pinterestLink.addEventListener("click", () => {
      const placement = pinterestPlacement();
      pinterestLink.href = pinterestCreateUrl(placement);
      report("yixiu_share", {
        share_method: "pinterest_intent",
        shared_url: pinterestDestination(placement),
        placement,
      });
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
    resetPreviewTimer();
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
        startPreviewTimer();
        updatePinterestLink();
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
