#!/bin/sh
# Vercel build: copy the static site into dist/ and stamp this release on the
# code, so browsers never mix in stale cached files: version.txt holds the id,
# and every module import carries it. (api/ is deployed separately by Vercel.)
set -e
v=$(printf '%s' "${VERCEL_GIT_COMMIT_SHA:-local$(date +%s)}" | cut -c1-12)
rm -rf dist && mkdir dist
cp -r index.html manifest.webmanifest og.png icons css js dist/
cd dist
echo "$v" > version.txt
sed -i -E "s#(from '\./[A-Za-z0-9_-]+\.js)'#\1?v=$v'#g; s#(import\('\./[A-Za-z0-9_-]+\.js)'#\1?v=$v'#g" js/*.js
if grep -nE "from '[^']+\.js'|import\('[^']+\.js'\)" js/*.js; then echo "Unstamped imports remain" >&2; exit 1; fi
