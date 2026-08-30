(function () {
  "use strict";

  const giftIdPattern = /^[A-Za-z0-9_-]{12,24}$/;

  function report(event, parameters) {
    window.dispatchEvent(new CustomEvent("yixiu:analytics", {
      detail: { event, ...parameters },
    }));
  }

  function randomGiftId() {
    const bytes = new Uint8Array(9);
    crypto.getRandomValues(bytes);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function storageHas(key) {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  }

  function storageSet(key) {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // Playback and sharing remain available when storage is blocked.
    }
  }

  function applyLanguage(root, language) {
    const next = language === "zh" ? "zh" : "en";
    root.dataset.language = next;
    if (root.matches("[data-quiet-pass-gift]")) document.documentElement.lang = next === "zh" ? "zh-Hans" : "en";
    for (const element of root.querySelectorAll("[data-en][data-zh]")) {
      element.textContent = element.dataset[next];
    }
    for (const element of root.querySelectorAll("[data-aria-en][data-aria-zh]")) {
      element.setAttribute("aria-label", element.dataset[`aria${next === "zh" ? "Zh" : "En"}`]);
    }
  }

  function giftUrl(root) {
    const path = root.dataset.quietPassGiftPath;
    const content = root.dataset.quietPassContent;
    const url = new URL(path, window.location.origin);
    url.searchParams.set("g", randomGiftId());
    url.searchParams.set("utm_source", "share");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "quiet_pass");
    url.searchParams.set("utm_content", content);
    url.searchParams.set("lang", root.dataset.language === "zh" ? "zh" : "en");
    return url;
  }

  async function shareGift(root, button, status, eventName) {
    const url = giftUrl(root);
    const language = root.dataset.language === "zh" ? "zh" : "en";
    const title = language === "zh" ? root.dataset.shareTitleZh : root.dataset.shareTitleEn;
    const shareText = language === "zh" ? root.dataset.shareTextZh : root.dataset.shareTextEn;
    const originalLabel = button.textContent;
    let method;

    report("gift_share_initiated", {
      scene: root.dataset.quietPassScene,
      placement: root.dataset.quietPassPlacement,
    });
    button.disabled = true;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text: shareText, url: url.toString() });
        method = "native";
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url.toString());
        method = "clipboard";
      } else {
        throw new Error("sharing_unavailable");
      }

      status.textContent = language === "zh" ? "这段安静已准备好出发。" : "Your quiet moment is ready to travel.";
      report(eventName, {
        scene: root.dataset.quietPassScene,
        placement: root.dataset.quietPassPlacement,
        share_method: method,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        status.textContent = language === "zh" ? "暂时无法分享，请稍后再试。" : "Could not share. Please try again.";
      }
    } finally {
      button.disabled = false;
      window.setTimeout(() => {
        if (button.textContent !== originalLabel) button.textContent = originalLabel;
      }, 2400);
    }
  }

  function setupOrigin(root) {
    const threshold = Number(root.dataset.quietPassThreshold);
    const sceneKey = root.dataset.quietPassSceneKey;
    const shareButton = root.querySelector("[data-quiet-pass-share]");
    const status = root.querySelector("[data-quiet-pass-share-status]");
    let ready = false;

    root.dataset.language = new URLSearchParams(window.location.search).get("lang") === "zh" ? "zh" : "en";
    applyLanguage(root, root.dataset.language);

    window.addEventListener("yixiu:playback-progress", (event) => {
      const detail = event.detail || {};
      if (ready || detail.scene !== sceneKey || Number(detail.currentTime) < threshold) return;
      ready = true;
      root.hidden = false;
      report("gift_ready", {
        scene: root.dataset.quietPassScene,
        threshold_seconds: threshold,
        placement: root.dataset.quietPassPlacement,
      });
    });

    shareButton?.addEventListener("click", () => shareGift(root, shareButton, status, "gift_created"));
  }

  function setupGift(root) {
    const query = new URLSearchParams(window.location.search);
    const rawGiftId = query.get("g") || "";
    const giftIdState = rawGiftId ? (giftIdPattern.test(rawGiftId) ? "valid" : "invalid") : "missing";
    const storageIdentity = giftIdState === "valid" ? rawGiftId : `${giftIdState}:${window.location.pathname}`;
    const languageToggle = root.querySelector("[data-language-toggle]");
    const audio = root.querySelector("[data-quiet-pass-audio-element]");
    const playButton = root.querySelector("[data-quiet-pass-play]");
    const playLabel = root.querySelector("[data-quiet-pass-play-label]");
    const status = root.querySelector("[data-quiet-pass-status]");
    const elapsed = root.querySelector("[data-quiet-pass-elapsed]");
    const progress = root.querySelector("[data-quiet-pass-progress]");
    const completion = root.querySelector("[data-quiet-pass-complete]");
    const errorPanel = root.querySelector("[data-quiet-pass-error]");
    const retryButton = root.querySelector("[data-quiet-pass-retry]");
    const onwardButton = root.querySelector("[data-quiet-pass-share]");
    const onwardStatus = root.querySelector("[data-quiet-pass-share-status]");
    let playReported = false;
    let playbackStatus = "ready";
    let qualified = storageHas(`yixiu_quiet_pass_qualified:${storageIdentity}`);

    function language() {
      return root.dataset.language === "zh" ? "zh" : "en";
    }

    function formatElapsed(value) {
      const seconds = Math.max(0, Math.floor(Number(value) || 0));
      return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    }

    function updatePlayLabel(playing) {
      const next = playing
        ? (language() === "zh" ? "暂停" : "Pause")
        : (language() === "zh" ? "接收并聆听" : "Receive & Listen");
      playLabel.textContent = next;
      playButton.setAttribute("aria-label", next);
      playButton.setAttribute("aria-pressed", String(playing));
      root.classList.toggle("is-playing", playing);
    }

    function updatePlaybackStatus(nextStatus = playbackStatus) {
      playbackStatus = nextStatus;
      const messages = {
        ready: { en: "Receive & Listen", zh: "接收并聆听" },
        playing: { en: "Now playing", zh: "正在播放" },
        paused: { en: "Paused", zh: "已暂停" },
        error: { en: "Audio is temporarily unavailable", zh: "音频暂时无法播放" },
      };
      status.textContent = messages[playbackStatus][language()];
    }

    function showCompletion() {
      completion.hidden = false;
      root.classList.add("is-qualified");
    }

    const initialLanguage = query.get("lang") === "zh" ? "zh" : "en";
    applyLanguage(root, initialLanguage);
    updatePlayLabel(false);
    updatePlaybackStatus();
    if (qualified) showCompletion();

    const openedKey = `yixiu_quiet_pass_opened:${storageIdentity}`;
    if (!storageHas(openedKey)) {
      storageSet(openedKey);
      report("gift_opened", {
        scene: root.dataset.quietPassScene,
        gift_id_state: giftIdState,
        placement: "quiet_pass_recipient",
      });
    }

    languageToggle?.addEventListener("click", () => {
      const next = language() === "en" ? "zh" : "en";
      applyLanguage(root, next);
      updatePlayLabel(!audio.paused);
      updatePlaybackStatus();
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("lang", next);
      history.replaceState(null, "", nextUrl);
      report("gift_language_toggle", { scene: root.dataset.quietPassScene, language: next });
    });

    playButton?.addEventListener("click", async () => {
      errorPanel.hidden = true;
      if (!audio.paused) {
        audio.pause();
        updatePlayLabel(false);
        updatePlaybackStatus("paused");
        return;
      }

      try {
        await audio.play();
        updatePlayLabel(true);
        updatePlaybackStatus("playing");
        if (!playReported) {
          playReported = true;
          report("gift_play_started", {
            scene: root.dataset.quietPassScene,
            gift_id_state: giftIdState,
            placement: "quiet_pass_recipient",
          });
        }
      } catch {
        errorPanel.hidden = false;
        updatePlayLabel(false);
        report("gift_playback_error", { scene: root.dataset.quietPassScene, placement: "quiet_pass_recipient" });
      }
    });

    audio.addEventListener("timeupdate", () => {
      const currentTime = Number(audio.currentTime) || 0;
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 60;
      elapsed.textContent = formatElapsed(currentTime);
      progress.style.setProperty("--quiet-pass-progress", String(Math.min(1, currentTime / duration)));
      if (qualified || currentTime < 60) return;
      qualified = true;
      storageSet(`yixiu_quiet_pass_qualified:${storageIdentity}`);
      showCompletion();
      report("gift_qualified_60s", {
        scene: root.dataset.quietPassScene,
        gift_id_state: giftIdState,
        placement: "quiet_pass_recipient",
      });
    });

    audio.addEventListener("pause", () => updatePlayLabel(false));
    audio.addEventListener("ended", () => updatePlayLabel(false));
    audio.addEventListener("error", () => {
      errorPanel.hidden = false;
      updatePlayLabel(false);
      updatePlaybackStatus("error");
    });

    retryButton?.addEventListener("click", async () => {
      errorPanel.hidden = true;
      audio.load();
      playButton.focus();
    });

    onwardButton?.addEventListener("click", () => shareGift(root, onwardButton, onwardStatus, "gift_reshared"));
  }

  for (const origin of document.querySelectorAll("[data-quiet-pass-origin]")) setupOrigin(origin);
  for (const gift of document.querySelectorAll("[data-quiet-pass-gift]")) setupGift(gift);
}());
