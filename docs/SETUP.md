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

## GitHub Pages

This repo includes `.github/workflows/pages.yml`, which deploys the site from `main`.

After the first successful workflow run:

1. Open the repo on GitHub → **Settings → Pages**
2. Confirm **Source** is **GitHub Actions**
3. Visit the Pages URL shown in the workflow summary
