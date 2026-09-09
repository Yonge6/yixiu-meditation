(() => {
  "use strict";

  const fallbackStoreUrl = "https://apps.apple.com/app/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8";
  const allowedParameters = new Set(["ppid", "pt", "ct", "mt"]);
  const params = new URLSearchParams(window.location.search);
  const isEnglish = params.get("lang") === "en";
  const inWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const placement = params.get("placement")?.match(/^[a-z0-9_-]{1,64}$/i)?.[0] ?? "unknown";
  const storeLink = document.getElementById("app-store-link");
  const copyButton = document.getElementById("copy-link");
  const feedback = document.getElementById("copy-feedback");
  const title = document.getElementById("download-title");
  const description = document.getElementById("download-description");
  const guide = document.getElementById("wechat-guide");
  const backLink = document.getElementById("back-to-yixiu");
  let feedbackTimer;

  function validatedStoreUrl(value) {
    try {
      const candidate = new URL(value ?? "");
      if (candidate.protocol !== "https:" || candidate.hostname !== "apps.apple.com" || candidate.pathname !== "/app/id1461182261") {
        throw new Error("INVALID_DESTINATION");
      }
      const safeUrl = new URL("https://apps.apple.com/app/id1461182261");
      for (const [key, parameterValue] of candidate.searchParams) {
        if (!allowedParameters.has(key)) continue;
        if (key === "ppid" && !/^[a-f0-9-]{36}$/i.test(parameterValue)) continue;
        if (key === "pt" && !/^\d{1,16}$/.test(parameterValue)) continue;
        if (key === "ct" && !/^[a-z0-9._-]{1,80}$/i.test(parameterValue)) continue;
        if (key === "mt" && parameterValue !== "8") continue;
        safeUrl.searchParams.set(key, parameterValue);
      }
      return safeUrl.href;
    } catch {
      return fallbackStoreUrl;
    }
  }

  const storeUrl = validatedStoreUrl(params.get("target"));
  storeLink.href = storeUrl;
  document.documentElement.lang = isEnglish ? "en" : "zh-CN";
  document.title = isEnglish ? "Download Yixiu" : "下载一休 App";
  storeLink.textContent = isEnglish ? "Open App Store" : "打开 App Store";
  copyButton.textContent = isEnglish ? "Copy App Store link" : "复制 App Store 链接";
  backLink.textContent = isEnglish ? "Return to Yixiu" : "返回一休";
  backLink.href = `/?lang=${isEnglish ? "en" : "zh"}`;

  function notify(message) {
    window.clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedbackTimer = window.setTimeout(() => { feedback.textContent = ""; }, 3000);
  }

  async function copyStoreUrl() {
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(storeUrl);
          notify(isEnglish ? "Link copied. Paste it into your browser." : "已复制，可粘贴到浏览器打开");
          return;
        } catch { /* Older WeChat versions may reject the modern clipboard API. */ }
      }
      const field = document.createElement("textarea");
      field.value = storeUrl;
      field.readOnly = true;
      field.style.cssText = "position:fixed;opacity:0;font-size:16px";
      document.body.appendChild(field);
      let copied = false;
      try {
        field.select();
        field.setSelectionRange(0, field.value.length);
        copied = document.execCommand("copy");
      } finally {
        field.remove();
      }
      if (!copied) throw new Error("COPY_UNAVAILABLE");
      notify(isEnglish ? "Link copied. Paste it into your browser." : "已复制，可粘贴到浏览器打开");
    } catch {
      notify(isEnglish ? "Press and hold Open App Store to copy the link." : "请长按“打开 App Store”复制链接");
    }
  }

  copyButton.addEventListener("click", () => { void copyStoreUrl(); });

  if (inWeChat) {
    title.textContent = isEnglish ? "Continue in your browser" : "在浏览器中继续下载";
    description.textContent = isEnglish ? "Use WeChat's top-right menu to open this page in your default browser." : "请使用微信右上角菜单，在默认浏览器中打开此页。";
    guide.hidden = false;
    guide.setAttribute("aria-label", isEnglish ? "Open in your default browser" : "在默认浏览器中打开");
    document.getElementById("browser-pointer").hidden = false;
    document.getElementById("guide-menu").textContent = isEnglish ? "Tap ··· at the top right of WeChat" : "点击微信右上角 ···";
    document.getElementById("guide-browser").textContent = isEnglish ? "Choose Open in Default Browser" : "选择“在默认浏览器中打开”";
    document.getElementById("guide-result").textContent = isEnglish ? "Your browser will open Yixiu on the App Store automatically. No second download tap is needed." : "默认浏览器打开后，将自动前往 App Store，无需再次点击下载。";
    document.getElementById("fallback-note").textContent = isEnglish ? "Or copy the App Store link and paste it into your browser." : "也可以复制 App Store 链接，粘贴到浏览器打开。";
    copyButton.hidden = false;
    storeLink.addEventListener("click", (event) => {
      event.preventDefault();
      notify(isEnglish ? "Use ··· to open this page in your browser." : "请点右上角 ···，在默认浏览器中打开");
    });
    window.dispatchEvent(new CustomEvent("yixiu:analytics", {
      detail: { event: "yixiu_wechat_app_store_guide_view", placement },
    }));
    return;
  }

  title.textContent = isEnglish ? "Opening the App Store" : "正在前往 App Store";
  description.textContent = isEnglish ? "Continue to Yixiu on the App Store." : "即将打开一休 App 下载页。";
  document.getElementById("fallback-note").textContent = isEnglish ? "If nothing opens, tap Open App Store above." : "如未自动跳转，请点击上方按钮。";
  window.location.replace(storeUrl);
})();
