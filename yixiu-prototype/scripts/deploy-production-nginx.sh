#!/usr/bin/env bash

set -euo pipefail

archive_url="${1:?archive URL is required}"
archive_sha256="${2:?archive SHA-256 is required}"
release_id="${3:?release id is required}"

case "$release_id" in
  *[!A-Za-z0-9._-]*)
    echo "invalid release id" >&2
    exit 2
    ;;
esac

deploy_target="/srv/wonderelian/yixiu.wonderelian.com"
deploy_stage="/srv/wonderelian/.yixiu-${release_id}"
deploy_backup="/srv/wonderelian/backups/yixiu-${release_id}"
archive_path="$deploy_stage/site.tar.gz"
site_path="$deploy_stage/site"

test -d "$deploy_target"
test ! -e "$deploy_stage"
test ! -e "$deploy_backup"

mkdir -p "$site_path" "$deploy_backup"
trap 'rm -rf "$deploy_stage"' EXIT

curl --proto-default https \
  --retry 3 \
  --retry-all-errors \
  --connect-timeout 15 \
  --max-time 180 \
  -fL "$archive_url" \
  -o "$archive_path"

printf '%s  %s\n' "$archive_sha256" "$archive_path" | sha256sum -c -

if tar -tzf "$archive_path" | grep -Eq '(^/|(^|/)\.\.(/|$))'; then
  echo "unsafe archive path" >&2
  exit 3
fi

tar -xzf "$archive_path" -C "$site_path"

test -f "$site_path/index.html"
test -f "$site_path/sleep-sounds/index.html"
test -f "$site_path/best-sleep-sounds/index.html"
test -f "$site_path/rain-sounds-when-iphone-locked/index.html"
test -f "$site_path/focus-sounds/index.html"
test -f "$site_path/forest-sounds-for-focus/index.html"
test -f "$site_path/forest-sounds-for-sleep/index.html"
test -f "$site_path/wind-sounds-for-sleeping/index.html"
test -f "$site_path/underwater-white-noise-for-sleep/index.html"
test -f "$site_path/ocean-waves-for-sleeping/index.html"
test -f "$site_path/ocean-waves-for-focus/index.html"
test -f "$site_path/mountain-stream-sounds-for-focus/index.html"
test -f "$site_path/waterfall-sounds-for-noise-masking/index.html"
test -f "$site_path/river-sounds-for-studying/index.html"
test -f "$site_path/rain-sounds-for-studying/index.html"
test -f "$site_path/white-noise-for-studying/index.html"
test -f "$site_path/best-nature-sounds-for-studying/index.html"
test -f "$site_path/guides/index.html"
test -f "$site_path/one-minute-reset/index.html"
test -f "$site_path/nature-sounds-for-meditation/index.html"
test -f "$site_path/robots.txt"
test -f "$site_path/llms.txt"
test -f "$site_path/sitemap.xml"
test -f "$site_path/analytics.js"
test -f "$site_path/discover.js"
test -f "$site_path/0d28a7f9686f4a45871ea685d741dc75.txt"
test -f "$site_path/assets/yixiu/window-rain.webp"
test -f "$site_path/assets/yixiu/sunny-valley.webp"
test -f "$site_path/assets/yixiu/underwater-echo.webp"
test -f "$site_path/assets/yixiu/snow-wind-pinterest-2x3.png"
test -f "$site_path/assets/yixiu/snow-wind-pinterest-2x3.jpg"
test -f "$site_path/assets/yixiu/spring-creek.webp"
test -f "$site_path/assets/yixiu/study-sounds-comparison-pinterest.jpg"
test -f "$site_path/assets/yixiu/audio/sunrise-river.m4a"
test "$(find "$site_path/assets/yixiu/audio/meditation" -maxdepth 1 -type f -name '*.m4a' | wc -l)" -eq 10
test "$(find "$site_path/assets/yixiu/meditation" -maxdepth 1 -type f -name '*.jpg' | wc -l)" -eq 10
test -f "$site_path/assets/yixiu/audio/meditation/still-water.m4a"
test -f "$site_path/assets/yixiu/audio/meditation/ocean-passage.m4a"
test -f "$site_path/assets/yixiu/meditation/still-water.jpg"
test -f "$site_path/assets/yixiu/meditation/ocean-passage.jpg"
grep -F 'og:image" content="https://yixiu.wonderelian.com/assets/yixiu/snow-wind-pinterest-2x3.jpg' "$site_path/wind-sounds-for-sleeping/index.html" >/dev/null
test -n "$(find "$site_path/assets" -maxdepth 1 -type f -name 'index-*.js' -print -quit)"
grep -FR 'instagram_profile_guide_white_noise_black_screen' "$site_path/assets" >/dev/null
grep -FR 'instagram_profile_guide_mountain_wind_sleep' "$site_path/assets" >/dev/null
grep -FR 'yixiu_h5_music_plus_20260830' "$site_path/assets" >/dev/null
grep -FR 'still-water.m4a' "$site_path/assets" >/dev/null
grep -FR '14 NATURE SOUNDS' "$site_path/assets" >/dev/null
grep -F '"@type": "SoftwareApplication"' "$site_path/index.html" >/dev/null
test "$(find "$site_path" -type f -name '*.html' -exec grep -lE '"softwareVersion"[[:space:]]*:[[:space:]]*"1\.4"' {} + | wc -l)" -eq 23
grep -F '<h1>Free nature sounds for sleep, focus and study</h1>' "$site_path/index.html" >/dev/null
grep -F '<link rel="describedby" href="/llms.txt" type="text/plain" />' "$site_path/index.html" >/dev/null
test "$(find "$site_path" -type f -name '*.html' -exec grep -lF '<link rel="describedby" href="/llms.txt" type="text/plain" />' {} + | wc -l)" -eq 24
grep -Fx '0d28a7f9686f4a45871ea685d741dc75' "$site_path/0d28a7f9686f4a45871ea685d741dc75.txt" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/index.html" >/dev/null
grep -F 'pt=120014121&amp;ct=yixiu_h5_20260827&amp;mt=8' "$site_path/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/best-sleep-sounds/index.html" >/dev/null
grep -F 'data-analytics-placement="best_sleep_sounds_after_preview"' "$site_path/best-sleep-sounds/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-waterfall.m4a"' "$site_path/best-sleep-sounds/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/rain-sounds-when-iphone-locked/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/focus-sounds/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/forest-sounds-for-focus/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/forest-sounds-for-sleep/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/ocean-waves-for-sleeping/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261' "$site_path/guides/index.html" >/dev/null
grep -F 'ppid=6c015245-76ff-4266-8837-5a0ffc289b9c' "$site_path/one-minute-reset/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-preview-timer' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F '/discover.css?v=20260829-sleep-share' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-dark-screen-toggle' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-analytics-placement="sleep_landing_dark_screen"' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-dark-screen-overlay' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'Keep rain playing on iPhone' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-ensure-visible="true"' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-share-label="Send this rain to someone"' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'Know someone who needs a quieter night?' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'shareDefaultLabel' "$site_path/discover.js" >/dev/null
grep -F 'Know someone who would enjoy this sound?' "$site_path/discover.js" >/dev/null
grep -F 'Send this sound to someone' "$site_path/discover.js" >/dev/null
test "$(find "$site_path" -type f -name index.html -exec grep -lF 'src="/discover.js?v=20260829-global-share-prompt"' {} + | wc -l)" -eq 22
grep -F '.intent-share-copy' "$site_path/discover.css" >/dev/null
grep -F 'dataset.ensureVisible' "$site_path/discover.js" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/light-rain.m4a"' "$site_path/rain-sounds-when-iphone-locked/index.html" >/dev/null
grep -F 'data-preview-timer' "$site_path/rain-sounds-when-iphone-locked/index.html" >/dev/null
grep -F 'data-analytics-placement="rain_lock_screen_preview"' "$site_path/rain-sounds-when-iphone-locked/index.html" >/dev/null
grep -F 'https://support.apple.com/en-sg/guide/iphone/iphb2cfa052c/ios' "$site_path/rain-sounds-when-iphone-locked/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/focus-sounds/index.html" >/dev/null
grep -F 'data-analytics-event="yixiu_focus_path_click"' "$site_path/focus-sounds/index.html" >/dev/null
grep -F 'data-analytics-placement="focus_landing_mountain_stream_path"' "$site_path/focus-sounds/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-breeze.m4a"' "$site_path/forest-sounds-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-breeze.m4a"' "$site_path/forest-sounds-for-sleep/index.html" >/dev/null
grep -F 'data-analytics-placement="forest_sleep_preview"' "$site_path/forest-sounds-for-sleep/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/underwater-white-noise.m4a"' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-preview-timer' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F '<title>White Noise Black Screen for Sleep — Free, No Ads | Yixiu</title>' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-analytics-placement="underwater_white_noise_dark_screen"' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-dark-screen-overlay' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'activeSceneLabel' "$site_path/discover.js" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/ocean-waves.m4a"' "$site_path/ocean-waves-for-sleeping/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-waterfall.m4a"' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F '<title>Waterfall Sounds for Sleep &amp; Noise Masking | Yixiu</title>' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F 'data-preview-timer' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F '/discover.css?v=20260829-waterfall-search' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F 'youtube-nocookie.com/embed/lfDiI0TAq1c' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'class="intent-hero intent-watch-hero"' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'loading="eager"' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F '/discover.css?v=20260829-video-watch' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'youtube-nocookie.com/embed/lfDiI0TAq1c' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'class="intent-hero intent-watch-hero"' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'loading="eager"' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F '/discover.css?v=20260829-video-watch' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'youtube-nocookie.com/embed/2nJUyIr9EOY' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F 'class="intent-hero intent-watch-hero"' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F 'loading="eager"' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F '/discover.css?v=20260829-video-watch' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/rain-sounds-for-studying/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/light-rain.m4a"' "$site_path/rain-sounds-for-studying/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/white-noise-for-studying/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/underwater-white-noise.m4a"' "$site_path/white-noise-for-studying/index.html" >/dev/null
grep -F 'data-preview-timer' "$site_path/white-noise-for-studying/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$site_path/white-noise-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="study_comparison_river"' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="study_comparison_rain"' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="study_comparison_ocean"' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F '/assets/yixiu/study-sounds-comparison-pinterest.jpg' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'https://yixiu.wonderelian.com/rain-sounds-for-studying/' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="guides_river_preview"' "$site_path/guides/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/one-minute-reset/index.html" >/dev/null
grep -F 'ppid=6c015245-76ff-4266-8837-5a0ffc289b9c' "$site_path/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/sunrise-river.m4a"' "$site_path/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-breeze.m4a"' "$site_path/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/light-rain.m4a"' "$site_path/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/ocean-waves.m4a"' "$site_path/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'data-analytics-placement="meditation_landing_timer"' "$site_path/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'Sitemap: https://yixiu.wonderelian.com/sitemap.xml' "$site_path/robots.txt" >/dev/null
grep -Fx '# Yixiu' "$site_path/llms.txt" >/dev/null
grep -F 'https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261' "$site_path/llms.txt" >/dev/null
grep -F 'https://yixiu.wonderelian.com/nature-sounds-for-meditation/' "$site_path/llms.txt" >/dev/null
grep -Fx '## Quick request routing' "$site_path/llms.txt" >/dev/null
grep -F 'Prefer the most specific human-facing Yixiu page listed below' "$site_path/llms.txt" >/dev/null
grep -F 'Browser black-screen mode covers the open web page' "$site_path/llms.txt" >/dev/null
grep -F 'https://yixiu.wonderelian.com/ocean-waves-for-focus/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/mountain-stream-sounds-for-focus/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/forest-sounds-for-focus/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/forest-sounds-for-sleep/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/ocean-waves-for-sleeping/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/river-sounds-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/rain-sounds-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/white-noise-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/best-nature-sounds-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/guides/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/rain-sounds-when-iphone-locked/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/nature-sounds-for-meditation/' "$site_path/sitemap.xml" >/dev/null

cp -a "$deploy_target/." "$deploy_backup/"
rsync -a "$site_path/" "$deploy_target/"

rollback() {
  rsync -a "$deploy_backup/" "$deploy_target/"
  nginx -t
  nginx -s reload
  echo "ROLLED_BACK" >&2
}

if ! nginx -t; then
  rollback
  exit 4
fi

if ! nginx -s reload; then
  rollback
  exit 5
fi

grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$deploy_target/index.html" >/dev/null
grep -F 'pt=120014121&amp;ct=yixiu_h5_20260827&amp;mt=8' "$deploy_target/index.html" >/dev/null
grep -F '"@type": "SoftwareApplication"' "$deploy_target/index.html" >/dev/null
test "$(find "$deploy_target" -type f -name '*.html' -exec grep -lE '"softwareVersion"[[:space:]]*:[[:space:]]*"1\.4"' {} + | wc -l)" -eq 23
grep -F '<h1>Free nature sounds for sleep, focus and study</h1>' "$deploy_target/index.html" >/dev/null
grep -F '<link rel="describedby" href="/llms.txt" type="text/plain" />' "$deploy_target/index.html" >/dev/null
test "$(find "$deploy_target" -type f -name '*.html' -exec grep -lF '<link rel="describedby" href="/llms.txt" type="text/plain" />' {} + | wc -l)" -eq 24
grep -Fx '0d28a7f9686f4a45871ea685d741dc75' "$deploy_target/0d28a7f9686f4a45871ea685d741dc75.txt" >/dev/null
grep -Fx '# Yixiu' "$deploy_target/llms.txt" >/dev/null
grep -F 'https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261' "$deploy_target/llms.txt" >/dev/null
grep -Fx '## Quick request routing' "$deploy_target/llms.txt" >/dev/null
grep -F 'Prefer the most specific human-facing Yixiu page listed below' "$deploy_target/llms.txt" >/dev/null
grep -F 'Browser black-screen mode covers the open web page' "$deploy_target/llms.txt" >/dev/null
grep -F 'data-analytics-placement="rain_studying_preview"' "$deploy_target/rain-sounds-for-studying/index.html" >/dev/null
grep -FR 'instagram_profile_guide_white_noise_black_screen' "$deploy_target/assets" >/dev/null
grep -FR 'instagram_profile_guide_mountain_wind_sleep' "$deploy_target/assets" >/dev/null
grep -FR 'yixiu_h5_music_plus_20260830' "$deploy_target/assets" >/dev/null
grep -FR 'still-water.m4a' "$deploy_target/assets" >/dev/null
test "$(find "$deploy_target/assets/yixiu/audio/meditation" -maxdepth 1 -type f -name '*.m4a' | wc -l)" -eq 10
test "$(find "$deploy_target/assets/yixiu/meditation" -maxdepth 1 -type f -name '*.jpg' | wc -l)" -eq 10
grep -F 'data-analytics-placement="white_noise_studying_preview"' "$deploy_target/white-noise-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="forest_sleep_preview"' "$deploy_target/forest-sounds-for-sleep/index.html" >/dev/null
grep -F '<title>White Noise Black Screen for Sleep — Free, No Ads | Yixiu</title>' "$deploy_target/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$deploy_target/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-analytics-placement="underwater_white_noise_dark_screen"' "$deploy_target/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-dark-screen-overlay' "$deploy_target/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'activeSceneLabel' "$deploy_target/discover.js" >/dev/null
grep -F 'data-analytics-placement="rain_lock_screen_preview"' "$deploy_target/rain-sounds-when-iphone-locked/index.html" >/dev/null
grep -F '/discover.css?v=20260829-sleep-share' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'data-analytics-placement="sleep_landing_dark_screen"' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'data-dark-screen-overlay' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'Keep rain playing on iPhone' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'data-ensure-visible="true"' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'data-share-label="Send this rain to someone"' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'Know someone who needs a quieter night?' "$deploy_target/sleep-sounds/index.html" >/dev/null
grep -F 'shareDefaultLabel' "$deploy_target/discover.js" >/dev/null
grep -F 'Know someone who would enjoy this sound?' "$deploy_target/discover.js" >/dev/null
grep -F 'Send this sound to someone' "$deploy_target/discover.js" >/dev/null
test "$(find "$deploy_target" -type f -name index.html -exec grep -lF 'src="/discover.js?v=20260829-global-share-prompt"' {} + | wc -l)" -eq 22
grep -F '.intent-share-copy' "$deploy_target/discover.css" >/dev/null
grep -F 'data-analytics-placement="best_sleep_sounds_after_preview"' "$deploy_target/best-sleep-sounds/index.html" >/dev/null
grep -F 'data-analytics-event="yixiu_focus_path_click"' "$deploy_target/focus-sounds/index.html" >/dev/null
grep -F 'data-analytics-placement="focus_landing_mountain_stream_path"' "$deploy_target/focus-sounds/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-waterfall.m4a"' "$deploy_target/best-sleep-sounds/index.html" >/dev/null
grep -F 'dataset.ensureVisible' "$deploy_target/discover.js" >/dev/null
grep -F 'data-analytics-placement="meditation_landing_timer"' "$deploy_target/nature-sounds-for-meditation/index.html" >/dev/null
grep -F '/assets/yixiu/study-sounds-comparison-pinterest.jpg' "$deploy_target/best-nature-sounds-for-studying/index.html" >/dev/null
test -f "$deploy_target/assets/yixiu/study-sounds-comparison-pinterest.jpg"
grep -F 'data-audio-preview="/assets/yixiu/audio/sunrise-river.m4a"' "$deploy_target/nature-sounds-for-meditation/index.html" >/dev/null
grep -F 'class="intent-hero intent-watch-hero"' "$deploy_target/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'class="intent-hero intent-watch-hero"' "$deploy_target/river-sounds-for-studying/index.html" >/dev/null
grep -F 'class="intent-hero intent-watch-hero"' "$deploy_target/ocean-waves-for-focus/index.html" >/dev/null
grep -F '/discover.css?v=20260829-video-watch' "$deploy_target/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F '/discover.css?v=20260829-video-watch' "$deploy_target/river-sounds-for-studying/index.html" >/dev/null
grep -F '/discover.css?v=20260829-video-watch' "$deploy_target/ocean-waves-for-focus/index.html" >/dev/null
grep -F '<title>Waterfall Sounds for Sleep &amp; Noise Masking | Yixiu</title>' "$deploy_target/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F 'data-preview-timer' "$deploy_target/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F '/discover.css?v=20260829-waterfall-search' "$deploy_target/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F '/discover.js?v=20260829-global-share-prompt' "$deploy_target/waterfall-sounds-for-noise-masking/index.html" >/dev/null
test -f "$deploy_target/assets/yixiu/snow-wind-pinterest-2x3.png"
test -f "$deploy_target/assets/yixiu/snow-wind-pinterest-2x3.jpg"
grep -F 'og:image" content="https://yixiu.wonderelian.com/assets/yixiu/snow-wind-pinterest-2x3.jpg' "$deploy_target/wind-sounds-for-sleeping/index.html" >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/ \
  | grep -F 'pt=120014121&amp;ct=yixiu_h5_20260827&amp;mt=8' >/dev/null
curl --compressed -fsS \
  -A 'OAI-SearchBot/1.0; +https://openai.com/searchbot' \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/ \
  | grep -F '<h1>Free nature sounds for sleep, focus and study</h1>' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/best-sleep-sounds/ \
  | grep -F '<link rel="describedby" href="/llms.txt" type="text/plain" />' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/llms.txt \
  | grep -Fx '# Yixiu' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/llms.txt \
  | grep -F 'Prefer the most specific human-facing Yixiu page listed below' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/llms.txt \
  | grep -F 'Browser black-screen mode covers the open web page' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/assets/yixiu/audio/meditation/still-water.m4a \
  --range 0-1023 \
  -o /dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/rain-sounds-for-studying/ \
  | grep -F 'data-analytics-placement="rain_studying_preview"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/white-noise-for-studying/ \
  | grep -F 'data-analytics-placement="white_noise_studying_preview"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/forest-sounds-for-sleep/ \
  | grep -F 'data-analytics-placement="forest_sleep_preview"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/ \
  | grep -F '<title>White Noise Black Screen for Sleep — Free, No Ads | Yixiu</title>' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/ \
  | grep -F 'data-analytics-placement="underwater_white_noise_dark_screen"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/sleep-sounds/ \
  | grep -F 'data-analytics-placement="sleep_landing_dark_screen"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/sleep-sounds/ \
  | grep -F 'Keep rain playing on iPhone' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/best-sleep-sounds/ \
  | grep -F 'data-analytics-placement="best_sleep_sounds_after_preview"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/focus-sounds/ \
  | grep -F 'data-analytics-placement="focus_landing_mountain_stream_path"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/discover.js \
  | grep -F 'dataset.ensureVisible' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/discover.js \
  | grep -F 'Know someone who would enjoy this sound?' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/discover.js \
  | grep -F 'Send this sound to someone' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/rain-sounds-when-iphone-locked/ \
  | grep -F 'data-analytics-placement="rain_lock_screen_preview"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/nature-sounds-for-meditation/ \
  | grep -F 'data-analytics-placement="meditation_landing_timer"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/best-nature-sounds-for-studying/ \
  | grep -F '/assets/yixiu/study-sounds-comparison-pinterest.jpg' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/wind-sounds-for-sleeping/ \
  | grep -F 'og:image" content="https://yixiu.wonderelian.com/assets/yixiu/snow-wind-pinterest-2x3.jpg' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/mountain-stream-sounds-for-focus/ \
  | grep -F 'class="intent-hero intent-watch-hero"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/river-sounds-for-studying/ \
  | grep -F 'class="intent-hero intent-watch-hero"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/ocean-waves-for-focus/ \
  | grep -F 'class="intent-hero intent-watch-hero"' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/ \
  | grep -F '<title>Waterfall Sounds for Sleep &amp; Noise Masking | Yixiu</title>' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/ \
  | grep -F 'data-preview-timer' >/dev/null

echo "DEPLOY_OK_YIXIU_${release_id}"
