# BJJ Strength Training

A mobile-first React app for tracking an 8-week BJJ-specific strength program. Designed around equipment constraint (Force USA F22 rack + Bowflex 1090 dumbbells) and a key training constraint: an L4/L5 disc issue.

## Stack

- Vite + React 18 (JSX, no TypeScript)
- Inline styles + a single `<style>` block for fonts and resets — no Tailwind, no CSS modules
- No router, no state library. State lives in `App.jsx` and is persisted to `localStorage`

## Layout

- [src/App.jsx](src/App.jsx) — top-level state (`level`, `week`, daily `ready`, and the shared `data` map for logged sets) plus `localStorage` persistence
- [src/WorkoutApp.jsx](src/WorkoutApp.jsx) — data-driven UI; receives `program` + `level` and renders the Week, Workout, Progress and Overview tabs (opens on Week)
- [src/engine.js](src/engine.js) — pure helpers that turn program data into a week- and readiness-specific session (deload, Tired/Gassed scaling, timer segments, phases)
- [src/IntervalTimer.jsx](src/IntervalTimer.jsx) — countdown timer with beeps/vibration; marks rounds done as they finish
- [src/migrations.js](src/migrations.js) — one-time copy of old logged sets onto the current exercise names
- [src/workouts/intermediate.js](src/workouts/intermediate.js) — intermediate program data (3 lifts + Minimum Dose + Zone 2)
- [src/workouts/shared.js](src/workouts/shared.js) — weekly plan (Mon–Sun with BJJ, lift and recovery) and the recovery menu used by both levels
- [src/workouts/advanced.js](src/workouts/advanced.js) — advanced program data (same layout, more volume)

The two `.jsx` files at the repo root are the original single-file versions. The React project consumes the extracted data; if you tweak a program, edit the file under `src/workouts/`.

## Data shape

Each program exports:

```js
{
  id, name, shortName, totalWeeks, deloadWeek, tagline, description,
  days: [{ id, label, emoji, color, colorDim, warmup, optional?, tag?, exercises: [{
    name, sets, reps, note, spine,
    pair?,        // superset label, e.g. "A1"/"A2"
    rest?,        // display text, e.g. "90s"
    cond?,        // conditioning item: ignores deload/readiness set scaling
    noScale?,     // never scaled (Minimum Dose)
    log?,         // input placeholder instead of "lbs / kg", e.g. "RPE / notes"
    bjj?,         // one line on what the exercise does for jiu jitsu; shown as "FOR BJJ"
    progression?  // declarative weekly plan, see below
  }] }],
  week: [{ day, bjj?: [text], lift?: { id, time }, extras?: [text], recovery: [text], tip }],  // Mon..Sun, shared via src/workouts/shared.js
  recovery: [{ name, when, steps: [text], caution }],                                          // recovery menu, also in shared.js
  why: [[title, detail], ...],
  schedules: [{ title, rows: [[day, text], ...] }],
  rules: [[title, detail], ...]
}
```

`progression` is data, not code, and is resolved in `engine.js`:
- `{ type: "intervals", hard, easy, table }` — `table[week]` is `[rounds, workSeconds, restSeconds]` (index 0 is `null`). Rounds scale with readiness and drive the timer.
- `{ type: "emom", moves, table }` — `table[week]` is the number of cycles; one cycle is one minute per entry in `moves`. Cycles scale with readiness.
- `{ type: "amrap", label, minutes }` — `minutes[week]` for a single countdown block; scales with readiness (minimum 3 min). Log rounds completed in the one set row.
- `{ type: "steady", label, minutes }` — `minutes[week]` for a single steady-state block.

`spine: true` flags exercises that load the lumbar — surfaces the 🦴 marker in the UI. The L4/L5 warning is rendered from this flag.

## Training model

Three short lifts per week stacked around BJJ: A heavy (pull + hip drive, ends with a pull/grip EMOM), B moderate (push + single-leg, ends with a squat/push AMRAP), C light (grip, neck, hips, ends with heavy-bag rounds). Every exercise carries a `bjj` line so the program stays tied to what the sport needs. `Minimum Dose` (M) is the bad-week swap for C, and `Zone 2 Walk` (D) is optional recovery cardio. The week-4 deload cuts non-conditioning sets ~40%. The "Today I feel" buttons (Fresh / Tired / Gassed) scale sets and rounds for that day only; readiness resets when the date changes.

## Logged-set storage

`data` is a flat dict keyed by `${level}|w${week}|${dayId}|${exerciseName}|${setIndex}` → `{ w: weight, d: done }`. Including `level` in the key means switching programs preserves logs for both. Persisted to `localStorage` under `bjj.v1` along with the active level, week, readiness, and a `schema` number.

Keys depend on exercise and day names, so renaming either orphans its history. If you rename, add a mapping to `src/migrations.js` and bump `SCHEMA` in `App.jsx`. Migration copies keys and never deletes the old ones.

## Conventions

- Programs are pure data (no functions). The UI never hardcodes day/exercise names.
- Day order is stable (A → B → C → M → D). Adding/removing days is fine; the UI adapts. Adding a new program means a new file in `src/workouts/` plus an entry in the `PROGRAMS` map and `LEVELS` array.
- Day colors are a deliberate visual code (Pull=blue, Lower=green, Press=purple, Conditioning/Zone 2=orange). Keep them consistent across programs. Minimum Dose uses gold.
- Don't refactor the inline-style approach — it's intentional for the embedded `<style>` deployment use case.

## Running

```bash
npm install
npm run dev
```
