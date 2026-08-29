# Yixiu Global Post-Play Share Prompt Design — 2026-08-29

## Signal and goal

The incomplete 2026-08-29 exact-hostname GA4 report shows five playback users and only one share user. A code audit confirmed that all 22 public pages with an after-preview panel already receive the native-share/clipboard button and Pinterest intent from the shared `discover.js`. Coverage is not the gap: only the Sleep landing page explains why someone might share and gives the button a contextual label; other pages expose the generic `Share this sound` action without a prompt.

The goal is to make the existing referral loop understandable after a successful preview, without adding an interruption before playback or creating another acquisition page.

## Options

1. **Inject one neutral prompt through the shared script — selected.** Pages without a custom prompt receive `Know someone who would enjoy this sound?` and the default action `Send this sound to someone`. Existing custom copy remains untouched.
2. **Hand-write custom prompts in all 22 pages.** This creates a large copy-maintenance surface without evidence that each page needs a distinct message.
3. **Show sharing before playback.** This asks visitors to recommend a recording before they have heard it and weakens trust.

## Behavior

On load, if an after-preview panel exists and does not already contain `.intent-share-copy`, `discover.js` appends a single span with the neutral prompt before the existing share and Pinterest actions. The prompt remains hidden with the panel until audio playback succeeds. The existing Sleep prompt and label remain exactly as written. Native-share success, clipboard success, Pinterest intent, cancelled-share behavior and analytics event names remain unchanged.

All 22 after-preview pages must use a new shared script cache key so returning visitors cannot receive old behavior from a previously cached URL.

## Acceptance

- A non-custom page shows the neutral prompt only after successful playback.
- Its share action is named `Send this sound to someone` and retains the exact attributed canonical URL.
- The Sleep page retains `Know someone who needs a quieter night?` and `Send this rain to someone`.
- No duplicate prompt is inserted when custom copy exists.
- Native, clipboard, Pinterest and cancellation analytics tests pass.
- Every after-preview page carries the new cache key.
- Mobile layout has no horizontal overflow and the revealed panel remains reachable.
- Production deployment checks the prompt, label and cache key in staged, deployed and HTTPS-served output.

This release proves only the live referral affordance. It does not prove a share, referral user, App Store visit or download. Missing GA4 or Apple rows remain `null`.
