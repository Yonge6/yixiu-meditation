# Yixiu YouTube Community profile-path repair design — 2026-08-31

## Problem

YouTube renders the external H5 and App Store URLs in WonderElian Community posts as text because clickable external links require advanced-feature identity verification. The channel header already exposes a verified clickable Yixiu link, but two public Yixiu posts did not tell readers how to reach it.

## Options considered

1. Publish duplicate posts with stronger calls to action. This creates more low-reach inventory while leaving the original posts broken.
2. Wait for YouTube to unlock advanced links through channel history. This preserves state but does not improve the current path.
3. Edit the two existing posts in place and add the already validated mobile channel-link instruction. This preserves their URLs, copy and attribution while repairing the immediate path.

Option 3 is selected. It is the smallest reversible change and reuses an existing authorized Yixiu-only destination.

## Treatment

Add the same sentence after each H5 URL:

> On mobile, tap WonderElian above, then tap Yixiu in the channel links.

Preserve every existing H5 UTM, Apple provider/custom-product-page/campaign parameter, hashtag, question and product statement. Do not create a post, comment, upload, pin, channel setting, identity-verification action or cross-product referral.

## Acceptance

- Authenticated YouTube DOM shows each original post as modified and contains the new instruction plus its original H5 and Apple tokens.
- Logged-out HTML returns HTTP 200 and contains WonderElian, the instruction and both attribution tokens.
- The channel homepage renders `yixiu.wonderelian.com` as an anchor whose redirect target preserves `youtube / organic_profile / yixiu_channel / channel_profile_yixiu_01`.
- The attributed H5 destination returns HTTP 200 without losing its query.

This repairs a click path only. Visits, sessions, downloads, trials and revenue remain `null` until authoritative reporting exposes them.
