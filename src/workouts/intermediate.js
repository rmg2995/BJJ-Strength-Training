// INTERMEDIATE program: 3 short lifts a week, stacked around BJJ 3–4×.
// Pure data. Week- and readiness-dependent values are resolved in src/engine.js
// from each exercise's optional `progression` ({ type: "intervals" | "steady", ... }).
const intermediate = {
  id: "intermediate",
  name: "Intermediate",
  shortName: "INT",
  totalWeeks: 8,
  deloadWeek: 4,
  tagline: "INTERMEDIATE · BJJ",
  description: "INTERMEDIATE · 3 short lifts a week · stacked on BJJ days · F22 + Bowflex 1090 + heavy bag",
  days: [
    {
      id: "A", label: "Heavy: Pull + Hinge", emoji: "💪",
      color: "#2563EB", colorDim: "#1D3B8A22",
      warmup: "Band pull-aparts 2×15, dead hang 2×20s, cat-cow 10, then 2 ramp-up sets",
      exercises: [
        { pair: "A1", name: "Pull-Ups", sets: 3, reps: "6–8", rest: "90s", note: "HEAVY DAY. F22 pull-up bar. Use a band for assistance if needed. Full ROM. Alternate with A2.", spine: false },
        { pair: "A2", name: "Dead Bug", sets: 3, reps: "8 ea.", rest: "90s", note: "Press lower back INTO floor throughout. No lumbar arch. Do while your lats recover.", spine: true },
        { pair: "B1", name: "DB Romanian Deadlift", sets: 3, reps: "10", rest: "75s", note: "Hinge at hips, soft knee, neutral spine. Feel hamstring stretch at bottom.", spine: true },
        { pair: "B2", name: "Single-Arm DB Row", sets: 3, reps: "8 ea.", rest: "75s", note: "Brace on bench, neutral spine. Drive elbow to hip.", spine: false },
        { pair: "C1", name: "Cable Face Pulls", sets: 2, reps: "15", rest: "45s", note: "F22 high cable. Thumbs to ears, externally rotate.", spine: false },
        { pair: "C2", name: "McGill Side Plank", sets: 2, reps: "30s ea.", rest: "45s", note: "Elbow under shoulder, body straight. One of the McGill Big 3.", spine: true },
      ],
    },
    {
      id: "B", label: "Moderate: Press + Single-Leg", emoji: "🦵",
      color: "#16A34A", colorDim: "#14532D22",
      warmup: "Hip circles 2×10, glute bridges 2×15, thoracic rotations 2×10, 1 light floor-press set",
      exercises: [
        { pair: "A1", name: "DB Floor Press", sets: 3, reps: "10", rest: "75s", note: "MODERATE DAY. Lie on floor, elbows at 45°. Limits shoulder over-extension.", spine: false },
        { pair: "A2", name: "Bird Dog", sets: 3, reps: "8 ea.", rest: "75s", note: "Extend opposite arm/leg. Hold 2s at top. No hip rotation.", spine: true },
        { pair: "B1", name: "Bulgarian Split Squat", sets: 3, reps: "8 ea.", rest: "75s", note: "Rear foot elevated. Hold dumbbells. Keep torso upright.", spine: true },
        { pair: "B2", name: "Landmine Press", sets: 3, reps: "10 ea.", rest: "75s", note: "Wedge barbell in F22 corner. Single arm, press at angle.", spine: false },
        { pair: "C1", name: "Cable Pull-Through", sets: 2, reps: "12", rest: "45s", note: "F22 low cable between legs. Hip hinge, squeeze glutes at top.", spine: true },
        { pair: "C2", name: "Cable Woodchop (High→Low)", sets: 2, reps: "10 ea.", rest: "45s", note: "F22 high cable. Rotate from hip, not just arms.", spine: true },
      ],
    },
    {
      id: "C", label: "Light: Full Body + Grip", emoji: "🪶",
      color: "#7C3AED", colorDim: "#4C1D9522",
      warmup: "Hip circles 2×10, band pull-aparts 2×15, 1 light goblet squat set",
      exercises: [
        { pair: "A1", name: "Goblet Squat", sets: 3, reps: "10", rest: "60s", note: "LIGHT DAY. About RPE 6 — leave ~4 reps in the tank and move it fast. One dumbbell at chest, knees out, upright torso.", spine: false },
        { pair: "A2", name: "Pallof Press", sets: 3, reps: "12 ea.", rest: "60s", note: "F22 mid-cable, perpendicular stance. Resist rotation, don't twist.", spine: true },
        { pair: "B1", name: "Cable Low Row", sets: 3, reps: "12", rest: "60s", note: "F22 low cable, seated. Retract scapula, pause at chest. Easy and smooth.", spine: false },
        { pair: "B2", name: "McGill Curl-Up", sets: 3, reps: "8", rest: "60s", note: "Hands under lumbar. Lift only head & shoulders. Spine neutral.", spine: true },
        { name: "Neck Work (Manual / Harness)", sets: 2, reps: "15 ea.", rest: "30s", note: "All 4 directions. Light resistance. Strong neck = less fatigue holding posture in rounds.", spine: false },
        { name: "Towel Hang + Carry", sets: 3, reps: "20s + 30 yd", rest: "45s", cond: true, note: "Hang from a towel over the bar, then farmer's carry right away. Grip endurance is what fades first in round 4.", spine: true },
        {
          name: "Heavy Bag Finisher", sets: 2, reps: "2:00 hard / 1:00 rest", rest: "built in", cond: true, log: "RPE / notes",
          note: "Cross-hook-knee combos, a level-change shot into the bag, sprawl off it. Hard = RPE 7–8. Skip it when you're Gassed — the timer shrinks it for you.",
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
        { pair: "A1", name: "Pull-Ups (Min)", noScale: true, sets: 2, reps: "5", rest: "45s", note: "Same movement as Day A, just two crisp sets. Stop 2 reps short.", spine: false },
        { pair: "A2", name: "DB Floor Press (Min)", noScale: true, sets: 2, reps: "8", rest: "45s", note: "Same as Day B. Controlled, no grinding.", spine: false },
        { pair: "B1", name: "DB Romanian Deadlift (Min)", noScale: true, sets: 2, reps: "8", rest: "45s", note: "Moderate load. Neutral spine, hinge from the hips.", spine: true },
        { pair: "B2", name: "McGill Curl-Up (Min)", noScale: true, sets: 2, reps: "8", rest: "30s", note: "Hands under lumbar. Lift only head & shoulders. Spine neutral.", spine: true },
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
          spine: false,
          progression: {
            type: "steady", label: "Zone 2 — nasal breathing, full sentences",
            minutes: [null, 20, 20, 25, 15, 25, 30, 30, 25], // week → minutes
          },
        },
        { name: "Hip Flexor Stretch + 90/90", sets: 2, reps: "60s ea.", rest: "—", cond: true, note: "Tight hip flexors increase L4/L5 stress — essential for BJJ athletes.", spine: true },
        { name: "Thoracic Foam Roll", sets: 1, reps: "2–3 min", rest: "—", cond: true, note: "Upper and mid back only. Avoid rolling the lumbar region.", spine: true },
      ],
    },
  ],
  why: [
    ["Three short sessions, not three long ones", "Each lift is about 35 minutes: one heavy, one moderate, one light. Less fatigue per session is what makes a third day sustainable."],
    ["Heavy on Saturday, light before Friday", "Saturday has 48 h of recovery before Monday's class, so it takes the heavy day. Thursday is the lightest session, ahead of Friday's 7 am class."],
    ["Day C is the shock absorber", "It's the light day, built to be trimmed. When you're Tired or Gassed it shrinks, or you swap it for Minimum Dose, and you still hit 3 days."],
    ["BJJ is your engine", "Class does most of the conditioning. The short bag finisher on Day C and an optional Zone 2 walk top it up."],
  ],
  schedules: [
    {
      title: "YOUR WEEK (BJJ MWF 7AM + OPTIONAL THU 7:30PM)",
      rows: [
        ["Mon", "BJJ (gi) 7–8 am. Nothing else."],
        ["Tue", "Day B (moderate), 8:00–8:45 am after drop-off. No grip work today: Wednesday is gi."],
        ["Wed", "BJJ (gi) 7–8 am. Busy day, no training."],
        ["Thu", "Day C (light), 8:00–8:45 am. The grip work lives here, since Friday is no-gi. Optional class 7:30 pm if you feel Fresh."],
        ["Fri", "BJJ (no-gi) 7–8 am. Expect a faster, more cardio-heavy class."],
        ["Sat", "Day A (heavy) at any time. Grip is fresh again by Monday's gi class."],
        ["Sun", "Easy basketball, or the Zone 2 walk (Day D) if you skip it."],
      ],
    },
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
    ["Keep every lift to about 35 minutes", "Supersets, short rests, no phone scrolling. If it creeps past 45 minutes, cut sets, not the day."],
    ["Grip work goes before no-gi, not gi", "Towel hang and carries sit on Thursday (before no-gi Friday). Saturday's pulls have 48 h to recover before gi Monday. Avoid extra grip work on Tuesday."],
    ["Never lift hard the day before class", "Heavy on Saturday, moderate on Tuesday, light on Thursday. If Tuesday's legs are sore on Wednesday, drop a set of split squats."],
    ["Trim Day C first", "Feeling flat? Tap Tired or Gassed, or swap Day C for Minimum Dose. That still counts as your third day. Skip the Thursday evening class before you skip the lift."],
    ["Only A is truly heavy", "A is heavy, B is moderate, C is light (leave ~4 reps in the tank). That wave is what makes 3 days recoverable."],
    ["Recover on purpose", "Aim for 7.5+ h sleep. 7 am class means eating something light first, then protein and carbs afterward. Keep Sunday basketball easy."],
    ["Deload in Week 4", "Volume drops ~40%. Otherwise progress weekly: add weight or reps when it feels easy."],
    ["Neutral spine first", "Reduce weight before compromising form on any 🦴 exercise. Stop if your leg tingles."],
  ],
};

export default intermediate;
