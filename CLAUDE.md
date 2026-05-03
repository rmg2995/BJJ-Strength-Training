# BJJ Strength Training

A mobile-first React app for tracking an 8-week BJJ-specific strength program. Designed around equipment constraint (Force USA F22 rack + Bowflex 1090 dumbbells) and a key training constraint: an L4/L5 disc issue.

## Stack

- Vite + React 18 (JSX, no TypeScript)
- Inline styles + a single `<style>` block for fonts and resets — no Tailwind, no CSS modules
- No router, no state library, no persistence (set-logging state lives in `App.jsx`)

## Layout

- [src/App.jsx](src/App.jsx) — top-level state: current `level` and the shared `data` map for logged sets
- [src/WorkoutApp.jsx](src/WorkoutApp.jsx) — data-driven UI; receives `program` + `level` and renders both the Workout and Overview tabs
- [src/workouts/intermediate.js](src/workouts/intermediate.js) — intermediate program data (4 days × 5–6 exercises)
- [src/workouts/advanced.js](src/workouts/advanced.js) — advanced program data (4 days × 7–10 exercises, more volume)

The two source-of-truth `.jsx` files (`bjj-strength-intermediate.jsx`, `bjj-strength-advanced.jsx`) at the repo root are the originals. The React project consumes the extracted data; if you tweak a program, edit the file under `src/workouts/`.

## Data shape

Each program exports:

```js
{
  id, name, shortName, totalWeeks, tagline, description,
  days: [{ id, label, emoji, color, colorDim, warmup, optional?, exercises: [{ name, sets, reps, note, spine }] }],
  rules: [[title, detail], ...]
}
```

`spine: true` flags exercises that load the lumbar — surfaces the 🦴 marker in the UI. The L4/L5 warning is rendered from this flag.

## Logged-set storage

`data` is a flat dict keyed by `${level}|w${week}|${dayId}|${exerciseName}|${setIndex}` → `{ w: weight, d: done }`. Including `level` in the key means switching programs preserves logs for both. Persisted to `localStorage` under `bjj.v1` along with the active level and week, so reloading the page resumes where you left off.

## Conventions

- Programs are pure data. The UI never hardcodes day/exercise names.
- Day order is stable (A → B → C → D). Adding/removing days is fine; the UI adapts. Adding a new program means a new file in `src/workouts/` plus an entry in the `PROGRAMS` map and `LEVELS` array.
- Day colors are a deliberate visual code (Pull=blue, Lower=green, Press=purple, Accessory=orange). Keep them consistent across programs.
- Don't refactor the inline-style approach — it's intentional for the embedded `<style>` deployment use case.

## Running

```bash
npm install
npm run dev
```
