(function () {
  "use strict";
  const query = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  document.querySelectorAll("a[data-journal-link]").forEach(link => {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    keys.forEach(key => { if (query.has(key)) url.searchParams.set(key, query.get(key)); });
    link.href = url.pathname + url.search + url.hash;
  });
}());
