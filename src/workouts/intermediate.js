const intermediate = {
  id: "intermediate",
  name: "Intermediate",
  shortName: "INT",
  totalWeeks: 8,
  tagline: "INTERMEDIATE · BJJ",
  description: "Intermediate · BJJ Functional Strength · F22 + Bowflex 1090",
  days: [
    {
      id: "A", label: "Pull + Biceps", emoji: "💪",
      color: "#2563EB", colorDim: "#1D3B8A22",
      warmup: "Band pull-aparts 2×15, dead hang 2×20s, cat-cow 10 reps",
      exercises: [
        { name: "Pull-Ups", sets: 3, reps: "8", note: "Add band for assistance if needed. Full hang at bottom.", spine: false },
        { name: "Single-Arm DB Row", sets: 3, reps: "10 ea.", note: "Brace on bench, neutral spine. Drive elbow to hip.", spine: false },
        { name: "Cable Face Pull", sets: 3, reps: "15", note: "F22 high cable. Thumbs to ears, externally rotate.", spine: false },
        { name: "Hammer Curl", sets: 3, reps: "12", note: "Neutral grip (thumbs up). Control the eccentric.", spine: false },
        { name: "Dead Bug", sets: 3, reps: "8 ea.", note: "Press lower back INTO floor the entire time.", spine: true },
        { name: "Pallof Press", sets: 3, reps: "12 ea.", note: "F22 mid-cable. Resist rotation — don't twist.", spine: true },
      ],
    },
    {
      id: "B", label: "Lower + Hinge", emoji: "🦵",
      color: "#16A34A", colorDim: "#14532D22",
      warmup: "Hip circles 2×10, glute bridges 2×15, banded clams 2×15",
      exercises: [
        { name: "Goblet Squat", sets: 3, reps: "12", note: "One dumbbell at chest. Push knees out, upright torso.", spine: false },
        { name: "DB Romanian Deadlift", sets: 3, reps: "10", note: "Hinge at hips, soft knees, neutral spine. Feel the stretch.", spine: true },
        { name: "Bulgarian Split Squat", sets: 3, reps: "8 ea.", note: "Rear foot elevated. Keep torso upright.", spine: true },
        { name: "Cable Pull-Through", sets: 3, reps: "15", note: "F22 low cable between legs. Squeeze glutes hard at top.", spine: true },
        { name: "McGill Side Plank", sets: 3, reps: "30s ea.", note: "Elbow under shoulder, body straight. McGill Big 3.", spine: true },
        { name: "Bird Dog", sets: 3, reps: "8 ea.", note: "Hold 2s at top. Zero hip rotation. McGill Big 3.", spine: true },
      ],
    },
    {
      id: "C", label: "Press + Triceps", emoji: "🏋️",
      color: "#7C3AED", colorDim: "#4C1D9522",
      warmup: "Thoracic rotations 2×10, shoulder circles, wrist prep",
      exercises: [
        { name: "DB Floor Press", sets: 3, reps: "10", note: "Elbows at 45°. Safer for shoulders than bench.", spine: false },
        { name: "Seated DB Overhead Press", sets: 3, reps: "10", note: "Back supported. Don't flare elbows. Control descent.", spine: false },
        { name: "Cable Woodchop (High→Low)", sets: 3, reps: "12 ea.", note: "F22 high cable. Rotate from hip, not just arms.", spine: true },
        { name: "Tricep Pushdown", sets: 3, reps: "15", note: "F22 high cable, rope attachment. Elbows pinned.", spine: false },
        { name: "Lateral Raise", sets: 3, reps: "15", note: "Slight forward tilt. Keep traps out of it.", spine: false },
        { name: "McGill Curl-Up", sets: 3, reps: "8", note: "Hands under lumbar. Lift only head & shoulders.", spine: true },
      ],
    },
    {
      id: "D", label: "Accessory", emoji: "🔄",
      color: "#EA580C", colorDim: "#7C2D1222",
      optional: true,
      warmup: "Light movement, foam roll hips and thoracic spine",
      exercises: [
        { name: "Farmer's Carry", sets: 3, reps: "30 yd", note: "Heavy dumbbells, tall posture. Try single-arm too.", spine: true },
        { name: "Zottman Curl", sets: 3, reps: "10", note: "Curl up supinated, rotate to pronated, lower slow.", spine: false },
        { name: "Neck Work", sets: 3, reps: "12 ea.", note: "Manual resistance all 4 directions. Light & controlled.", spine: false },
        { name: "Hip Flexor Stretch", sets: 2, reps: "45s ea.", note: "Tight hip flexors increase L4/L5 stress — key for BJJ.", spine: true },
        { name: "Hollow Body Hold", sets: 3, reps: "20s", note: "Compress lower back into floor the whole time.", spine: true },
      ],
    },
  ],
  rules: [
    ["Rest between sets", "90s compound lifts · 60s accessories"],
    ["Deload every 4–6 wks", "Cut volume 40% — you're also doing BJJ 3–4×"],
    ["Progress weekly", "Add reps or a little weight each session"],
    ["Neutral spine first", "Reduce weight before compromising form"],
  ],
};

export default intermediate;
