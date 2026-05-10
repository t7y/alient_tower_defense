# Starbase Robot Rush

Starbase Robot Rush is a colorful browser-based tower defense game. Players defend a playful sci-fi starbase from waves of silly alien robots by placing toy-like towers, upgrading defenses, collecting energy, and surviving increasingly difficult levels.

The game is built as a lightweight static web app with HTML, CSS, JavaScript, Canvas 2D rendering, and localStorage persistence.

## Run

Open `index.html` directly in a browser:

```sh
open index.html
```

Or serve the folder locally:

```sh
python3 -m http.server 5173
```

Then visit:

```text
http://127.0.0.1:5173/
```

## Features

- Six playable levels:
  - Moon Meadow
  - Crystal Canyon
  - Orbit Outpost
  - Solar Scrapfield
  - Nebula Nursery
  - Comet Core
- Four tower types:
  - Zap Tower
  - Bubble Cannon
  - Star Blaster
  - Laser Sprout
- Ten robot enemy types, including shielded, hovering, splitting, repairing, blinking, and armored variants.
- Tower placement, selling, range preview, and three upgrade levels.
- Manual wave starts, fast-forward, pause, victory, and defeat states.
- Energy economy, score, shield-based star ratings, and harder late-game waves.
- Persistent progress with best scores, stars, settings, cosmetics, and campaign resume.
- Cosmetic tower skins and projectile effects unlocked with earned stars.
- Kid-friendly toy sci-fi visuals with non-graphic robot defeat effects.

## Controls

- Left click: select, build, upgrade, or interact with UI.
- Right click: cancel selection.
- Escape: cancel selection or pause.
- Space: start the next wave.
- F: toggle fast-forward.

## Project Structure

```text
.
+-- index.html
+-- styles.css
+-- src/
|   +-- main.js
+-- PRD.md
+-- README.md
```

## Persistence

Progress and settings are saved in browser localStorage under:

```text
starbase-robot-rush-v1
```

Clear site data for the page to reset progress.

## Development Notes

There is no build step and no backend. The game loop, level data, towers, enemies, rendering, UI wiring, audio, and persistence live in `src/main.js`.
