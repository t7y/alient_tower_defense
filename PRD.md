Here’s a ready-to-copy `PRD.md` for the new project:

```md
# PRD: Starbase Robot Rush

## 1. Product Summary

Starbase Robot Rush is a colorful browser-based tower defense game where players defend a playful sci-fi starbase from waves of silly alien robots. Players place towers, upgrade defenses, collect energy, and survive increasingly tricky robot waves.

The game should feel bright, strategic, arcade-like, and kid-friendly. Combat is non-graphic and toy-like: robots pop into sparks, bolts, stars, or scrap confetti.

## 2. Recommended Stack

Use the same lightweight browser stack:

- Static HTML
- CSS
- JavaScript
- HTML Canvas rendering
- Local storage for progress/settings
- No required backend
- No required build step
- Optional later migration to TypeScript/Vite if desired

## 3. Target Audience

Primary audience:

- Kids ages 8–12 who enjoy strategy, robots, upgrades, and colorful arcade games.

Secondary audience:

- Casual players who want quick tower defense rounds.
- Parents looking for a safe, browser-playable strategy game.

## 4. Product Goals

1. Deliver a playable tower defense prototype in the browser.
2. Include multiple tower types, robot enemies, upgrades, and waves.
3. Make strategy clear and satisfying without dense instructions.
4. Keep visuals colorful, non-realistic, and safe.
5. Support short sessions of 5–10 minutes.

## 5. Safety And Tone Rules

- Enemies are alien robots only.
- No people, animals, gore, injury, screams, or horror.
- Use silly sci-fi effects: sparks, stars, bubbles, zaps, foam smoke, and confetti.
- Avoid realistic weapons, military themes, blood, fire, or explosions.
- Towers should look like toy gadgets, science fair machines, or colorful space devices.
- Robot defeat animations should be playful: robots spin, pop, wobble, or fall into scrap stars.

## 6. Core Gameplay Loop

1. Player starts a level with a visible robot path.
2. Player places towers on build pads or open tiles.
3. Robot waves enter from one side of the map.
4. Towers automatically target and fire at robots.
5. Defeated robots drop energy.
6. Player spends energy to build or upgrade towers.
7. If robots reach the starbase, the base loses shields.
8. Player wins by surviving all waves.
9. Player earns stars based on remaining shields and score.
10. Stars unlock cosmetic tower skins or new challenge levels.

## 7. MVP Feature Set

### 7.1 Main Screens

Required screens:

- Main menu
- Level select
- In-game HUD
- Pause menu
- Victory screen
- Defeat screen
- Settings screen

HUD elements:

- Base shields
- Current wave
- Energy
- Score
- Selected tower info
- Start wave button
- Fast-forward toggle

### 7.2 Levels

MVP includes 3 levels:

1. **Moon Meadow**
   - Simple winding path.
   - Tutorial level.
   - 8 waves.

2. **Crystal Canyon**
   - Split path with two robot lanes.
   - Introduces flying robots.
   - 10 waves.

3. **Orbit Outpost**
   - Longer path with tight turns.
   - More robot variety.
   - 12 waves.

Acceptance criteria:

- Each level has a unique color palette.
- Each level can be completed in under 10 minutes.
- Levels are replayable for better star ratings.

### 7.3 Towers

MVP tower types:

1. **Zap Tower**
   - Balanced single-target tower.
   - Medium range, medium damage.

2. **Bubble Cannon**
   - Slows robots.
   - Low damage, useful support.

3. **Star Blaster**
   - Fires splash-damage star shots.
   - Good against groups.

4. **Laser Sprout**
   - Fast-firing beam tower.
   - Short range, high rate of fire.

Each tower supports:

- Placement
- Selling
- 3 upgrade levels
- Range preview
- Simple tooltip

Acceptance criteria:

- Towers automatically target enemies.
- Upgrades visibly improve range, damage, speed, or slow strength.
- Player can understand tower roles quickly.

### 7.4 Alien Robots

MVP robot types:

1. **Walker Bot**
   - Basic enemy.
   - Medium speed, medium health.

2. **Tiny Zoomer**
   - Fast but weak.

3. **Chunky Bot**
   - Slow with high health.

4. **Shield Bot**
   - Temporarily resists damage.

5. **Hover Bot**
   - Ignores some ground-only slow effects.

Robot behavior:

- Follow path waypoints.
- Lose health when hit.
- Reach base to remove shields.
- Pop into sparks/confetti when defeated.

Acceptance criteria:

- At least 5 enemy types exist.
- Waves mix robot types.
- Robot differences are visually clear.

### 7.5 Combat

Combat rules:

- Towers fire automatically.
- Projectiles use simple arcade motion.
- Hits reduce robot health.
- Splash towers affect nearby robots.
- Slow towers reduce movement speed briefly.
- Defeated robots award energy and score.

Acceptance criteria:

- Combat feedback is readable.
- Projectiles and impacts are visible.
- No realistic violence or harsh effects.

### 7.6 Economy

Resources:

- Player starts each level with energy.
- Defeated robots drop energy.
- Towers cost energy.
- Upgrades cost energy.
- Selling refunds part of tower cost.

Acceptance criteria:

- Player can build at least 2 towers before wave 1.
- Energy choices feel meaningful but not punishing.
- Defeat teaches strategy instead of feeling unfair.

### 7.7 Waves

Wave system:

- Each level has predefined waves.
- Player manually starts each wave.
- Later waves become harder.
- Final wave includes a mini-boss robot.

Acceptance criteria:

- Wave pacing gives players time to build.
- Current and next wave info is visible.
- Surviving all waves triggers victory.

### 7.8 Score And Stars

Scoring events:

- Robot defeated
- Wave cleared
- Base shield bonus
- No-leak bonus
- Fast-forward bonus

Star rating:

- 1 star: level completed
- 2 stars: completed with at least 50% shields
- 3 stars: completed with at least 80% shields

Persistence:

- Best score saved locally.
- Best star rating saved locally.
- Settings saved locally.

### 7.9 Unlocks

Cosmetic unlocks:

- Tower skins:
  - Rainbow Tech
  - Candy Chrome
  - Space Garden
  - Neon Stickers
  - Cardboard Defender

- Projectile effects:
  - Stars
  - Bubbles
  - Sparks
  - Comets

Unlock rules:

- Earn stars from levels.
- Spend stars on cosmetics.
- No in-game purchases.

## 8. Controls

Desktop:

- Mouse move: aim/select
- Left click: select/build/upgrade
- Right click or Escape: cancel selection
- Space: start next wave
- F: toggle fast-forward
- Escape: pause

Optional touch:

- Tap to select/build
- Tap buttons for upgrades/waves
- Pinch/drag camera optional post-MVP

## 9. Settings

Required settings:

- Music volume
- Sound effects volume
- Reduced motion
- Screen shake toggle
- Show range indicators toggle

Settings must persist in local storage.

## 10. Art Direction

Visual mood:

- Colorful sci-fi toy box
- Saturday morning cartoon
- Friendly starbase defense
- Low-poly or flat canvas shapes

Palette:

- Bright planets
- Neon accents
- Soft shadows
- High contrast UI

Avoid:

- Dark warlike visuals
- Realistic guns
- Fireballs
- Smoke clouds that resemble real explosions

## 11. Audio Direction

Music:

- Upbeat sci-fi loop
- Light, playful, not intense

Sound effects:

- Tower fire: zap, pew, plink
- Robot hit: clank, boop, squeak
- Robot defeat: pop, sparkle, wobble
- Upgrade: cheerful chime
- Wave start: short stinger

Avoid:

- Realistic gunfire
- Explosions
- Screams
- Alarms or panic sounds

## 12. Technical Requirements

Rendering:

- Use HTML Canvas 2D.
- Use procedural shapes and simple sprites.
- Keep entities lightweight.
- Render path, towers, robots, projectiles, particles, and UI overlays.

Game loop:

- Fixed or delta-time update loop.
- Separate update and render logic.
- Cap particle count for performance.
- Remove inactive projectiles and effects.

Persistence:

- Use localStorage.
- Save:
  - Best scores
  - Stars earned
  - Cosmetics unlocked
  - Selected cosmetics
  - Settings

Performance targets:

- 60 FPS target on desktop browsers.
- 30 FPS minimum during heavy waves.
- No network required after page load.

## 13. MVP Acceptance Criteria

The MVP is complete when:

- Player can open the game in a browser.
- Player can select a level and play a full match.
- At least 3 levels exist.
- At least 4 tower types exist.
- At least 5 robot enemy types exist.
- Towers can be built, upgraded, and sold.
- Robots follow paths and damage the base if they reach it.
- Waves escalate in difficulty.
- Victory and defeat states work.
- Score, stars, settings, and unlocks persist locally.
- The game stays colorful, toy-like, and non-graphic.

## 14. Initial Build Milestones

### Milestone 1: Tower Defense Core

- Canvas map rendering
- One path
- One robot type
- One tower type
- Projectiles and damage
- Base shield loss

### Milestone 2: Strategy Loop

- Energy economy
- Tower placement
- Tower upgrades
- Multiple waves
- Victory and defeat

### Milestone 3: Content MVP

- 3 levels
- 4 tower types
- 5 robot types
- Wave definitions
- Mini-boss wave

### Milestone 4: Progression And UI

- Main menu
- Level select
- Settings
- Star ratings
- Local storage
- Cosmetic unlocks

### Milestone 5: Polish Pass

- Particles
- Audio
- Better robot animations
- Improved balance
- Accessibility toggles
- Kid-safe visual review

## 15. Post-MVP Ideas

- Endless mode
- Daily challenge seed
- Boss robots with puzzle mechanics
- Tower combo bonuses
- Level editor
- More planets
- More cosmetic themes
- Challenge modifiers
- Touch controls
```