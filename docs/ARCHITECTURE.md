# Architecture

Neon Catch is intentionally small: three front-end assets and no bundler.

## Runtime overview

```text
Browser
  └── index.html
        ├── css/style.css   (layout, theme, overlay)
        └── js/game.js      (state, loop, render, input)
```

## `js/game.js`

Single IIFE module that owns:

1. **State** — score, lives, timers, orb/particle arrays, input flags
2. **Simulation** — spawn, movement, collision, particle lifetime (`update`)
3. **Rendering** — background, orbs, particles, paddle (`draw`)
4. **Loop** — `requestAnimationFrame` with clamped delta time
5. **Persistence** — best score via `localStorage`

### Main data

```js
state = { running, score, best, lives, time, spawnTimer, orbs, particles, keys, pointerX }
paddle = { x, y, w, h, speed }
```

### Collision model

Axis-aligned paddle rectangle vs circle (orb). On paddle contact:

- good orb → score++, burst, remove orb
- void orb → lives--, burst, remove orb; end if lives ≤ 0

If a good orb exits the bottom without being caught → lives--.

## `css/style.css`

Handles the page chrome (brand, HUD, overlay, footer). The playfield itself is drawn on `<canvas>`; CSS only sizes and frames it.

## Extension points

| Idea | Where to change |
| --- | --- |
| Power-ups | `spawnOrb`, collision branch in `update` |
| Sound | hook bursts / game-over in `burst` / `endGame` |
| Levels | gate spawn params by `state.score` thresholds |
| Mobile polish | vibrate API on void hit (optional) |

Keep the no-build constraint unless the project outgrows a single `game.js`.
