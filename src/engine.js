// Pure helpers that turn program data into a week- and readiness-specific session.
// Programs stay data-only; anything that depends on week or how you feel is resolved here.

export const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Daily readiness scales volume (k) so a rough day shrinks the session instead of skipping it
export const READY = [
  { id: "fresh", label: "Fresh", k: 1, color: "#14532D", hint: "Full session as written." },
  { id: "tired", label: "Tired", k: 0.75, color: "#78350F", hint: "About a third fewer sets and a quarter fewer rounds. Same weights, stop 2 reps short of failure." },
  { id: "gassed", label: "Gassed", k: 0.5, color: "#7F1D1D", hint: "Roughly 35–40% fewer sets, half the rounds, stop 3 reps short. Or swap in Minimum Dose or the Zone 2 walk. Showing up small still counts." },
];

export const sc = (n, k) => Math.max(1, Math.round(n * k));

export function phaseOf(w, deloadWeek, totalWeeks) {
  if (w === deloadWeek) return { name: "DELOAD", color: "#38BDF8", desc: "Strength sets cut ~40%, intervals shortened. Leave every session feeling fresh." };
  if (w === totalWeeks) return { name: "TEST WEEK", color: "#F59E0B", desc: "Hit your best numbers. Compare to Week 1 — everything should feel easier." };
  if (w < deloadWeek) return { name: "BUILD", color: "#22C55E", desc: "Establish loads and a base. Stop every set with 1–2 reps in the tank." };
  return { name: "BUILD +", color: "#A855F7", desc: "Longer intervals, shorter rests. Add weight or reps wherever form stays clean." };
}

// Week- and readiness-specific version of an exercise.
// `progression` (intervals | steady) is declarative data; everything else scales by sets.
export function resolveExercise(e, w, k = 1, deloadWeek = 4) {
  const r = { ...e };
  const p = e.progression;
  if (p?.type === "intervals") {
    const [rounds, work, rest] = p.table[w];
    r.sets = sc(rounds, k);
    r.reps = `${fmt(work)} hard / ${fmt(rest)} rest`;
  } else if (p?.type === "emom") {
    // table[week] = cycles; one cycle = one minute per move
    r.sets = sc(p.table[w], k);
    r.reps = `${r.sets * p.moves.length} min EMOM`;
  } else if (p?.type === "amrap") {
    r.sets = 1;
    r.reps = `${Math.max(3, Math.round(p.minutes[w] * k))} min AMRAP`;
  } else if (p?.type === "steady") {
    r.sets = 1;
    r.reps = `${p.minutes[w]} min`;
  } else if (!e.cond && !e.noScale) {
    const f = (w === deloadWeek ? 0.6 : 1) * k;
    if (f < 1) r.sets = Math.max(2, Math.round(e.sets * f));
  }
  return r;
}

// Timer segments for a resolved exercise, or null if it has no timer.
// Each segment: { label, secs, kind: "work" | "rest", round, done? } — `done` marks that set when the segment ends.
export function buildSegments(e, w) {
  const p = e.progression;
  if (p?.type === "intervals") {
    const [, work, rest] = p.table[w];
    const out = [];
    for (let r = 0; r < e.sets; r++) {
      out.push({ label: p.hard, secs: work, kind: "work", round: r, done: r });
      if (r < e.sets - 1) out.push({ label: p.easy, secs: rest, kind: "rest", round: r });
    }
    return out;
  }
  if (p?.type === "emom") {
    const out = [];
    for (let r = 0; r < e.sets; r++) {
      p.moves.forEach((m, i) => {
        out.push({ label: m, secs: 60, kind: "work", round: r, done: i === p.moves.length - 1 ? r : undefined });
      });
    }
    return out;
  }
  if (p?.type === "amrap") {
    const mins = parseInt(e.reps, 10);
    return [{ label: p.label, secs: mins * 60, kind: "work", round: 0, done: 0 }];
  }
  if (p?.type === "steady") {
    return [{ label: p.label, secs: p.minutes[w] * 60, kind: "work", round: 0, done: 0 }];
  }
  return null;
}
