(function () {
  "use strict";

  if (window.location.hostname !== "yixiu.wonderelian.com") return;
  if (window.Capacitor?.isNativePlatform?.() || new URLSearchParams(window.location.search).get("surface") === "ios") return;

  const measurementId = "G-HDHST6WKKB";
  const query = new URLSearchParams(window.location.search);
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function pageLanguage() {
    const explicit = query.get("lang");
    if (explicit) return explicit;
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(loader);

  const campaign = Object.fromEntries(campaignKeys
    .map((key) => [key, query.get(key)])
    .filter(([, value]) => value));

  function context() {
    const app = document.querySelector(".yixiu-app");
    return {
      site_id: "site-yixiu",
      surface: "h5",
      language: app?.dataset.language || pageLanguage(),
      scene: app?.dataset.scene || query.get("scene") || "ocean",
      active_tab: app?.dataset.tab || "sounds",
      page_path: window.location.pathname,
      ...campaign,
    };
  }

  function send(eventName, parameters) {
    window.gtag("event", eventName, {
      ...context(),
      ...(parameters || {}),
      transport_type: "beacon",
    });
  }

  send("yixiu_landing_view", {
    landing_scene: query.get("scene") || "ocean",
    landing_language: pageLanguage(),
    referrer_host: document.referrer ? new URL(document.referrer).hostname : "direct",
  });

  document.addEventListener("click", (event) => {
    const action = event.target.closest?.("[data-analytics-event], .primary-transport, .scene-select");
    if (!action) return;

    if (action.classList.contains("primary-transport")) {
      if (action.getAttribute("aria-pressed") === "true") return;
      send("yixiu_playback_start", { selected_scene: context().scene });
      return;
    }

    if (action.classList.contains("scene-select")) {
      send("yixiu_scene_select", { selected_scene: action.dataset.sceneId || "unknown" });
      return;
    }

    const eventName = action.dataset.analyticsEvent;
    if (!eventName) return;
    send(eventName, {
      value: action.dataset.analyticsValue || undefined,
      placement: action.dataset.analyticsPlacement || undefined,
    });
  });

  window.addEventListener("yixiu:analytics", (event) => {
    const detail = event.detail || {};
    if (!detail.event) return;
    const { event: eventName, ...parameters } = detail;
    send(eventName, parameters);
  });
}());
