# Yixiu Smart Stack and Quick Control Design

**Date:** 2026-09-02  
**Status:** Approved for implementation  
**Scope:** Yixiu iPhone app and its system surfaces only

## Outcome

Add a one-tap **One-Minute Pause** control to the iPhone app's system controls. On a paired Apple Watch running watchOS 26, the control is available in Control Center and the Smart Stack. Starting it creates a 60-second Live Activity that appears on the iPhone Lock Screen and Dynamic Island and is automatically mirrored into the Apple Watch Smart Stack.

This is intentionally not a standalone watchOS app. It gives Yixiu a useful wrist surface with a smaller binary, fewer review surfaces, and no duplicated navigation.

## Experience

1. The person adds Yixiu's **One-Minute Pause** control from the system Controls gallery.
2. A tap starts a fresh 60-second quiet minute without opening Yixiu on the iPhone.
3. The Live Activity shows the remaining time and the existing Yixiu 4-2-6 breathing rhythm:
   - Breathe in for 4 seconds.
   - Hold for 2 seconds.
   - Breathe out for 6 seconds.
4. The activity becomes stale at the end of the minute and switches to a complete state.
5. A **Done** action removes it immediately. Starting another quiet minute also removes any previous Yixiu activity first, so duplicate activities never accumulate.

English is the default copy. Simplified Chinese is supplied through string localization.

## Architecture

- Add one iOS Widget Extension with WidgetKit, ActivityKit, and App Intents.
- Add a `ControlWidget` backed by a `LiveActivityIntent`, so the action can execute while the iPhone app remains in the background.
- Add an `ActivityConfiguration` for Lock Screen, Dynamic Island, and Apple Watch Smart Stack presentations.
- Keep timing and breathing-phase calculations in a small Foundation-only shared core with unit tests.
- Set `NSSupportsLiveActivities` on the containing iPhone app.
- Do not add networking, analytics, sign-in, notifications, HealthKit, or WatchConnectivity.

## Lifecycle Constraint

ActivityKit has no local API that schedules an exact future end for a Live Activity. `staleDate` marks content as stale; it does not end the activity. Yixiu therefore renders a clear completed state at 60 seconds and provides a one-tap **Done** action. The next start also cleans up prior activities. This avoids an unreliable long-running intent or a server dependency.

## Accessibility and Visual Direction

- Use semantic timer text so the system updates the countdown without per-second widget refreshes.
- Provide VoiceOver labels for the timer, breathing phase, and actions.
- Use Yixiu's deep-water background, aqua accent, and restrained ripple symbol; do not reuse the Plus diamond.
- Respect system tinting in Controls and high-contrast system layouts.

## Verification Boundary

Acceptance requires:

- Foundation timing tests pass.
- App and extension compile for iPhone Simulator and generic iOS Archive destinations.
- The control starts a Live Activity in an iPhone simulator.
- A paired watchOS simulator shows the Yixiu Live Activity in its Smart Stack and can invoke the control when the simulator exposes the watchOS 26 Controls gallery.
- Archive validation and App Store Connect processing succeed before submission.

Without a physical Apple Watch, simulator results do **not** validate real haptics, wrist-down refresh behavior, Bluetooth audio routing, radio handoff, or battery use. This release contains no Watch audio and no custom haptics, limiting that risk.

