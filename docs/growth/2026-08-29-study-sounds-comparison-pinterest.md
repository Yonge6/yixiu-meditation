# Study Sounds Comparison Pinterest Infographic — 2026-08-29

## Decision

The existing `/best-nature-sounds-for-studying/` page already offered three verified Yixiu previews, but its visible content did not give readers a fast comparison they could save or share. This release adds one truthful River/Rain/Ocean decision visual to that page and distributes the same comparison as a native Pinterest infographic. It does not create a duplicate landing page and does not touch, mention or route through another product.

## Published surfaces

- Yixiu page: `https://yixiu.wonderelian.com/best-nature-sounds-for-studying/`
- Public Pin: `https://www.pinterest.com/pin/1147643917690337900/`
- Account: `WonderElian` (`https://www.pinterest.com/wondereilan/`)
- Board: `Yixiu: Nature Sounds & Sleep`
- Published from authenticated desktop Chrome on 2026-08-29 Asia/Shanghai
- Format: native vertical infographic, 1000×1500 PNG
- AI-modified disclosure: enabled and visible on the public Pin
- Topics: `Study Tips`; `White Noise Machines`
- Similar-product recommendations: disabled
- Comments: enabled
- No collaborator, product tag, paid promotion, cross-post, second board or unrelated product was added.

## Page change

- Added the responsive visible comparison figure and a 1000×1500 Web JPEG.
- Updated Article `dateModified` to `2026-08-29` and exposed an `ImageObject` with truthful dimensions and caption.
- Corrected the Rain item URL in structured data from the stale `/sleep-sounds/` route to `/rain-sounds-for-studying/`.
- Updated the page sitemap `lastmod` to `2026-08-29`.
- Preserved the single H1 and all three real River, Rain and Ocean preview controls.

## Creative evidence

- Social PNG: `/Users/yongyuan/Documents/ChatGPT/运营推广/assets/yixiu-study-sounds-comparison-wonderelian-2026-08-29/yixiu-study-sounds-comparison-pin-01.png`
- PNG size: 1,076,996 bytes
- PNG SHA256: `b3de3f4e8975140095310f41178ebd4900876da5355057fcb1872d935a6ea88d`
- Web JPEG: `yixiu-prototype/public/assets/yixiu/study-sounds-comparison-pinterest.jpg`
- JPEG size: 264,360 bytes
- JPEG SHA256: `8fb837d60dfbb0440e83dff3f1e805288789bf25055a72beebdc13658e9eb628`
- Source scenes: existing Yixiu Spring Creek, Window Rain and Ocean Waves artwork

The original 1000×1500 visual and a 500×750 card-scale rendering were inspected. The comparison identifies River for reading and writing, Rain for noisy shared rooms, and Ocean for repetitive practice, then recommends comparing each at low volume and keeping the sound noticed least.

## Publication copy

Title:

`Best Nature Sounds for Studying: River, Rain or Ocean?`

Description:

`Not sure what to play while you study? River adds gentle movement for reading and writing, rain creates an even layer in a noisy shared room, and ocean brings a slower rhythm to repetitive practice. Compare all three real recordings at low volume in Yixiu, then keep the one you notice least. No music. No talking. No account. No ads. Visual created with generative tools; audio previews are real Yixiu recordings. #StudySounds #NatureSounds #FocusSounds #Yixiu`

Destination:

`https://yixiu.wonderelian.com/best-nature-sounds-for-studying/?utm_source=pinterest&utm_medium=organic_infographic&utm_campaign=focus_sounds&utm_content=study_sounds_comparison_pin_01`

Alt text:

`Yixiu study sound guide comparing river for reading and writing, rain for noisy shared rooms, and ocean for repetitive practice.`

## Validation and deployment

- Protected runtime file validation: 28/28 passed.
- Production build: passed.
- Static site tests: 33/33 passed.
- Isolated full Playwright runtime and funnel suite: 47/47 passed on port 4183.
- The first Playwright attempt connected to an unrelated existing Wendao server on port 4174 because `reuseExistingServer` was enabled and therefore produced 28 unrelated failures. No Wendao process or file was changed; the isolated rerun is the valid Yixiu result.
- Mobile QA at 390×844: `scrollWidth=390`, `innerWidth=390`, no horizontal overflow; the comparison image decoded at 1000×1500; the corrected Rain link resolved; the River preview changed to `Pause River` with `aria-pressed=true` after one click.
- Release ID: `20260829-907c247-study-comparison-0341`
- Deployment result: `DEPLOY_OK_YIXIU_20260829-907c247-study-comparison-0341`
- Local archive: `/tmp/yixiu-20260829-907c247-study-comparison-0341.tar.gz`
- Archive SHA256: `85819928dec4b0388bd4bad49a0581cc31925a174012a16e3cefa56ad23783dd`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-907c247-study-comparison-0341`
- The existing server `/tmp/deploy-production-nginx.sh` was preserved; a uniquely named release script was used and archived with the release artifacts.

Local, server and public hashes matched:

- page: `dc05a29799253714ead003b24c4148557831b3e840ee988909a5c6c79cd176fc`
- comparison JPEG: `8fb837d60dfbb0440e83dff3f1e805288789bf25055a72beebdc13658e9eb628`
- `discover.css`: `8a12af6301a26814a04e542a1ea9129b2c07cbb972e266be43015765f12b9bb1`
- sitemap: `59e64a54713392da409cdf69647b77a8b95befe2650f820f4a78c35d2025a99e`

The production page and image both returned HTTP 200. Public HTML exposed the updated modification date, image metadata, comparison heading and corrected Rain URL. IndexNow returned HTTP 200 for the study page, `/guides/` and `/sitemap.xml`.

## Pinterest external verification

- Pinterest creation returned `Publish Complete` and `Your Pin has been published!` with permanent Pin ID `1147643917690337900`.
- The authenticated public Pin DOM showed the correct WonderElian author, Yixiu board, title, full description, exact UTM destination, enabled comments and visible `AI modified` label.
- The logged-out Pin HTML returned HTTP 200 and exposed the title, WonderElian account, Yixiu board, full description, alt text and exact `organic_infographic` / `study_sounds_comparison_pin_01` attribution.
- Pinterest oEmbed returned HTTP 200 with the exact title and author `WonderElian`.

## Measurement boundary

The official GA4 Data API snapshot after publication still reported 2 active users, 3 views and 4 sessions for exact hostname `yixiu.wonderelian.com` on 2026-08-29. This is an incomplete Beijing natural day. The source table had no `pinterest / organic_infographic` row, so no visit, click or conversion is attributed to this new Pin.

The latest completed-day evidence remains conflicting: the 2026-08-28 GA4 hostname UI table showed 40 active users, 55 views and 47 sessions, while a later exact-hostname GA4 Data API readback showed 26 active users, 35 views and 33 sessions. Both are below the 100-UV gate, so neither is used to claim completion.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and a scalar `yixiu_download_click` result remain `null` where authoritative evidence is unavailable. Publication proves a live attributable Yixiu acquisition surface only; the overall growth goal remains active.
