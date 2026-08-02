# Setup

## Requirements

- A modern browser (Chrome, Firefox, Safari, Edge)
- Git
- Optional: a static file server for local testing
- GitLab account (to host the remote)

## Clone

```bash
git clone git@gitlab.com:<your-username>/neon-catch.git
cd neon-catch
```

Or HTTPS:

```bash
git clone https://gitlab.com/<your-username>/neon-catch.git
cd neon-catch
```

## Run

Open `index.html` directly, or:

```bash
python3 -m http.server 8080
```

## GitLab remote

### Option A — GitLab CLI (`glab`)

```bash
# Install (macOS with Homebrew)
brew install glab

glab auth login
glab repo create neon-catch --public --description "Neon Catch — HTML/CSS/JS arcade mini-game" --source=. --remote=origin --push
```

### Option B — GitLab web UI

1. Create a new blank project named `neon-catch` on GitLab.
2. Add the remote and push:

```bash
git remote add origin git@gitlab.com:<your-username>/neon-catch.git
git push -u origin main
```

### Option C — GitLab API

```bash
curl --header "PRIVATE-TOKEN: <your-token>" \
  --data "name=neon-catch&visibility=public&description=Neon Catch HTML/CSS/JS game" \
  "https://gitlab.com/api/v4/projects"
```

Then add `origin` from the returned `http_url_to_repo` / `ssh_url_to_repo` and push.

## Project pages (optional)

In GitLab: **Settings → Pages**. For this static site, enabling Pages with the default config can serve `index.html` from the repo root on many setups, or use GitLab CI with a simple pages job (see `CONTRIBUTING.md` if you add `.gitlab-ci.yml`).
