#!/usr/bin/env bash
# Build GitHub wiki pages from README.md and docs/*.md, then push to <repo>.wiki.git
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="${GITHUB_REPOSITORY:-rahul-121099/neon-catch}"
WIKI_URL="${WIKI_URL:-https://github.com/${REPO}.wiki.git}"
STAGING="$(mktemp -d)"
trap 'rm -rf "$STAGING"' EXIT

rewrite_links() {
  sed -E \
    -e 's|\[Game design\]\(docs/GAME_DESIGN\.md\)|[[Game Design]]|g' \
    -e 's|\[Architecture\]\(docs/ARCHITECTURE\.md\)|[[Architecture]]|g' \
    -e 's|\[Setup \& GitHub\]\(docs/SETUP\.md\)|[[Setup]]|g' \
    -e 's|\[Contributing\]\(docs/CONTRIBUTING\.md\)|[[Contributing]]|g' \
    -e "s|\[LICENSE\]\(LICENSE\)|[LICENSE](https://github.com/${REPO}/blob/main/LICENSE)|g"
}

{
  echo "> This wiki is generated from \`README.md\` and \`docs/\` in the [neon-catch](https://github.com/${REPO}) repository. Edit those files and push to \`main\` to update the wiki."
  echo
  rewrite_links < "$ROOT/README.md"
} > "$STAGING/Home.md"

rewrite_links < "$ROOT/docs/GAME_DESIGN.md" > "$STAGING/Game-Design.md"
rewrite_links < "$ROOT/docs/ARCHITECTURE.md" > "$STAGING/Architecture.md"
rewrite_links < "$ROOT/docs/SETUP.md" > "$STAGING/Setup.md"
rewrite_links < "$ROOT/docs/CONTRIBUTING.md" > "$STAGING/Contributing.md"

cat > "$STAGING/_Sidebar.md" <<'EOF'
**Neon Catch**

* [[Home]]
* [[Game Design]]
* [[Architecture]]
* [[Setup]]
* [[Contributing]]
EOF

cat > "$STAGING/_Footer.md" <<EOF
[Play the game](https://rahul-121099.github.io/neon-catch/) · [Source](https://github.com/${REPO})
EOF

WIKI_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGING" "$WIKI_DIR"' EXIT

if git clone --depth 1 "$WIKI_URL" "$WIKI_DIR" 2>/dev/null; then
  :
else
  git init -b master "$WIKI_DIR"
  git -C "$WIKI_DIR" remote add origin "$WIKI_URL"
fi

# Keep only generated wiki pages; drop leftover clones of git metadata
find "$WIKI_DIR" -maxdepth 1 -type f -name '*.md' -delete
cp "$STAGING"/*.md "$WIKI_DIR/"

git -C "$WIKI_DIR" add -A
if git -C "$WIKI_DIR" diff --cached --quiet; then
  echo "Wiki already up to date."
  exit 0
fi

git -C "$WIKI_DIR" \
  -c user.name="${GIT_AUTHOR_NAME:-neon-catch-wiki}" \
  -c user.email="${GIT_AUTHOR_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}" \
  commit -m "Sync wiki from repository docs."

BRANCH="$(git -C "$WIKI_DIR" rev-parse --abbrev-ref HEAD)"
if ! git -C "$WIKI_DIR" push -u origin "$BRANCH"; then
  cat <<EOF
Could not push to ${WIKI_URL}

GitHub does not create the wiki git remote until the first page exists.
While logged into GitHub as a repo admin, open:

  https://github.com/${REPO}/wiki

Click "Create the first page", save a placeholder, then re-run:

  ./scripts/publish-wiki.sh
EOF
  exit 1
fi
echo "Published wiki for ${REPO}."
