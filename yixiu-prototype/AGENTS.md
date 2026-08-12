# Mobile Prototype Agent Guide

## Yixiu Product Direction

- The selected visual direction is now “深水沉浸播放器”, based on `../design/ideation-2026-08-09/yixiu-selected-deep-water-player.png`. It supersedes the rejected pale-ivory “如水晨光” home direction.
- The app must support Simplified Chinese and English, with a visible `中 / EN` language control.
- Use real moonlit water photography, deep teal/navy, reflective light, restrained ripple accents, and strong low-light contrast as the main visual language.
- Core product copy: `真实自己，流动人生 / True to Yourself, Flow with Life` and `如水而行 / Be water, my friend.`
- Keep the home screen focused on starting a meditation; do not turn it into a long philosophy infographic.
- Prefer rain, ocean, and stream as the three supporting sound scenes.
- The user-selected visual source of truth is `../design/ideation-2026-08-09/yixiu-selected-deep-water-player.png`: preserve its full-bleed moonlit ocean, lower-half title and philosophy hierarchy, five-control transport row, prominent pause/play button, volume slider, `30 分钟` duration, and minimal three-item navigation.
- The initial featured sound is `大海 / OCEAN WAVES`, with a default timer of `30 分钟 / 30 MIN`.
- On the Sounds page, horizontal swipe is a primary scene-control gesture: swipe left for the next sound and image, swipe right for the previous one. The sequence is bounded rather than circular. At the first or last scene, do not change or reveal another scene; allow only a very small resisted displacement before springing back. Regular transitions follow the finger with restrained parallax, scale, and crossfade, complete after the threshold, and spring back below it. Preserve vertical scrolling and give sliders, buttons, menus, sheets, and player controls priority over the scene swipe.
- Follow the 三慢问道 content hierarchy without copying its drawer: keep the persistent three-item bottom tab bar for Sounds, Focus, and Me. Do not show a hamburger or right drawer. Integrate favorites, timer defaults, language, playback preferences, philosophy, privacy, sources, support, contacts, and related works into the Me tab, with clear in-page groups and secondary detail views that always provide a Back action. Keep Yixiu's deep-water visual language rather than Wendao's paper palette.
- The H5 sound library contains 14 bounded scenes and balances night/rest sounds with bright daytime nature: the original six plus Bamboo Rain, Window Rain, Distant Thunder, Underwater Echo, Snow Wind, Spring Creek, Morning Birds, and Sunny Valley. All scene cards use equal geometry and a stable two-column grid.
- Place the active duration immediately above the central play button without a chevron. Both the duration label and the separate clock icon open the same duration picker.
- Every named nature scene must play a matching licensed field recording or ambience track; never substitute generated filtered noise for an identifiable sound such as birds, rain, river, thunder, wind, or ocean. Keep the audio-source ledger current when recordings change.
- Every sound scene has a share action. Share the current bilingual scene title, image preview, and a stable `https://yixiu.wonderelian.com/?scene=<id>&lang=<zh|en>` link through the native/system share sheet so installed WeChat can offer Friends or Moments. Opening that link must prioritize its scene and language over saved local preferences.
- On the Sounds page, an upward swipe opens the full sound library so all 14 scenes can be browsed vertically. Keep the upward threshold deliberate and let buttons, the timer, volume, and the open library take gesture priority. The full library is a dismissible bottom sheet; the Me tab can open the same library explicitly.
- Switching between Sounds, Focus, and Me must never stop or restart the current ambience. A playing sound continues seamlessly across tabs; a paused sound stays paused. Selecting a sound card in the full library is a single-tap action that immediately switches the scene, starts that sound, closes the sheet, and returns to Sounds.
- The first About row is `关于我们 / About Us`, not `产品哲学`. It contains a short Yixiu introduction followed by the exact bilingual `我们的生命观 / Our philosophy of life` copy and content order from `/Users/yongyuan/Documents/道德经/wendao-mobile`: the life statement, growth paragraph, four-step path, four principles, quote, and vision.
- The public custom-domain experience is a standalone mobile-first H5 page: render the water experience directly in the browser without a phone bezel, simulated status bar, home indicator, device picker, or white preview stage. On desktop, center the H5 content as a `430px` column; on mobile, let it fill the viewport. The legacy device preview may remain available only through the explicit internal query `?preview=phone`.
- Match the H5 and native iPhone typography to 三慢问道: self-host `Noto Serif SC` for display, titles, and reflective copy, and `Noto Sans SC` for controls and supporting UI. The H5 bottom Sounds / Focus / Me tab bar and the Me home/detail views use the native iPhone app as their geometry and hierarchy source of truth, including safe-area spacing, full-width tab-bar treatment, compact top rhythm, back header, card proportions, labels, and active states. The H5 App Store download row must provide immediate pressed/status feedback as it opens the store.
- On the public H5, Me-tab type must remain comfortably readable at phone scale: use larger card titles, supporting copy, settings labels, related-work descriptions, and tab labels. Secondary Me pages use a compact safe-area header with no extra blank band above the Back action, and begin article content close beneath the header.

## Prototype Instructions

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. The public Yixiu H5 is the explicit exception recorded above: its default route is standalone, while `?preview=phone` retains the template-owned preview runtime for internal inspection.
- When `?preview=phone` is active, keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.
