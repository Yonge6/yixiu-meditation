# AI Originals release — 2026-10-14

Source commit: `11497dd`, branch `codex/yixiu-reliability-library-20261013`.

Added ten formal Gemini / Lyria tracks from “一休 · 十段安静”, with ten distinct bright landscape images created using the built-in image_gen tool. The delivered AAC files are byte-identical on H5 and native; all ten hashes match the source manifest. See the audio and artwork manifests in `docs/audio/` for stable IDs, titles, duration, provenance and prompt scenes.

Free: 月泊 / Moon Anchorage; 雨灯 / Rain at the Window; 蓝眠 / Blue Quiet; 雪絮 / Snowfall in Silence; 暖枕 / Bedside Glow.

Plus: 云被 / A Blanket of Clouds; 竹息 / Bamboo Stillness; 一叶 / One Quiet Leaf; 松影 / Pine Shadows; 归静 / Returning to Stillness.

Added the “AI 原创 / AI Originals” category on both platforms. Preserved existing access and Free-first home navigation. Updated current counts to 54 active sounds, 40 music tracks, 27 Free sounds / 17 Free music tracks. Analytics classify the new tracks as `original`. Sources use “一休创作 · AI 辅助生成 / Created for Yixiu · AI-assisted music”.

Verification:

- 74 Node tests passed, including native/web asset and entitlement parity; native Free policy, scope/search filtering and subscription policy matrix harnesses passed.
- All ten AAC files decoded as stereo in the real browser and measured durations match the manifest.
- Local browser: 390px Chinese and 320px English have no horizontal overflow; the category lists ten tracks with five Free and five Plus. Free scope, English search and favorites intersect with the category. An actual Bedside Glow HTMLAudioElement advanced beyond 0.3 seconds; a locked Cloud Blanket card opened Plus while preserving the selected Free track.
- Native signed Debug build succeeded with `YIXIU_INTERNAL_PLUS`. All 54 active scenes resolve to nonempty bundled audio. The build was installed in place on paired 永歌14PM, bundle `com.health.yixiu`; launch succeeded. After the user opened the AI Originals library, a 1290×2796 physical-device screenshot confirmed the category, distinct artwork, five FREE badges and subsequent Plus gemstone badges. This confirms the observed library view, not exhaustive physical-device playback of all ten tracks.

Production:

- Guarded deployment marker: `DEPLOY_OK_YIXIU_20261014-11497dd-ai-originals`.
- Release archive SHA-256: `343dbaf2c3c8a153473e5c7a38a70f0bc7a2ae6b887868d32e575dcdbf63aafe`.
- Public index SHA-256: `bd4832cc673ecdebd4b644cddee6d51ba9a3a9163076f587e74b571c945b0432`, matching the local release.
- Public `assets/index-524Mmt1U.js` SHA-256: `9790045466e6f17d6078d43d49d9c262e791a641f9ec9c88fbed93c12c4dee81`, matching the local release.
- Fresh production browser readback at `https://yixiu.wonderelian.com/?music=moonAnchorage&lang=zh`: category count 10, Free 5, Plus 5, loaded artwork and zero horizontal overflow. Free scope returns five tracks, selecting Moon Anchorage enters playback, and selecting Cloud Blanket opens Plus with the updated 54-sound benefit.

No App Store withdrawal, archive upload, review submission, subscription price change or version bump was performed. The user's phone has the internal member-preview build; this is distinct from the public App Store binary.
