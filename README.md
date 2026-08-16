# Neon Catch

A tiny browser arcade game built with plain **HTML**, **CSS**, and **JavaScript**. Catch glowing orbs, dodge red voids, and chase a high score — no frameworks, no build step.

## Play locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# Node (if you have npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Controls

| Input | Action |
| --- | --- |
| `←` / `→` or `A` / `D` | Move paddle |
| Mouse drag / touch | Move paddle |
| `Enter` / `Space` | Start or restart from overlay |
| **Play** button | Start or restart |

## Scoring

- Catch a cyan/lime orb: **+10**
- Miss a good orb or catch a red void: **−1 life**
- You start with **3 lives**
- Best score is saved in `localStorage` (`neon-catch-best`)

## Project layout

```text
neon-catch/
├── index.html          # Game shell / UI
├── css/style.css       # Layout and theme
├── js/game.js          # Game loop, input, collision
├── fonts/              # Self-hosted Orbitron + Space Grotesk (OFL)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GAME_DESIGN.md
│   ├── SETUP.md
│   └── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Docs

- [Game design](docs/GAME_DESIGN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Setup & GitHub](docs/SETUP.md)
- [Contributing](docs/CONTRIBUTING.md)

## License

MIT — see [LICENSE](LICENSE).
