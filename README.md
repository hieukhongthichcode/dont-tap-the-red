# Don't Tap The Red

A lightweight 2D reaction game built with Phaser 3, TypeScript, and Vite. Tap green targets as fast as you can, but never tap the red ones!

## Requirements

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Running the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Building for production

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Game controls

- **Desktop**: Click the green targets with your mouse.
- **Mobile**: Tap the green targets on your touchscreen.

## Project structure

```
dont-tap-the-red/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.ts
    ├── config/
    │   └── gameConfig.ts
    ├── scenes/
    │   ├── BootScene.ts
    │   ├── MenuScene.ts
    │   ├── GameScene.ts
    │   └── GameOverScene.ts
    ├── objects/
    │   └── Target.ts
    ├── systems/
    │   ├── ScoreSystem.ts
    │   ├── DifficultySystem.ts
    │   └── StorageSystem.ts
    └── styles/
        └── game.css
```

## How scoring works

- Each correct green tap gives +1 base score multiplied by your current combo multiplier.
- Consecutive correct taps increase your combo streak.
- Every 5 consecutive correct taps increases the combo multiplier by 1.
- Tapping a target within 300ms of its appearance triggers a **PERFECT!** bonus, adding an extra +5 points.
- Missing a target (letting it disappear) resets your combo streak.
- Tapping a red target ends the game immediately.

## How difficulty works

Difficulty increases gradually as your score rises:

- **Target radius** shrinks from 45px down to 25px.
- **Red target chance** increases from 10% up to 40%.
- **Target lifetime** decreases from 1500ms down to 600ms.
- **Edge spawning chance** increases, making targets more likely to appear near the play area edges.
- **Level** increases every 10 points.

Difficulty is capped so the game never becomes impossible.

## How to modify colors and difficulty

Edit the constants in:

- `src/systems/DifficultySystem.ts` — adjust base values and caps for radius, red chance, lifetime, and edge chance.
- `src/scenes/MenuScene.ts` and `src/scenes/GameOverScene.ts` — adjust UI colors.
- `src/objects/Target.ts` — change the green (`0x2ecc71`) and red (`0xe94560`) target colors.
- `src/styles/game.css` — change the background color and canvas styling.
