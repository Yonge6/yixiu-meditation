# Yixiu Sharing, Daily Reminder, Widgets, and iPad Design

## Product outcome

This release makes Yixiu easier to share and return to without adding an account or a server dependency. A scene share becomes a complete visual artifact: the current scene image, bilingual identity, a short line of copy, and a scannable scene link in a QR code at the lower-right. The H5 and native app use the same scene URL contract. The app also offers an opt-in daily reminder at 21:30 local time, useful home/lock-screen widgets, and a comfortable universal iPhone/iPad layout.

The work remains entirely inside Yixiu. Style Atlas is used only as a read-only implementation reference for Apple's Smart App Banner metadata. No other product is edited or used as a traffic source.

## Chosen approach

### Sharing

The native app replaces `ShareLink` with a generated PNG and a UIKit system activity sheet. The PNG is rendered locally from the current bundled scene image, includes the scene name and Yixiu identity, and places a Core Image QR code in the lower-right. The activity sheet receives the image plus the attributed scene URL so WeChat and other installed destinations receive a real visual rather than URL-only metadata. The sheet-based presentation also avoids iPad popover anchor crashes.

The H5 generates the equivalent card in a browser canvas and encodes the URL with a small QR library. If the browser supports file sharing, it passes a PNG `File` to the Web Share API. When files cannot be shared—especially inside WeChat—the page opens a preview dialog with save/download and copy-link actions plus concise WeChat guidance. Cancellation is silent; generation or clipboard failures become visible status copy.

### H5 App Store banner

Yixiu already declares Apple's `apple-itunes-app` meta tag. Style Atlas adds an `app-argument`; Yixiu will match that contract with its region-neutral App Store URL. This preserves the native Safari Smart App Banner while the existing in-page download action and WeChat default-browser guide continue to handle other browsers.

## Daily reminder and widgets

The daily reminder is a local notification, not a remote push service. It asks for notification permission only when the user enables it, schedules a rolling 30-day queue at 21:30 in the device's current locale/time zone, and refreshes that queue on launch or setting changes. My Yixiu exposes the switch and time picker. Disabling removes the pending reminders. Denied permission is shown honestly and links users to Settings; it is never treated as enabled.

The existing widget extension already owns the Control Center control and Live Activity. It gains a conventional WidgetKit surface with small, medium, and lock-screen families. The small widget offers the one-minute pause; the medium widget combines the invitation with a brief breathing rhythm; lock-screen variants remain compact. An App Intent starts the existing one-minute Live Activity, keeping one source of truth for timing.

## iPad and quality gates

Both app and widget targets become universal (`iPhone,iPad`). iPhone stays portrait-only; iPad supports portrait and landscape. Full-bleed scene backgrounds remain edge-to-edge while foreground content is centered to a readable maximum width. My Yixiu cards and detail pages no longer stretch across the entire iPad screen. Focus controls remain centered and scale conservatively. Sharing uses a sheet-safe activity controller.

Acceptance requires Swift package tests, H5 runtime/build/Sites tests, focused Playwright tests for PNG sharing and fallback behavior, iPhone and iPad simulator builds, and visual screenshots at 390×844 plus representative iPad portrait/landscape sizes. No deployment, remote push, or App Store submission is part of this task.
