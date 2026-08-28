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
test -f "$site_path/focus-sounds/index.html"
test -f "$site_path/forest-sounds-for-focus/index.html"
test -f "$site_path/underwater-white-noise-for-sleep/index.html"
test -f "$site_path/ocean-waves-for-sleeping/index.html"
test -f "$site_path/ocean-waves-for-focus/index.html"
test -f "$site_path/mountain-stream-sounds-for-focus/index.html"
test -f "$site_path/waterfall-sounds-for-noise-masking/index.html"
test -f "$site_path/river-sounds-for-studying/index.html"
test -f "$site_path/rain-sounds-for-studying/index.html"
test -f "$site_path/best-nature-sounds-for-studying/index.html"
test -f "$site_path/guides/index.html"
test -f "$site_path/one-minute-reset/index.html"
test -f "$site_path/robots.txt"
test -f "$site_path/sitemap.xml"
test -f "$site_path/analytics.js"
test -f "$site_path/discover.js"
test -f "$site_path/0d28a7f9686f4a45871ea685d741dc75.txt"
test -f "$site_path/assets/yixiu/window-rain.webp"
test -f "$site_path/assets/yixiu/underwater-echo.webp"
test -n "$(find "$site_path/assets" -maxdepth 1 -type f -name 'index-*.js' -print -quit)"
grep -F '"@type": "SoftwareApplication"' "$site_path/index.html" >/dev/null
grep -Fx '0d28a7f9686f4a45871ea685d741dc75' "$site_path/0d28a7f9686f4a45871ea685d741dc75.txt" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/index.html" >/dev/null
grep -F 'pt=120014121&amp;ct=yixiu_h5_20260827&amp;mt=8' "$site_path/index.html" >/dev/null
grep -F 'ppid=67cb8784-2b16-4849-b940-90fdf4d99752' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/focus-sounds/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/forest-sounds-for-focus/index.html" >/dev/null
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
grep -F '/discover.css?v=20260828-sleep-timer' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F '/discover.js?v=20260828-sleep-timer' "$site_path/sleep-sounds/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/focus-sounds/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-breeze.m4a"' "$site_path/forest-sounds-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/underwater-white-noise.m4a"' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-preview-timer' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F '/discover.js?v=20260828-white-noise-timer' "$site_path/underwater-white-noise-for-sleep/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/ocean-waves.m4a"' "$site_path/ocean-waves-for-sleeping/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/ocean-waves-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/forest-waterfall.m4a"' "$site_path/waterfall-sounds-for-noise-masking/index.html" >/dev/null
grep -F 'youtube-nocookie.com/embed/lfDiI0TAq1c' "$site_path/mountain-stream-sounds-for-focus/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'youtube-nocookie.com/embed/lfDiI0TAq1c' "$site_path/river-sounds-for-studying/index.html" >/dev/null
grep -F 'ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759' "$site_path/rain-sounds-for-studying/index.html" >/dev/null
grep -F 'data-audio-preview="/assets/yixiu/audio/light-rain.m4a"' "$site_path/rain-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="study_comparison_river"' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="study_comparison_rain"' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="study_comparison_ocean"' "$site_path/best-nature-sounds-for-studying/index.html" >/dev/null
grep -F 'data-analytics-placement="guides_river_preview"' "$site_path/guides/index.html" >/dev/null
grep -F 'data-audio-preview=' "$site_path/one-minute-reset/index.html" >/dev/null
grep -F 'Sitemap: https://yixiu.wonderelian.com/sitemap.xml' "$site_path/robots.txt" >/dev/null
grep -F 'https://yixiu.wonderelian.com/ocean-waves-for-focus/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/mountain-stream-sounds-for-focus/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/forest-sounds-for-focus/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/ocean-waves-for-sleeping/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/river-sounds-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/rain-sounds-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/best-nature-sounds-for-studying/' "$site_path/sitemap.xml" >/dev/null
grep -F 'https://yixiu.wonderelian.com/guides/' "$site_path/sitemap.xml" >/dev/null

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
grep -Fx '0d28a7f9686f4a45871ea685d741dc75' "$deploy_target/0d28a7f9686f4a45871ea685d741dc75.txt" >/dev/null
grep -F 'data-analytics-placement="rain_studying_preview"' "$deploy_target/rain-sounds-for-studying/index.html" >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/ \
  | grep -F 'pt=120014121&amp;ct=yixiu_h5_20260827&amp;mt=8' >/dev/null
curl --compressed -fsS \
  --resolve 'yixiu.wonderelian.com:443:127.0.0.1' \
  https://yixiu.wonderelian.com/rain-sounds-for-studying/ \
  | grep -F 'data-analytics-placement="rain_studying_preview"' >/dev/null

echo "DEPLOY_OK_YIXIU_${release_id}"
