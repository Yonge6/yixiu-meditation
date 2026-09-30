import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const script = await readFile(new URL("../public/analytics.js", import.meta.url), "utf8");
function harness(search = "") {
  const listeners = {}, scripts = [], cookies = [];
  let consent = null;
  const window = { location: { hostname: "yixiu.wonderelian.com", origin: "https://yixiu.wonderelian.com", pathname: "/", search },
    addEventListener: (key, handler) => listeners[key] = handler };
  const document = { documentElement: { lang: "zh" }, referrer: "", querySelector: () => null,
    createElement: () => ({}), head: { appendChild: item => scripts.push(item) },
    addEventListener: (key, handler) => listeners[key] = handler,
    get cookie() { return "_ga=old; _ga_HDHST6WKKB=old; preference=keep"; }, set cookie(value) { cookies.push(value); } };
  vm.runInNewContext(script, { window, document, navigator: { webdriver: false }, URL, URLSearchParams, localStorage: { getItem: () => consent } });
  return { window, scripts, cookies, grant(value = "granted") { consent = value; listeners["yixiu:consent"](); },
    event(event, parameters={}) { listeners["yixiu:analytics"]({detail: { event, ...parameters }}); },
    events() { return (window.dataLayer ?? []).filter(item => item[0] === "event"); } };
}
test("default denial loads no Google tag; opt-in loads once; withdrawal stops all product events", () => {
  const h=harness(); assert.equal(h.scripts.length,0); assert.equal(h.events().length,0);
  h.grant(); h.grant(); assert.equal(h.scripts.length,1);
  h.event("yixiu_v2_listen_time", {value:30, private_email:"never"});
  assert.equal(h.events().at(-1)[2].value,30); assert.equal(h.events().at(-1)[2].private_email,undefined);
  h.grant("denied"); const count=h.events().length;
  h.event("yixiu_v2_playback_start"); assert.equal(h.events().length,count);
  assert.equal(h.window["ga-disable-G-HDHST6WKKB"],true);
  assert.ok(h.cookies.every(value => !value.startsWith("preference=")));
});
test("test/preview exclusion cannot be overridden by consent", () => {
  for (const query of ["?analytics=off","?preview=1"]) { const h=harness(query); h.grant(); assert.equal(h.scripts.length,0); }
});
test("new membership events are mirrored once; URL parameters are allowlisted", () => {
  const h=harness("?scene=rain&email=private%40example.com&utm_source=private%40example.com"); h.grant();
  h.event("yixiu_download_click", {placement:"header"});
  assert.equal(h.events().filter(e=>e[1]==="yixiu_v2_download_click").length,1);
  const config=h.window.dataLayer.find(e=>e[0]==="config")[2];
  assert.equal(config.page_location,"https://yixiu.wonderelian.com/?scene=rain");
});
