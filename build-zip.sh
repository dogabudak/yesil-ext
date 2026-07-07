#!/usr/bin/env bash
# Build a clean Chrome Web Store upload ZIP.
# Includes only the runtime files referenced by manifest.json.
set -euo pipefail
cd "$(dirname "$0")"

OUT="yesildoga-green-score-$(node -p "require('./manifest.json').version" 2>/dev/null || echo build).zip"
rm -f "$OUT"

zip -r "$OUT" \
  manifest.json \
  config.js \
  i18n.js \
  background.js \
  content.js \
  popup.html \
  popup.css \
  popup.js \
  icons \
  -x "*.DS_Store"

echo "Built $OUT"
unzip -l "$OUT"
