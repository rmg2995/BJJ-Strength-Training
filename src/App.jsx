import { useState, useEffect } from "react";
import WorkoutApp from "./WorkoutApp";
import intermediate from "./workouts/intermediate";
import advanced from "./workouts/advanced";
import { migrateLogs } from "./migrations";

const PROGRAMS = { intermediate, advanced };
const STORAGE_KEY = "bjj.v1";
const SCHEMA = 3; // 3 = BJJ-focused 3-lift layout; older saves get their logs copied across once

const today = () => new Date().toDateString();

function loadState() {
  const fallback = { level: "intermediate", data: {}, week: 1, ready: "fresh", schema: SCHEMA };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const data = parsed.data ?? fallback.data;
    return {
      level: parsed.level ?? fallback.level,
      data: parsed.schema >= SCHEMA ? data : migrateLogs(data),
      week: parsed.week ?? fallback.week,
      // readiness only holds for the day it was set
      ready: parsed.readyDate === today() ? (parsed.ready ?? "fresh") : "fresh",
      schema: SCHEMA,
    };
  } catch {
    return fallback;
  }
}

export default function App() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, readyDate: today() })); } catch {}
  }, [state]);

  return (
    <WorkoutApp
      level={state.level}
      program={PROGRAMS[state.level]}
      onLevelChange={l => setState(s => ({ ...s, level: l }))}
      data={state.data}
      setData={d => setState(s => ({ ...s, data: typeof d === "function" ? d(s.data) : d }))}
      week={state.week}
      setWeek={w => setState(s => ({ ...s, week: w }))}
      ready={state.ready}
      onReadyChange={r => setState(s => ({ ...s, ready: r }))}
    />
  );
}
