import { useState } from "react";
import IntervalTimer from "./IntervalTimer";
import { READY, phaseOf, resolveExercise, buildSegments } from "./engine";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  body{background:#0C0C10;color:#EFEFEF;font-family:'Inter',sans-serif;overscroll-behavior:none}
  input[type=number]{-moz-appearance:textfield}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
  input::placeholder{color:#383838}
  button:active{opacity:0.75}
  ::-webkit-scrollbar{width:0}
`;

// key: level · week · day · exercise · set
const wk = (level, w, dId, eName, s) => `${level}|w${w}|${dId}|${eName}|${s}`;

// Sets scanned when reading history (covers any week-specific round count)
const MAX_SETS = 12;

const LEVELS = [
  { id: "intermediate", short: "INT" },
  { id: "advanced", short: "ADV" },
];

function ExerciseChart({ values, color, totalWeeks, currentWeek, large = false }) {
  const max = Math.max(...values, 1);
  const W = large ? 400 : 320;
  const H = large ? 240 : 90;
  const padX = large ? 28 : 16;
  const padTop = large ? 34 : 18;
  const padBottom = large ? 28 : 18;
  const valueFont = large ? 16 : 11;
  const weekFont = large ? 12 : 9;
  const [rBase, rCurrent] = large ? [5, 7] : [3.2, 4.5];
  const stroke = large ? 2.6 : 2;
  const xStep = totalWeeks > 1 ? (W - padX * 2) / (totalWeeks - 1) : 0;

  const points = values.map((v, i) => ({
    x: padX + i * xStep,
    y: v > 0 ? padTop + (H - padTop - padBottom) * (1 - v / max) : null,
    v,
    week: i + 1,
  }));

  const drawn = points.filter(p => p.y !== null);
  const path = drawn.length > 0
    ? drawn.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
    : null;
  const area = drawn.length > 1
    ? `${drawn.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")} L${drawn[drawn.length - 1].x},${H - padBottom} L${drawn[0].x},${H - padBottom} Z`
    : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={padX} y1={H - padBottom} x2={W - padX} y2={H - padBottom} stroke="#222" strokeWidth={large ? 1 : 0.6} />
      {area && <path d={area} fill={color} opacity="0.18" />}
      {path && <path d={path} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      {points.map(p => {
        const isCurrent = p.week === currentWeek;
        return (
          <g key={p.week}>
            {p.y !== null && (
              <>
                <circle cx={p.x} cy={p.y} r={isCurrent ? rCurrent : rBase}
                  fill={isCurrent ? "#fff" : color}
                  stroke={color} strokeWidth={large ? 2 : 1.4} />
                <text x={p.x} y={p.y - (large ? 12 : 7)} fill="#EFEFEF" fontSize={valueFont}
                  textAnchor="middle" fontFamily="Barlow Condensed, Inter, sans-serif" fontWeight="700">
                  {p.v}
                </text>
              </>
            )}
            <text x={p.x} y={H - (large ? 8 : 4)} fill={isCurrent ? "#EFEFEF" : "#555"}
              fontSize={weekFont} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={isCurrent ? 700 : 500}>
              W{p.week}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function WorkoutApp({ level, program, onLevelChange, data, setData, week, setWeek, ready, onReadyChange }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [tab, setTab] = useState("week");
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [selectedExName, setSelectedExName] = useState(null);

  const DAYS = program.days;
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon = 0
  // Weekday label for a day id, from the weekly plan ("Sat"); swap-in days have none
  const weekdayFor = id => (program.week || []).find(w => w.lift?.id === id || w.also === id)?.day;
  const TOTAL_WEEKS = program.totalWeeks;

  const safeDayIdx = Math.min(dayIdx, DAYS.length - 1);
  const day = DAYS[safeDayIdx];
  const safeExIdx = Math.min(exIdx, day.exercises.length - 1);

  const readiness = READY.find(r => r.id === ready) || READY[0];
  const k = readiness.k;
  const phase = phaseOf(week, program.deloadWeek, TOTAL_WEEKS);
  const resolve = (e, w, kk = 1) => resolveExercise(e, w, kk, program.deloadWeek);
  const exs = day.exercises.map(e => resolve(e, week, k));
  const ex = exs[safeExIdx];
  const isRounds = ["intervals", "emom"].includes(ex.progression?.type);

  const getW = (w, dId, eName, s) => data[wk(level, w, dId, eName, s)]?.w || "";
  const getD = (w, dId, eName, s) => data[wk(level, w, dId, eName, s)]?.d || false;
  const maxWeightForEx = (w, dId, eName) => {
    let max = 0;
    for (let s = 0; s < MAX_SETS; s++) {
      const v = parseFloat(getW(w, dId, eName, s));
      if (!isNaN(v) && v > max) max = v;
    }
    return max;
  };

  function togD(s) {
    const key = wk(level, week, day.id, ex.name, s);
    setData({ ...data, [key]: { ...data[key], d: !data[key]?.d } });
  }

  function markDone(s) {
    const key = wk(level, week, day.id, ex.name, s);
    setData(d => ({ ...d, [key]: { ...d[key], d: true } }));
  }

  function updateWeight(setIdx, val) {
    const key = wk(level, week, day.id, ex.name, setIdx);
    setData({ ...data, [key]: { ...data[key], w: val } });
  }

  function changeLevel(newLevel) {
    if (newLevel === level) return;
    setDayIdx(0);
    setExIdx(0);
    setShowWeekPicker(false);
    onLevelChange(newLevel);
  }

  const exDone = (w, d, e) => Array.from({ length: e.sets }, (_, i) => getD(w, d.id, e.name, i)).filter(Boolean).length;
  const dayStats = (d, w, kk = 1) => {
    const list = d.exercises.map(e => resolve(e, w, kk));
    return { total: list.reduce((a, e) => a + e.sets, 0), done: list.reduce((a, e) => a + exDone(w, d, e), 0) };
  };
  // Week totals only count the required lifts; optional days (Minimum Dose, Zone 2) are extras
  const weekStats = w => DAYS.filter(d => !d.optional).reduce((a, d) => {
    const st = dayStats(d, w);
    return { total: a.total + st.total, done: a.done + st.done };
  }, { total: 0, done: 0 });
  const weekHasLogs = w => Object.keys(data).some(key => key.startsWith(`${level}|w${w}|`) && data[key].d);

  const { total: totalSets, done: doneSets } = dayStats(day, week, k);
  const pct = totalSets ? Math.min(100, Math.round((doneSets / totalSets) * 100)) : 0;
  const exAllDone = exDone(week, day, ex) >= ex.sets;

  function switchDay(i) { setDayIdx(i); setExIdx(0); setSelectedExName(null); }

  // For Progress tab — fall back to first exercise of current day
  const progressEx = (selectedExName && day.exercises.find(e => e.name === selectedExName)) || day.exercises[0];

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100dvh", background: "#0C0C10", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>

        {tab === "workout" && (<>

          {/* ── Header ── */}
          <div style={{ padding: "16px 16px 0" }}>

            {/* Level toggle */}
            <div style={{ display: "flex", gap: 4, background: "#13131A", border: "1px solid #1C1C22", borderRadius: 99, padding: 3, marginBottom: 12, width: "fit-content" }}>
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => changeLevel(l.id)} style={{
                  padding: "5px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                  background: l.id === level ? day.color : "transparent",
                  color: l.id === level ? "#fff" : "#555",
                  fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, letterSpacing: 2,
                  transition: "background 0.2s",
                }}>{l.short}</button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#444", fontWeight: 600, marginBottom: 2 }}>{program.tagline}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>
                  {day.label.toUpperCase()}
                  {day.optional && <span style={{ marginLeft: 8, fontSize: 11, color: "#555", fontFamily: "'Inter'", fontWeight: 500 }}>{day.tag || "optional"}</span>}
                </div>
              </div>
              {/* Week stepper: ← W3 OF 8 → */}
              <div style={{ display: "flex", gap: 4, alignItems: "stretch" }}>
                <button
                  onClick={() => week > 1 && setWeek(week - 1)}
                  disabled={week === 1}
                  style={{
                    background: week === 1 ? "#13131A" : day.color + "11",
                    border: `1.5px solid ${week === 1 ? "#1C1C22" : day.color + "33"}`,
                    borderRadius: 10, padding: "0 10px",
                    cursor: week === 1 ? "default" : "pointer",
                    color: week === 1 ? "#2A2A2A" : day.color,
                    fontSize: 18, fontWeight: 700, lineHeight: 1,
                    display: "flex", alignItems: "center",
                  }}
                  aria-label="Previous week"
                >←</button>
                <button
                  onClick={() => setShowWeekPicker(!showWeekPicker)}
                  style={{
                    background: day.color + "22", border: `1.5px solid ${day.color}55`,
                    borderRadius: 10, padding: "6px 12px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center",
                  }}
                >
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 20, fontWeight: 800, color: day.color, lineHeight: 1 }}>W{week}</div>
                  <div style={{ fontSize: 9, color: day.color, opacity: 0.7, letterSpacing: 1, fontWeight: 600 }}>OF {TOTAL_WEEKS}</div>
                </button>
                <button
                  onClick={() => week < TOTAL_WEEKS && setWeek(week + 1)}
                  disabled={week === TOTAL_WEEKS}
                  style={{
                    background: week === TOTAL_WEEKS ? "#13131A" : day.color + "11",
                    border: `1.5px solid ${week === TOTAL_WEEKS ? "#1C1C22" : day.color + "33"}`,
                    borderRadius: 10, padding: "0 10px",
                    cursor: week === TOTAL_WEEKS ? "default" : "pointer",
                    color: week === TOTAL_WEEKS ? "#2A2A2A" : day.color,
                    fontSize: 18, fontWeight: 700, lineHeight: 1,
                    display: "flex", alignItems: "center",
                  }}
                  aria-label="Next week"
                >→</button>
              </div>
            </div>

            {/* Week picker dropdown */}
            {showWeekPicker && (
              <div style={{ background: "#16161E", border: "1px solid #2A2A38", borderRadius: 14, padding: "12px", marginBottom: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 8 }}>SELECT WEEK</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => {
                    const hasData = weekHasLogs(w);
                    return (
                      <button key={w} onClick={() => { setWeek(w); setShowWeekPicker(false); }} style={{
                        width: "calc(25% - 5px)", padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                        background: w === week ? day.color : hasData ? "#1A2A1A" : "#1C1C22",
                        color: w === week ? "#fff" : hasData ? "#22C55E" : "#555",
                        fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, letterSpacing: 1,
                      }}>W{w}{hasData && w !== week ? " ✓" : ""}</button>
                    );
                  })}
                </div>
                {week > 1 && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#555", textAlign: "center" }}>
                    Last week's weights shown in grey below each set
                  </div>
                )}
              </div>
            )}

            {/* Progress bar */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: phase.color, fontWeight: 700, letterSpacing: 1 }}>{phase.name}</span>
              <span style={{ fontSize: 10, color: pct === 100 ? "#22C55E" : day.color, fontWeight: 700 }}>{pct}% · {doneSets}/{totalSets} sets</span>
            </div>
            <div style={{ height: 3, background: "#1C1C22", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: day.color, borderRadius: 99, transition: "width 0.4s" }} />
            </div>

            {/* Readiness */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 6 }}>TODAY I FEEL</div>
              <div style={{ display: "flex", gap: 6 }}>
                {READY.map(r => (
                  <button key={r.id} onClick={() => onReadyChange(r.id)} style={{
                    flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer",
                    background: ready === r.id ? r.color : "#16161E",
                    color: ready === r.id ? "#EFEFEF" : "#555", fontWeight: 600, fontSize: 12,
                  }}>{r.label}</button>
                ))}
              </div>
              {ready !== "fresh" && <div style={{ marginTop: 6, fontSize: 11, color: "#8A6040", lineHeight: 1.4 }}>{readiness.hint}</div>}
            </div>

            {/* Day tabs */}
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {DAYS.map((d, i) => {
                const st = dayStats(d, week, k);
                const full = st.total > 0 && st.done >= st.total;
                return (
                  <button key={d.id} onClick={() => switchDay(i)} style={{
                    flex: 1, padding: "6px 0", borderRadius: 10, border: "none", cursor: "pointer",
                    background: full ? "#14532D" : i === safeDayIdx ? day.color : "#16161E",
                    color: full ? "#22C55E" : i === safeDayIdx ? "#fff" : "#555",
                    fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, letterSpacing: 1, lineHeight: 1.1,
                  }}>
                    {d.id}{full ? " ✓" : ""}
                    <div style={{ fontFamily: "'Inter'", fontSize: 9, fontWeight: 600, letterSpacing: 0.5, opacity: 0.75, marginTop: 2 }}>
                      {(weekdayFor(d.id) || "swap").toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Warmup */}
            <div style={{ marginTop: 10, background: "#16161E", borderRadius: 10, padding: "8px 12px" }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700 }}>WARM-UP  </span>
              <span style={{ fontSize: 12, color: "#666" }}>{day.warmup}</span>
            </div>
          </div>

          {/* Exercise dots */}
          <div style={{ display: "flex", gap: 5, justifyContent: "center", padding: "12px 16px 8px", flexWrap: "wrap" }}>
            {exs.map((e, i) => {
              const done = exDone(week, day, e) >= e.sets;
              return (
                <button key={i} onClick={() => setExIdx(i)} style={{
                  width: i === safeExIdx ? 22 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer",
                  background: done ? "#22C55E" : i === safeExIdx ? day.color : "#1C1C22",
                  padding: 0, transition: "all 0.2s",
                }} />
              );
            })}
          </div>

          {/* Exercise card */}
          <div style={{ flex: 1, padding: "0 16px 8px", display: "flex", flexDirection: "column" }}>
            <div style={{
              flex: 1, background: "#13131A", border: `1.5px solid ${exAllDone ? "#22C55E40" : "#1C1C22"}`,
              borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column",
              transition: "border-color 0.3s",
            }}>
              {/* Ex header */}
              <div style={{ background: day.colorDim, padding: "14px 18px 12px", borderBottom: "1px solid #1C1C22" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: day.color, fontWeight: 700, marginBottom: 4 }}>
                      {safeExIdx + 1} / {day.exercises.length}{ex.pair ? `  ·  ${ex.pair}` : ""}{ex.spine ? "  🦴" : ""}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, color: "#EFEFEF", lineHeight: 1.05 }}>
                      {ex.name.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", marginLeft: 14, flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 36, fontWeight: 800, color: day.color, lineHeight: 1 }}>{ex.sets}</div>
                    <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, fontWeight: 600 }}>{isRounds ? "ROUNDS" : "SETS"}</div>
                  </div>
                </div>
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ background: day.color + "25", borderRadius: 99, padding: "3px 10px", fontSize: 13, color: day.color, fontWeight: 600 }}>
                    {/^[\d–-]+( ea\.)?$/.test(ex.reps) ? `${ex.reps} reps` : ex.reps}
                  </span>
                  {ex.rest && ex.rest !== "—" && (
                    <span style={{ background: "#1C1C22", borderRadius: 99, padding: "3px 10px", fontSize: 13, color: "#888", fontWeight: 600 }}>Rest {ex.rest}</span>
                  )}
                </div>
              </div>

              {/* Cue */}
              <div style={{ padding: "10px 18px", borderBottom: "1px solid #1A1A20" }}>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>
                  {ex.spine && <span style={{ color: "#F59E0B", marginRight: 4 }}>🦴</span>}{ex.note}
                </div>
                {ex.bjj && (
                  <div style={{ fontSize: 12, color: day.color, marginTop: 6, lineHeight: 1.45 }}>
                    <span style={{ fontSize: 10, letterSpacing: 1.5, fontWeight: 700, marginRight: 6 }}>FOR BJJ</span>{ex.bjj}
                  </div>
                )}
                {!ex.cond && ex.pair && (
                  <div style={{ fontSize: 11, color: "#4A4A5A", marginTop: 4 }}>
                    Superset: alternate {ex.pair[0]}1 ↔ {ex.pair[0]}2 and rest only after the {ex.pair[0]}2 set. Keeps your heart rate up.
                  </div>
                )}
                {week === program.deloadWeek && !ex.cond && (
                  <div style={{ fontSize: 11, color: phase.color, marginTop: 4 }}>Deload: fewer sets this week — same weights, stay crisp.</div>
                )}
              </div>

              {/* Sets */}
              <div style={{ padding: "12px 18px", flex: 1, overflowY: "auto" }}>
                {buildSegments(ex, week) && (
                  <IntervalTimer
                    key={`${level}|${week}|${day.id}|${ex.name}|${ready}`}
                    segs={buildSegments(ex, week)}
                    color={day.color}
                    onSegDone={markDone}
                  />
                )}
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 8 }}>LOG YOUR SETS — WEEK {week}</div>
                {Array.from({ length: ex.sets }, (_, i) => {
                  const done = getD(week, day.id, ex.name, i);
                  const weight = getW(week, day.id, ex.name, i);
                  const prevWeight = week > 1 ? getW(week - 1, day.id, ex.name, i) : "";
                  return (
                    <div key={i} style={{
                      marginBottom: 8,
                      background: done ? "#0A1F0F" : "#0C0C12",
                      border: `1px solid ${done ? "#22C55E30" : "#1C1C22"}`,
                      borderRadius: 12, padding: "8px 12px", transition: "all 0.2s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: "#333", width: 22, textAlign: "center", flexShrink: 0 }}>{isRounds ? "R" : "S"}{i + 1}</div>
                        <input
                          type="number"
                          placeholder={ex.log || "lbs / kg"}
                          value={weight}
                          onChange={e => updateWeight(i, e.target.value)}
                          style={{
                            flex: 1, background: "transparent", border: "none", outline: "none",
                            color: "#EFEFEF", fontSize: 15, fontFamily: "'Inter'", fontWeight: 500,
                          }}
                        />
                        <button
                          onClick={() => togD(i)}
                          style={{
                            width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer",
                            background: done ? "#22C55E" : "#1C1C22", color: done ? "#fff" : "#444",
                            fontSize: done ? 16 : 18, flexShrink: 0, transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >{done ? "✓" : "○"}</button>
                      </div>
                      {prevWeight !== "" && (
                        <div style={{ marginTop: 4, fontSize: 11, color: "#3A3A4A", paddingLeft: 32 }}>
                          Last week: <span style={{ color: "#4A4A5A", fontWeight: 600 }}>{prevWeight}{ex.log ? "" : " lbs"}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div style={{ display: "flex", gap: 10, padding: "0 16px 10px" }}>
            <button onClick={() => safeExIdx > 0 && setExIdx(safeExIdx - 1)} disabled={safeExIdx === 0} style={{
              flex: 1, padding: 14, borderRadius: 14, border: "none",
              background: safeExIdx === 0 ? "#13131A" : "#1C1C22",
              color: safeExIdx === 0 ? "#2A2A2A" : "#BBB",
              fontFamily: "'Inter'", fontWeight: 600, fontSize: 15, cursor: safeExIdx === 0 ? "default" : "pointer",
            }}>← Prev</button>
            {(() => {
              const isLastEx = safeExIdx === day.exercises.length - 1;
              const isLastDay = safeDayIdx === DAYS.length - 1;
              const isLastWeek = week === TOTAL_WEEKS;
              let label = "Next →";
              let onClick = () => setExIdx(safeExIdx + 1);
              if (isLastEx && !isLastDay) {
                label = `Day ${DAYS[safeDayIdx + 1].id} →`;
                onClick = () => { setDayIdx(safeDayIdx + 1); setExIdx(0); };
              } else if (isLastEx && isLastDay && !isLastWeek) {
                label = `Week ${week + 1} →`;
                onClick = () => { setWeek(week + 1); setDayIdx(0); setExIdx(0); };
              } else if (isLastEx && isLastDay && isLastWeek) {
                label = "Done 🎯";
                onClick = () => setTab("overview");
              }
              return (
                <button onClick={onClick} style={{
                  flex: 2, padding: 14, borderRadius: 14, border: "none",
                  background: day.color, color: "#fff",
                  fontFamily: "'Inter'", fontWeight: 600, fontSize: 15, cursor: "pointer",
                }}>{label}</button>
              );
            })()}
          </div>

        </>)}

        {tab === "week" && (
          /* ── Week tab ── */
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 10px" }}>

            {/* Level toggle */}
            <div style={{ display: "flex", gap: 4, background: "#13131A", border: "1px solid #1C1C22", borderRadius: 99, padding: 3, marginBottom: 14, width: "fit-content" }}>
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => changeLevel(l.id)} style={{
                  padding: "5px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                  background: l.id === level ? "#2563EB" : "transparent",
                  color: l.id === level ? "#fff" : "#555",
                  fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, letterSpacing: 2,
                }}>{l.short}</button>
              ))}
            </div>

            {(() => {
              const plan = program.week || [];
              const today = plan[todayIdx];
              const openLift = id => { const i = DAYS.findIndex(x => x.id === id); if (i >= 0) { switchDay(i); setTab("workout"); } };
              const Label = ({ children }) => (
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 6 }}>{children}</div>
              );
              return (<>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28, letterSpacing: 1, marginBottom: 10 }}>YOUR WEEK</div>

                {today && (() => {
                  const lift = today.lift && DAYS.find(x => x.id === today.lift.id);
                  return (
                    <div style={{ background: "#16161E", border: "1.5px solid #2A2A38", borderRadius: 16, padding: 14, marginBottom: 14 }}>
                      <Label>TODAY · {today.day.toUpperCase()}</Label>
                      {lift ? (
                        <button onClick={() => openLift(today.lift.id)} style={{
                          width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer",
                          background: lift.color, color: "#fff", fontFamily: "'Inter'", fontWeight: 600, fontSize: 15,
                        }}>Start Day {lift.id}: {lift.label} →</button>
                      ) : (
                        <div style={{ fontSize: 15, color: "#EFEFEF", fontWeight: 600 }}>{(today.bjj || []).join(" · ") || "Recovery day"}</div>
                      )}
                      <div style={{ fontSize: 12, color: "#777", marginTop: 8, lineHeight: 1.5 }}>
                        {today.lift ? today.lift.time : (today.extras || [])[0] || today.tip}
                      </div>
                    </div>
                  );
                })()}

                {plan.map((d, i) => {
                  const isToday = i === todayIdx;
                  const lift = d.lift && DAYS.find(x => x.id === d.lift.id);
                  return (
                    <div key={d.day} style={{
                      background: "#13131A", border: `1.5px solid ${isToday ? "#EFEFEF44" : "#1C1C22"}`,
                      borderRadius: 16, padding: 14, marginBottom: 10,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 22, letterSpacing: 1, color: "#EFEFEF" }}>{d.day.toUpperCase()}</div>
                        {isToday && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, background: "#EFEFEF", color: "#0C0C10", borderRadius: 99, padding: "2px 8px" }}>TODAY</span>}
                      </div>

                      {(d.bjj || []).map(t => (
                        <div key={t} style={{ fontSize: 13, color: "#EFEFEF", fontWeight: 600, marginBottom: 6 }}>🥋 {t}</div>
                      ))}
                      {lift && (
                        <button onClick={() => openLift(d.lift.id)} style={{
                          width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, border: `1px solid ${lift.color}55`,
                          background: lift.color + "22", cursor: "pointer", marginBottom: 6,
                        }}>
                          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, letterSpacing: 0.5, color: lift.color }}>{lift.emoji} DAY {lift.id} · {lift.label.toUpperCase()}</div>
                          <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{d.lift.time}</div>
                        </button>
                      )}
                      {(d.extras || []).map(t => (
                        <div key={t} style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>＋ {t}</div>
                      ))}
                      {!d.bjj && !lift && !(d.extras || []).length && (
                        <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>Rest day</div>
                      )}

                      {d.tip && <div style={{ fontSize: 11, color: "#555", marginBottom: 8, lineHeight: 1.45 }}>{d.tip}</div>}

                      <div style={{ borderTop: "1px solid #1C1C22", paddingTop: 8 }}>
                        <Label>RECOVERY</Label>
                        {d.recovery.map(t => (
                          <div key={t} style={{ fontSize: 12, color: "#8A8A9A", lineHeight: 1.5, marginBottom: 3, paddingLeft: 12, textIndent: -12 }}>• {t}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {program.recovery && (<>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 22, letterSpacing: 1, margin: "18px 0 8px" }}>RECOVERY MENU</div>
                  {program.recovery.map(r => (
                    <details key={r.name} style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                      <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#EFEFEF" }}>{r.name}</summary>
                      <div style={{ fontSize: 12, color: "#777", margin: "8px 0 6px", lineHeight: 1.5 }}>{r.when}</div>
                      {r.steps.map(t => (
                        <div key={t} style={{ fontSize: 12, color: "#AAA", lineHeight: 1.5, marginBottom: 3, paddingLeft: 12, textIndent: -12 }}>• {t}</div>
                      ))}
                      {r.caution && <div style={{ fontSize: 11, color: "#F59E0B", marginTop: 8, lineHeight: 1.5 }}>⚠ {r.caution}</div>}
                    </details>
                  ))}
                </>)}
              </>);
            })()}
          </div>
        )}

        {tab === "overview" && (
          /* ── Overview tab ── */
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 10px" }}>

            {/* Level toggle */}
            <div style={{ display: "flex", gap: 4, background: "#13131A", border: "1px solid #1C1C22", borderRadius: 99, padding: 3, marginBottom: 14, width: "fit-content" }}>
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => changeLevel(l.id)} style={{
                  padding: "5px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                  background: l.id === level ? "#2563EB" : "transparent",
                  color: l.id === level ? "#fff" : "#555",
                  fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, letterSpacing: 2,
                }}>{l.short}</button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>PROGRAM</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: "#555" }}>WEEK {week} OF {TOTAL_WEEKS}</div>
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>{program.description}</div>

            {/* Week grid */}
            <div style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 14, padding: "12px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 8 }}>{TOTAL_WEEKS}-WEEK PROGRESS</div>
              <div style={{ display: "flex", gap: 5 }}>
                {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => {
                  const ws = weekStats(w);
                  const wp = ws.total ? Math.min(100, Math.round((ws.done / ws.total) * 100)) : 0;
                  const isActive = w === week;
                  return (
                    <button key={w} onClick={() => { setWeek(w); setTab("workout"); }} style={{
                      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      background: "transparent", border: "none", cursor: "pointer", padding: "4px 0",
                    }}>
                      <div style={{
                        width: "100%", height: 40, borderRadius: 6, overflow: "hidden",
                        background: "#1C1C22", position: "relative",
                        outline: isActive ? "1.5px solid #EFEFEF" : "none",
                      }}>
                        <div style={{
                          position: "absolute", bottom: 0, width: "100%",
                          height: `${wp}%`, background: wp === 100 ? "#22C55E" : phaseOf(w, program.deloadWeek, TOTAL_WEEKS).color,
                          transition: "height 0.3s",
                        }} />
                      </div>
                      <div style={{ fontSize: 9, color: isActive ? "#EFEFEF" : "#444", fontWeight: 700 }}>W{w}</div>
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#555", lineHeight: 1.5 }}>
                <span style={{ color: phase.color, fontWeight: 700 }}>{phase.name}</span> — {phase.desc}
              </div>
            </div>

            <div style={{ background: "#13131A", border: "1px solid #7C2D12", borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B", letterSpacing: 2, marginBottom: 4 }}>⚠ L4/L5 DISC</div>
              <div style={{ fontSize: 12, color: "#8A6040", lineHeight: 1.55 }}>🦴 marks spine-sensitive exercises. Stop if you feel radiating leg pain. No barbell back squats or conventional deadlifts.</div>
            </div>

            {program.why && (
              <div style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: "14px", marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: 2, marginBottom: 10 }}>HOW THIS WEEK WORKS</div>
                {program.why.map(([t, d]) => (
                  <div key={t} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#CCC" }}>{t}</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{d}</div>
                  </div>
                ))}
              </div>
            )}

            {DAYS.map((d, i) => {
              const st = dayStats(d, week);
              const dp = st.total ? Math.min(100, Math.round((st.done / st.total) * 100)) : 0;
              return (
                <div key={d.id} onClick={() => { switchDay(i); setTab("workout"); }}
                  style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: "14px", marginBottom: 10, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: d.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{d.emoji}</div>
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, letterSpacing: 1, color: "#EFEFEF" }}>
                          DAY {d.id} {d.optional && <span style={{ fontSize: 12, color: "#444", fontFamily: "'Inter'", fontWeight: 500 }}>{d.tag || "optional"}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#666" }}>{d.label} · {d.exercises.length} exercises</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 22, color: dp === 100 ? "#22C55E" : d.color }}>{dp}%</div>
                  </div>
                  <div style={{ height: 3, background: "#1C1C22", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${dp}%`, background: d.color, borderRadius: 99 }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {d.exercises.map(e => {
                      const cur = maxWeightForEx(week, d.id, e.name);
                      const prev = week > 1 ? maxWeightForEx(week - 1, d.id, e.name) : 0;
                      const delta = cur - prev;
                      const deltaColor = delta > 0 ? "#22C55E" : delta < 0 ? "#EF4444" : "#555";
                      return (
                        <div key={e.name} onClick={ev => { ev.stopPropagation(); switchDay(i); setSelectedExName(e.name); setTab("progress"); }}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #1A1A22" }}>
                          <div style={{ fontSize: 12, color: e.spine ? "#F59E0B" : "#CCC", fontWeight: 500 }}>
                            {e.spine ? "🦴 " : ""}{e.name}
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 16, color: cur > 0 ? "#EFEFEF" : "#3A3A4A" }}>
                              {cur > 0 ? cur : "—"}
                            </span>
                            {cur > 0 && prev > 0 && (
                              <span style={{ fontSize: 11, color: deltaColor, fontWeight: 700, minWidth: 28, textAlign: "right" }}>
                                {delta > 0 ? "+" : ""}{delta}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {(program.schedules || []).map(sch => (
              <div key={sch.title} style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: "14px", marginTop: 4, marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: 2, marginBottom: 10 }}>{sch.title}</div>
                {sch.rows.map(([d, t]) => (
                  <div key={d} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 56, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#888" }}>{d}</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{t}</div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: "14px", marginTop: 4, marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: 2, marginBottom: 10 }}>RULES</div>
              {program.rules.map(([t, d]) => (
                <div key={t} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#CCC" }}>{t}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "progress" && (
          /* ── Progress tab ── */
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 10px" }}>

            {/* Level toggle */}
            <div style={{ display: "flex", gap: 4, background: "#13131A", border: "1px solid #1C1C22", borderRadius: 99, padding: 3, marginBottom: 14, width: "fit-content" }}>
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => changeLevel(l.id)} style={{
                  padding: "5px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                  background: l.id === level ? day.color : "transparent",
                  color: l.id === level ? "#fff" : "#555",
                  fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, letterSpacing: 2,
                }}>{l.short}</button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>PROGRESS</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: "#555" }}>WEEK {week} OF {TOTAL_WEEKS}</div>
            </div>

            {/* Day selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {DAYS.map((d, i) => (
                <button key={d.id} onClick={() => { setDayIdx(i); setSelectedExName(null); }} style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                  background: i === safeDayIdx ? d.color : "#16161E",
                  color: i === safeDayIdx ? "#fff" : "#555",
                  fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, letterSpacing: 1,
                }}>{d.id}</button>
              ))}
            </div>

            {/* Exercise picker */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 6 }}>
              {day.exercises.map(e => {
                const isSelected = progressEx.name === e.name;
                return (
                  <button key={e.name} onClick={() => setSelectedExName(e.name)} style={{
                    padding: "8px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                    background: isSelected ? day.color : "#16161E",
                    color: isSelected ? "#fff" : "#888",
                    fontSize: 12, fontWeight: 600,
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>{e.spine ? "🦴 " : ""}{e.name}</button>
                );
              })}
            </div>

            {/* Stats + chart card */}
            {(() => {
              const e = progressEx;
              const weeklyMaxes = Array.from({ length: TOTAL_WEEKS }, (_, wi) =>
                maxWeightForEx(wi + 1, day.id, e.name)
              );
              const cur = weeklyMaxes[week - 1] || 0;
              const prev = week > 1 ? (weeklyMaxes[week - 2] || 0) : 0;
              const best = Math.max(...weeklyMaxes);
              const bestWeek = best > 0 ? weeklyMaxes.indexOf(best) + 1 : null;
              const delta = cur - prev;
              const hasAny = best > 0;

              const StatBox = ({ label, value, sub, color }) => (
                <div style={{ flex: 1, background: "#0C0C12", borderRadius: 10, padding: "10px 6px", textAlign: "center", border: "1px solid #1C1C22" }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#555", fontWeight: 700, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, color: color || "#EFEFEF", lineHeight: 1 }}>{value}</div>
                  {sub && <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{sub}</div>}
                </div>
              );

              return (
                <div style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: 16 }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 22, color: "#EFEFEF", lineHeight: 1.1, marginBottom: 2 }}>
                    {e.spine ? "🦴 " : ""}{e.name.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 11, color: day.color, marginBottom: 14, letterSpacing: 1, fontWeight: 600 }}>
                    DAY {day.id} · {day.label.toUpperCase()} · {e.sets}×{e.reps}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <StatBox label={`WEEK ${week}`} value={cur > 0 ? cur : "—"} color={day.color} />
                    <StatBox label="BEST" value={hasAny ? best : "—"} sub={hasAny ? `W${bestWeek}` : ""} />
                    <StatBox
                      label="Δ LAST"
                      value={cur > 0 && prev > 0 ? (delta > 0 ? `+${delta}` : `${delta}`) : "—"}
                      color={delta > 0 ? "#22C55E" : delta < 0 ? "#EF4444" : undefined}
                    />
                  </div>

                  {hasAny ? (
                    <ExerciseChart
                      values={weeklyMaxes}
                      color={day.color}
                      totalWeeks={TOTAL_WEEKS}
                      currentWeek={week}
                      large
                    />
                  ) : (
                    <div style={{ padding: "40px 0", textAlign: "center", color: "#444", fontSize: 13 }}>
                      No data yet — log a set in the Workout tab to start tracking.
                    </div>
                  )}

                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.5, marginTop: 14, paddingTop: 14, borderTop: "1px solid #1C1C22" }}>
                    {e.spine && <span style={{ color: "#F59E0B", marginRight: 4 }}>🦴</span>}{e.note}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ background: "#0C0C10", borderTop: "1px solid #16161E", display: "flex", padding: "8px 16px 20px", gap: 8, flexShrink: 0 }}>
          {[["week", "📅", "Week"], ["workout", "🏋️", "Workout"], ["progress", "📈", "Progress"], ["overview", "📋", "Overview"]].map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "9px", borderRadius: 12, border: "none", cursor: "pointer",
              background: tab === id ? "#16161E" : "transparent",
              color: tab === id ? "#EFEFEF" : "#444",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
