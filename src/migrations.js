// One-time migration of logged sets from the previous program layout (Gas Tank rewrite)
// to the 3-lift layout. Copies — never deletes — so old keys stay in storage untouched.
//
// Key format: `${level}|w${week}|${dayId}|${exerciseName}|${setIndex}`
// Old exercises with no counterpart in the new programs (curls, lateral raises, etc.)
// are simply left where they are and no longer shown.

// old day id → { old exercise name → [new day id, new exercise name] }
const COMMON = {
  A: {
    "Single-Arm DB Row": ["A", "Single-Arm DB Row"],
    "Heavy DB Row (Pause)": ["A", "Single-Arm DB Row"],
    "Cable Face Pull": ["A", "Cable Face Pulls"],
    "Dead Bug": ["A", "Dead Bug"],
    "Dead Bug + Band": ["A", "Dead Bug"],
    "Pallof Press": ["C", "Pallof Press"],
    "Pallof Press Iso-Hold": ["C", "Pallof Press"],
  },
  B: {
    "DB Romanian Deadlift": ["A", "DB Romanian Deadlift"],
    "DB Romanian Deadlift (Heavy)": ["A", "DB Romanian Deadlift"],
    "Bulgarian Split Squat": ["B", "Bulgarian Split Squat"],
    "Front-Foot Elevated Split Squat": ["B", "Bulgarian Split Squat"],
    "Goblet Squat": ["C", "Goblet Squat"],
    "Goblet Squat (Pause)": ["C", "Goblet Squat"],
    "Cable Pull-Through": ["B", "Cable Pull-Through"],
    "Cable Pull-Through (Heavy)": ["B", "Cable Pull-Through"],
    "McGill Side Plank": ["A", "McGill Side Plank"],
    "McGill Side Plank (Weighted)": ["A", "McGill Side Plank"],
    "Bird Dog": ["B", "Bird Dog"],
    "Bird Dog (Slow)": ["B", "Bird Dog"],
  },
  C: {
    "DB Floor Press": ["B", "DB Floor Press"],
    "DB Floor Press (Heavy)": ["B", "DB Floor Press"],
    "Cable Woodchop (High→Low)": ["B", "Cable Woodchop (High→Low)"],
    "McGill Curl-Up": ["C", "McGill Curl-Up"],
    "McGill Curl-Up (Tempo)": ["C", "McGill Curl-Up"],
  },
  D: {
    "Neck Work": ["C", "Neck Work (Manual / Harness)"],
    "Weighted Neck Work": ["C", "Neck Work (Manual / Harness)"],
    "Neck Isometric": ["C", "Neck Work (Manual / Harness)"],
  },
};

const PER_LEVEL = {
  intermediate: { A: { ...COMMON.A, "Pull-Up": ["A", "Pull-Ups"] }, B: COMMON.B, C: COMMON.C, D: COMMON.D },
  advanced: { A: { ...COMMON.A, "Weighted Pull-Up": ["A", "Weighted Pull-Ups"] }, B: COMMON.B, C: COMMON.C, D: COMMON.D },
};

export function migrateLogs(data) {
  const out = { ...data };
  for (const key of Object.keys(data)) {
    const [level, week, dayId, ...rest] = key.split("|");
    const setIdx = rest.pop();
    const name = rest.join("|");
    const target = PER_LEVEL[level]?.[dayId]?.[name];
    if (!target) continue;
    const newKey = [level, week, target[0], target[1], setIdx].join("|");
    if (!(newKey in out)) out[newKey] = data[key];
  }
  return out;
}
