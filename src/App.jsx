import { useState, useEffect } from "react";
import WorkoutApp from "./WorkoutApp";
import intermediate from "./workouts/intermediate";
import advanced from "./workouts/advanced";

const PROGRAMS = { intermediate, advanced };
const STORAGE_KEY = "bjj.v1";

function loadState() {
  const fallback = { level: "intermediate", data: {}, week: 1 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      level: parsed.level ?? fallback.level,
      data: parsed.data ?? fallback.data,
      week: parsed.week ?? fallback.week,
    };
  } catch {
    return fallback;
  }
}

export default function App() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  return (
    <WorkoutApp
      level={state.level}
      program={PROGRAMS[state.level]}
      onLevelChange={l => setState(s => ({ ...s, level: l }))}
      data={state.data}
      setData={d => setState(s => ({ ...s, data: d }))}
      week={state.week}
      setWeek={w => setState(s => ({ ...s, week: w }))}
    />
  );
}
