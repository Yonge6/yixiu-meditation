(() => {
  "use strict";
  const key = "yixiu-app-banner-dismissed";
  if (new URLSearchParams(location.search).get("preview") === "phone") return;
  try { if (sessionStorage.getItem(key) === "1") return; } catch { /* Storage is optional. */ }
  if (document.querySelector(".yixiu-download-banner")) return;
  const store = "https://apps.apple.com/app/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8";
  const banner = document.createElement("aside");
  banner.className = "yixiu-download-banner";
  banner.innerHTML = '<button type="button" class="yixiu-banner-close"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg></button><img src="/assets/yixiu/app-icon.png" width="44" height="44" alt=""><div class="yixiu-banner-copy"><strong></strong><span></span></div><a class="yixiu-banner-action" data-analytics-event="yixiu_download_click" data-analytics-placement="download_banner"></a>';
  const close = banner.querySelector("button");
  const link = banner.querySelector("a");
  let language;
  function updateLanguage() {
    const appLanguage = document.querySelector(".yixiu-app")?.dataset.language;
    const next = appLanguage || new URLSearchParams(location.search).get("lang") || (document.documentElement.lang.startsWith("zh") ? "zh" : "en");
    if (language === next) return;
    language = next;
    const zh = language === "zh";
    banner.setAttribute("aria-label", zh ? "下载一休冥想 App" : "Download Yixiu Meditation");
    close.setAttribute("aria-label", zh ? "关闭下载横幅" : "Dismiss app banner");
    banner.querySelector("strong").textContent = zh ? "一休冥想" : "Yixiu Meditation";
    banner.querySelector("span").textContent = zh ? "休息、睡眠与静心 · iPhone / iPad" : "Rest, Sleep & Calm · iPhone / iPad";
    link.textContent = zh ? "下载 App" : "Get App";
    link.href = store;
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      const url = new URL("/download.html", location.origin);
      url.search = new URLSearchParams({ lang: language, placement: "download_banner", target: store });
      link.href = url.href;
    }
  }
  const resize = new ResizeObserver(() => {
    document.body.style.setProperty("--yixiu-banner-height", `${banner.getBoundingClientRect().height}px`);
  });
  const observer = new MutationObserver(updateLanguage);
  close.addEventListener("click", () => {
    try { sessionStorage.setItem(key, "1"); } catch { /* Keep current-page dismissal. */ }
    observer.disconnect();
    resize.disconnect();
    banner.remove();
    document.body.classList.remove("has-yixiu-banner");
    document.body.style.removeProperty("--yixiu-banner-height");
  });
  updateLanguage();
  document.body.prepend(banner);
  document.body.classList.add("has-yixiu-banner");
  resize.observe(banner);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-language"] });
})();
