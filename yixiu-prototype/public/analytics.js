(function () {
  "use strict";

  if (window.location.hostname !== "yixiu.wonderelian.com") return;
  if (window.Capacitor?.isNativePlatform?.() || new URLSearchParams(window.location.search).get("surface") === "ios") return;

  const measurementId = "G-HDHST6WKKB";
  const query = new URLSearchParams(window.location.search);
  const excluded = query.get("analytics") === "off" || query.has("preview") || navigator.webdriver;
  const consentKey = "yixiu.analyticsConsent.v2";
  const consent = () => { try { return localStorage.getItem(consentKey) === "granted"; } catch { return false; } };
  let enabled = consent() && !excluded;
  let initialized = false;
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function pageLanguage() {
    const explicit = query.get("lang");
    if (explicit) return explicit;
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { if (enabled || arguments[0] === "consent") window.dataLayer.push(arguments); };
  function initialize() {
    window[`ga-disable-${measurementId}`] = !enabled;
    if (!enabled || initialized) return;
    initialized = true;
    window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("js", new Date());
    const safeLocation = new URL(window.location.pathname, window.location.origin);
    for (const key of ["scene", "music", "lang", ...campaignKeys]) {
      const value = query.get(key);
      if (value && /^[a-zA-Z0-9_.-]{1,100}$/.test(value)) safeLocation.searchParams.set(key, value);
    }
    window.gtag("config", measurementId, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: "yixiu.wonderelian.com", page_location: safeLocation.href,
      page_referrer: document.referrer ? new URL(document.referrer).origin : "",
    });
    const loader = document.createElement("script");
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(loader);
  }
  initialize();
  window.addEventListener("yixiu:consent", () => {
    enabled = consent() && !excluded;
    initialize();
    if (initialized) window.gtag("consent", "update", { analytics_storage: enabled ? "granted" : "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    if (enabled) send("yixiu_v2_consent", { schema_version: 2 });
    else {
      for (const part of document.cookie.split(";")) {
        const name = part.trim().split("=")[0];
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ["", "; domain=yixiu.wonderelian.com", "; domain=.wonderelian.com"]) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
      }
    }
  });

  const campaign = Object.fromEntries(campaignKeys
    .map((key) => [key, query.get(key)])
    .filter(([, value]) => value && /^[a-zA-Z0-9_.-]{1,100}$/.test(value)));

  function context() {
    const app = document.querySelector(".yixiu-app");
    return {
      site_id: "site-yixiu",
      surface: "h5",
      language: app?.dataset.language || pageLanguage(),
      scene: app?.dataset.scene || query.get("scene") || "ocean",
      active_tab: app?.dataset.tab || "sounds",
      page_path: window.location.pathname,
      ...Object.fromEntries(Object.entries(campaign).map(([key, value]) => [key, value.slice(0, 100)])),
    };
  }

  function send(eventName, parameters) {
    if (!enabled || !/^yixiu_[a-z0-9_]+$/.test(eventName)) return;
    const safeKeys = new Set(["value", "placement", "schema_version", "scene_id", "content_category", "access_level", "listened_seconds", "end_reason", "error_code", "action", "filter", "timer_minutes", "focus_minutes", "selected_scene", "completed_scene", "gated_scene", "shared_scene", "share_method", "nature_sound", "landing_scene", "landing_language", "referrer_host"]);
    const safe = Object.fromEntries(Object.entries(parameters || {}).filter(([key, value]) => safeKeys.has(key) && ["string", "number", "boolean"].includes(typeof value)).map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]));
    window.gtag("event", eventName, {
      ...context(),
      ...safe,
      transport_type: "beacon",
    });
    const mirrored = { yixiu_plus_gate_view: "paywall_view", yixiu_tab_select: "tab_select", yixiu_download_click: "download_click", yixiu_scene_share: "share" }[eventName];
    if (mirrored) send(`yixiu_v2_${mirrored}`, { ...safe, schema_version: 2 });
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
      // Confirmed starts are emitted by the media playing event (schema 2).
      send("yixiu_playback_click", { selected_scene: context().scene });
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
