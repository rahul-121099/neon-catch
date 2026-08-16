# Contributing

Thanks for helping improve Neon Catch.

## Workflow

1. Fork the project on GitHub (or create a branch if you have push access).
2. Create a feature branch: `git checkout -b feature/short-name`
3. Make focused changes (prefer small PRs).
4. Test in a desktop browser and, when possible, on a phone/touch device.
5. Open a pull request with a short summary of *why* the change exists.

## Coding guidelines

- Keep the stack plain HTML/CSS/JS unless there is a strong reason to add tooling.
- Match existing naming and formatting in `js/game.js` and `css/style.css`.
- Prefer readable game logic over micro-optimizations.
- Update docs in `docs/` (and `README.md` when needed) when behavior or setup changes. The GitHub wiki is generated from those files on push to `main`.

## Suggested checks before PR

- [ ] Game starts from the overlay
- [ ] Keyboard and pointer controls both move the paddle
- [ ] Catching good orbs increases score
- [ ] Voids / missed goods reduce lives and end the run at 0
- [ ] Best score persists across refresh
- [ ] Layout remains usable on a narrow phone viewport

## GitHub Pages

Deployment is handled by `.github/workflows/pages.yml` on pushes to `main`. No extra Pages config file is required beyond enabling **GitHub Actions** as the Pages source in repo settings.
