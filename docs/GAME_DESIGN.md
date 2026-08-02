# Game Design

## Concept

**Neon Catch** is a one-screen reflex game. A paddle slides along the bottom of the playfield while orbs fall from the top. Players catch valuable orbs and avoid hazardous voids.

## Goals

- Instant to start (open HTML and play)
- Readable in under 30 seconds of rules
- Difficulty ramps gently via spawn rate and fall speed
- Works on desktop keyboard and mobile touch

## Core loop

1. Player starts from the title overlay.
2. Orbs spawn above the canvas and fall.
3. Player positions the paddle under good orbs.
4. Hits and misses adjust score / lives.
5. On zero lives, show game-over and offer replay.

## Entities

| Entity | Role |
| --- | --- |
| Paddle | Player-controlled catcher |
| Good orb | +10 score on catch; costs a life if missed |
| Void orb | Costs a life on catch; safe if missed |
| Particles | Short-lived feedback on catch / hit |

## Difficulty curve

- Spawn interval starts near ~1.0s and shrinks toward ~0.35s over time.
- Fall speed increases with elapsed run time.
- Void spawn chance rises from ~18% toward ~42%.

## UX notes

- Brand name **Neon Catch** is the primary visual identity on the start screen.
- HUD shows score, best, and lives at all times during play.
- Overlay covers the canvas only for start / game-over; it hides while playing.
