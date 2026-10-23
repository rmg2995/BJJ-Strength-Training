// INTERMEDIATE program: 3 short lifts a week built to carry over to BJJ, stacked around 3–4 classes.
import { week, recovery } from "./shared";

// Pure data. Week- and readiness-dependent values are resolved in src/engine.js
// from each exercise's optional `progression` (intervals | emom | amrap | steady).
const intermediate = {
  id: "intermediate",
  name: "Intermediate",
  shortName: "INT",
  totalWeeks: 8,
  deloadWeek: 4,
  tagline: "INTERMEDIATE · BJJ",
  description: "INTERMEDIATE · 3 short lifts a week built for BJJ · F22 + Bowflex 1090 + heavy bag",
  days: [
    {
      id: "A", label: "Heavy: Pull + Hip Drive", emoji: "💪",
      color: "#2563EB", colorDim: "#1D3B8A22",
      warmup: "Band pull-aparts 2×15, dead hang 2×20s, glute bridges 2×12, then 2 ramp-up pull-up sets",
      exercises: [
        { pair: "A1", name: "Pull-Ups", sets: 3, reps: "6–8", rest: "90s", note: "HEAVY DAY. F22 pull-up bar. Use a band for assistance if needed. Full ROM. Alternate with A2.", bjj: "Back and lat strength for pulling guard, winning grips and taking the back.", spine: false },
        { pair: "A2", name: "Dead Bug", sets: 3, reps: "8 ea.", rest: "90s", note: "Press lower back INTO floor throughout. No lumbar arch. Do while your lats recover.", bjj: "Core control so you keep your frame when someone heavy is on top of you.", spine: true },
        { pair: "B1", name: "DB Romanian Deadlift", sets: 3, reps: "10", rest: "75s", note: "Hinge at hips, soft knee, neutral spine. Feel hamstring stretch at bottom.", bjj: "Hip power for bridging out of mount and driving through passes.", spine: true },
        { pair: "B2", name: "Single-Arm DB Row", sets: 3, reps: "8 ea.", rest: "75s", note: "Brace on bench, neutral spine. Drive elbow to hip.", bjj: "One-arm pulling strength for sleeve and collar control.", spine: false },
        { pair: "C1", name: "DB Hip Thrust", sets: 3, reps: "10", rest: "60s", note: "Upper back on a bench, dumbbell on hips, chin tucked. Drive through the heels, squeeze glutes at the top, ribs down.", bjj: "Explosive hip extension for bridges, upa escapes and sweeps.", spine: true },
        { pair: "C2", name: "Cable Face Pulls", sets: 2, reps: "15", rest: "60s", note: "F22 high cable. Thumbs to ears, externally rotate.", bjj: "Shoulder health from all the pulling and posting.", spine: false },
        {
          name: "Finisher: Pull + Grip EMOM", sets: 3, reps: "6 min EMOM", rest: "built in", cond: true, log: "reps done / notes",
          note: "Odd minutes: 4 pull-ups (use a band if needed). Even minutes: 20 second towel hang. Whatever is left of each minute is your rest. Stop if form breaks.",
          bjj: "Builds pulling and grip endurance so your lats and forearms don't fade by round 4.",
          spine: false,
          progression: {
            type: "emom",
            moves: ["4 pull-ups (band if needed)", "20s towel hang"],
            table: [null, 2, 3, 3, 2, 3, 3, 4, 3], // week → cycles (one cycle = one minute per move)
          },
        },
      ],
    },
    {
      id: "B", label: "Moderate: Push + Single-Leg", emoji: "🦵",
      color: "#16A34A", colorDim: "#14532D22",
      warmup: "Hip circles 2×10, glute bridges 2×15, thoracic rotations 2×10, 1 light floor-press set",
      exercises: [
        { pair: "A1", name: "DB Floor Press", sets: 3, reps: "10", rest: "75s", note: "MODERATE DAY. Lie on floor, elbows at 45°. Limits shoulder over-extension.", bjj: "Pressing strength for frames, stiff arms and posting.", spine: false },
        { pair: "A2", name: "Bird Dog", sets: 3, reps: "8 ea.", rest: "75s", note: "Extend opposite arm/leg. Hold 2s at top. No hip rotation.", bjj: "Spine stability while your limbs are moving, like during a scramble.", spine: true },
        { pair: "B1", name: "Bulgarian Split Squat", sets: 3, reps: "8 ea.", rest: "75s", note: "Rear foot elevated. Hold dumbbells. Keep torso upright.", bjj: "Single-leg strength for standing up in base, passing and wrestling.", spine: true },
        { pair: "B2", name: "Landmine Press", sets: 3, reps: "10 ea.", rest: "75s", note: "Wedge barbell in F22 corner. Single arm, press at angle.", bjj: "Angled pressing for posting and getting back to your feet.", spine: false },
        { pair: "C1", name: "Cable Woodchop (High→Low)", sets: 2, reps: "10 ea.", rest: "45s", note: "F22 high cable. Rotate from hip, not just arms.", bjj: "Rotational power for sweeps, hip escapes and takedowns.", spine: true },
        { pair: "C2", name: "McGill Side Plank", sets: 2, reps: "30s ea.", rest: "45s", note: "Elbow under shoulder, body straight. One of the McGill Big 3.", bjj: "Side-body strength for bridging and defending when you're turned.", spine: true },
        {
          name: "Finisher: Squat + Push AMRAP", sets: 1, reps: "6 min AMRAP", rest: "—", cond: true, log: "rounds done",
          note: "Light dumbbell goblet squats, then push-ups (knees down if needed). Repeat as many rounds as you can. Count your rounds and log them. Pace round 1 at about 70% so your last round isn't a crawl. Hands-on-knees rests are fine.",
          bjj: "Leg and pushing endurance for scrambles and guard retention while tired.",
          spine: false,
          progression: {
            type: "amrap",
            label: "AMRAP: 6 goblet squats + 6 push-ups, repeat",
            minutes: [null, 5, 5, 6, 4, 6, 6, 7, 6], // week → minutes
          },
        },
      ],
    },
    {
      id: "C", label: "Light: Full Body + Grip", emoji: "🪶",
      color: "#7C3AED", colorDim: "#4C1D9522",
      warmup: "Hip circles 2×10, band pull-aparts 2×15, 1 light goblet squat set",
      exercises: [
        { pair: "A1", name: "Goblet Squat", sets: 3, reps: "10", rest: "60s", note: "LIGHT DAY. About RPE 6 — leave ~4 reps in the tank and move it fast. One dumbbell at chest, knees out, upright torso.", bjj: "Squat pattern and leg endurance for guard play and technical stand-ups.", spine: false },
        { pair: "A2", name: "Pallof Press", sets: 3, reps: "12 ea.", rest: "60s", note: "F22 mid-cable, perpendicular stance. Resist rotation, don't twist.", bjj: "Resisting rotation so you don't get swept or rolled.", spine: true },
        { pair: "B1", name: "Cable Low Row", sets: 3, reps: "12", rest: "60s", note: "F22 low cable, seated. Pull FAST, release slowly, pause at chest.", bjj: "Pulling speed for grip breaks and snapping a collar tie.", spine: false },
        { pair: "B2", name: "McGill Curl-Up", sets: 3, reps: "8", rest: "60s", note: "Hands under lumbar. Lift only head & shoulders. Spine neutral.", bjj: "Core endurance for hip-ups and guard retention.", spine: true },
        { name: "Neck Work (Manual / Harness)", sets: 2, reps: "15 ea.", rest: "30s", note: "All 4 directions. Light resistance. Strong neck = less fatigue holding posture in rounds.", bjj: "Neck strength for posture, takedown defense and avoiding strain.", spine: false },
        { name: "Hip 90/90 Flow", sets: 2, reps: "8 ea.", rest: "—", cond: true, note: "Sit in 90/90, switch sides without using your hands if you can. Slow and controlled.", bjj: "Hip mobility for guard retention and passing fluency.", spine: true },
        { name: "Towel Hang + Carry", sets: 3, reps: "20s + 30 yd", rest: "45s", cond: true, note: "Hang from a towel over the bar, then farmer's carry right away. Grip endurance is what fades first in round 4.", bjj: "Grip and forearm endurance for gi grips. Placed before no-gi Friday on purpose.", spine: true },
        {
          name: "Heavy Bag Finisher", sets: 2, reps: "2:00 hard / 1:00 rest", rest: "built in", cond: true, log: "RPE / notes",
          note: "Cross-hook-knee combos, a level-change shot into the bag, sprawl off it. Hard = RPE 7–8. Skip it when you're Gassed — the timer shrinks it for you.",
          bjj: "Aerobic power and rhythm for shots, sprawls and scrambles.",
          spine: true,
          progression: {
            type: "intervals", hard: "BAG — work", easy: "Rest — nasal breathing",
            table: [null, [2, 90, 60], [2, 120, 60], [3, 90, 60], [2, 90, 60], [3, 120, 60], [3, 120, 60], [3, 150, 60], [3, 150, 60]], // week → [rounds, work s, rest s]
          },
        },
      ],
    },
    {
      id: "M", label: "Minimum Dose (15 min)", emoji: "⏱️",
      color: "#CA8A04", colorDim: "#71350F22",
      optional: true, tag: "swap for Day C",
      warmup: "2 min of easy movement. Work as a circuit: A1, A2, then B1, B2, minimal rest.",
      exercises: [
        { pair: "A1", name: "Pull-Ups (Min)", noScale: true, sets: 2, reps: "5", rest: "45s", note: "Same movement as Day A, just two crisp sets. Stop 2 reps short.", bjj: "Keeps your pulling strength alive on a bad week.", spine: false },
        { pair: "A2", name: "DB Floor Press (Min)", noScale: true, sets: 2, reps: "8", rest: "45s", note: "Same as Day B. Controlled, no grinding.", bjj: "Keeps your pressing strength alive on a bad week.", spine: false },
        { pair: "B1", name: "DB Romanian Deadlift (Min)", noScale: true, sets: 2, reps: "8", rest: "45s", note: "Moderate load. Neutral spine, hinge from the hips.", bjj: "Keeps hip power ticking over.", spine: true },
        { pair: "B2", name: "McGill Curl-Up (Min)", noScale: true, sets: 2, reps: "8", rest: "30s", note: "Hands under lumbar. Lift only head & shoulders. Spine neutral.", bjj: "Keeps core endurance ticking over.", spine: true },
      ],
    },
    {
      id: "D", label: "Zone 2 Walk", emoji: "🫁",
      color: "#EA580C", colorDim: "#7C2D1222",
      optional: true, tag: "recovery cardio",
      warmup: "3 min of easy walking. This day should feel almost too easy.",
      exercises: [
        {
          name: "Zone 2 Treadmill Walk", sets: 1, reps: "25 min", rest: "—", cond: true, log: "avg HR / mph",
          note: "Brisk walk (about 3–4 mph, add incline if yours has it). Full sentences, nasal breathing. Too easy? Add a loaded backpack rather than speed. Let go of the rails. This helps recovery, so it's a fine swap on a Gassed day.",
          bjj: "Builds the aerobic base that recovers you between hard exchanges.",
          spine: false,
          progression: {
            type: "steady", label: "Zone 2 — nasal breathing, full sentences",
            minutes: [null, 20, 20, 25, 15, 25, 30, 30, 25], // week → minutes
          },
        },
        { name: "Hip Flexor Stretch + 90/90", sets: 2, reps: "60s ea.", rest: "—", cond: true, note: "Tight hip flexors increase L4/L5 stress — essential for BJJ athletes.", bjj: "Open hips for guard and a happier lower back.", spine: true },
        { name: "Thoracic Foam Roll", sets: 1, reps: "2–3 min", rest: "—", cond: true, note: "Upper and mid back only. Avoid rolling the lumbar region.", bjj: "Upper-back mobility for posture and shoulder health.", spine: true },
      ],
    },
  ],
  why: [
    ["Every lift has a BJJ job", "Each exercise shows a 'For BJJ' line: pulling for grips, hips for bridging, single-leg for base, rotation for sweeps, neck and core for staying safe."],
    ["Heavy Saturday, light before Friday", "Saturday has 48 h of recovery before Monday's class, so it takes the heavy day. Thursday is the lightest session, ahead of Friday's 7 am class."],
    ["Short timed finishers on every day", "A has a pull and grip EMOM, B has a squat and push AMRAP, C has the bag. About 6 minutes each, built to train the fading-in-round-4 problem."],
    ["Day C is the shock absorber", "It's the light day, built to be trimmed. When you're Tired or Gassed everything shrinks, or you swap it for Minimum Dose, and you still hit 3 days."],
  ],
  week,
  recovery,
  schedules: [
    {
      title: "IF YOUR WEEK GETS DISRUPTED",
      rows: [
        ["Miss Tue", "Do Minimum Dose on Tue evening (5:30 pm), or move Day B to Thursday and drop Day C that week."],
        ["Miss Thu", "Swap Day C for Minimum Dose (15 min) or move it to Sunday if you skip basketball."],
        ["Miss Sat", "Do Day A on Sunday morning, and skip basketball that week."],
        ["Feeling flat", "Tap Tired or Gassed. Keep the day, shrink the session."],
      ],
    },
  ],
  rules: [
    ["Keep every lift to about 35–45 minutes", "Supersets, short rests, no phone scrolling. If it creeps past 50 minutes, cut sets or skip the finisher, not the day."],
    ["Grip work goes before no-gi, not gi", "Towel hang and carries sit on Thursday (before no-gi Friday). Saturday's pulls have 48 h to recover before gi Monday. Avoid extra grip work on Tuesday."],
    ["Never lift hard the day before class", "Heavy on Saturday, moderate on Tuesday, light on Thursday. If Tuesday's legs are sore on Wednesday, drop a set of split squats."],
    ["Pace the finishers", "Round 1 of an AMRAP should feel like 70%. You're building capacity for round 4, not setting a record."],
    ["Trim Day C first", "Feeling flat? Tap Tired or Gassed, or swap Day C for Minimum Dose. That still counts as your third day. Skip the Thursday evening class before you skip the lift."],
    ["Recover on purpose", "Aim for 7.5+ h sleep. 7 am class means eating something light first, then protein and carbs afterward. Keep Sunday basketball easy."],
    ["Deload in Week 4", "Volume drops ~40%. Otherwise progress weekly: add weight or reps when it feels easy."],
    ["Neutral spine first", "Reduce weight before compromising form on any 🦴 exercise. Stop if your leg tingles."],
  ],
};

export default intermediate;
