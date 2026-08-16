# Setup

## Requirements

- A modern browser (Chrome, Firefox, Safari, Edge)
- Git
- Optional: a static file server for local testing
- GitHub account (to host the remote)

## Clone

```bash
git clone git@github.com:<your-username>/neon-catch.git
cd neon-catch
```

Or HTTPS:

```bash
git clone https://github.com/<your-username>/neon-catch.git
cd neon-catch
```

## Run

Open `index.html` directly, or:

```bash
python3 -m http.server 8080
```

## GitHub remote

### Option A — GitHub CLI (`gh`)

```bash
# Install (macOS with Homebrew)
brew install gh

gh auth login
gh repo create neon-catch --public --source=. --remote=origin --push --description "Neon Catch — HTML/CSS/JS arcade mini-game"
```

### Option B — GitHub web UI

1. Create a new blank repository named `neon-catch` on GitHub (do not add a README).
2. Add the remote and push:

```bash
git remote add origin git@github.com:<your-username>/neon-catch.git
git push -u origin main
```

## GitHub wiki

The wiki at `https://github.com/<your-username>/neon-catch/wiki` is generated from `README.md` and `docs/*.md`. After the first publish (or any later docs change on `main`), the [Sync GitHub Wiki](../.github/workflows/wiki.yml) workflow updates those pages.

GitHub does not create the wiki git remote until one page exists. If clone/push fails with "repository not found", open the wiki in the browser, click **Create the first page**, save a placeholder, then publish again.

To publish locally:

```bash
./scripts/publish-wiki.sh
```

If the Actions sync cannot push (GitHub's default `GITHUB_TOKEN` sometimes cannot write the wiki remote), add a `repo`-scoped personal access token as the `WIKI_TOKEN` repository secret.

## GitHub Pages

This repo includes `.github/workflows/pages.yml`, which deploys the site from `main`.

After the first successful workflow run:

1. Open the repo on GitHub → **Settings → Pages**
2. Confirm **Source** is **GitHub Actions**
3. Visit the Pages URL shown in the workflow summary
