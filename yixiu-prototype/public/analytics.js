(function () {
  "use strict";

  if (window.Capacitor?.isNativePlatform?.() || new URLSearchParams(window.location.search).get("surface") === "ios") return;

  const measurementId = "G-HDHST6WKKB";
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

  document.addEventListener("click", (event) => {
    const action = event.target.closest?.(".primary-transport, .scene-select");
    if (!action) return;
    const interaction = action.classList.contains("primary-transport") ? "playback_start" : "scene_select";
    if (interaction === "playback_start" && action.getAttribute("aria-pressed") === "true") return;
    window.gtag("event", "app_discovery", {
      site_id: "site-yixiu",
      interaction,
      page_path: window.location.pathname,
    });
  });
}());
