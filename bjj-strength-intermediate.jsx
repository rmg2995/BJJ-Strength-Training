import { useState } from "react";

const TOTAL_WEEKS = 8;

const DAYS = [
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
];





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

// key: week · day · exercise · set
const wk = (w, dId, eName, s) => `w${w}|${dId}|${eName}|${s}`;

export default function App() {
  const [week, setWeek] = useState(1);
  const [dayIdx, setDayIdx] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [data, setData] = useState({});
  const [tab, setTab] = useState("workout");
  const [showWeekPicker, setShowWeekPicker] = useState(false);

  const day = DAYS[dayIdx];
  const ex = day.exercises[exIdx];

  const getW = (w, dId, eName, s) => data[wk(w, dId, eName, s)]?.w || "";
  const getD = (w, dId, eName, s) => data[wk(w, dId, eName, s)]?.d || false;

  function togD(s) {
    const key = wk(week, day.id, ex.name, s);
    const next = { ...data, [key]: { ...data[key], d: !data[key]?.d } };
    setData(next);
  }

  // Fix setW to take set index properly
  function updateWeight(setIdx, val) {
    const key = wk(week, day.id, ex.name, setIdx);
    const next = { ...data, [key]: { ...data[key], w: val } };
    setData(next);
  }

  const totalSets = day.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = day.exercises.reduce((a, e) =>
    a + Array.from({ length: e.sets }, (_, i) => getD(week, day.id, e.name, i)).filter(Boolean).length, 0);
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const exAllDone = Array.from({ length: ex.sets }, (_, i) => getD(week, day.id, ex.name, i)).every(Boolean);

  function switchDay(i) { setDayIdx(i); setExIdx(0); }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100dvh", background: "#0C0C10", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>

        {tab === "workout" ? (<>

          {/* ── Header ── */}
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#444", fontWeight: 600, marginBottom: 2 }}>INTERMEDIATE · BJJ</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>
                  {day.label.toUpperCase()}
                  {day.optional && <span style={{ marginLeft: 8, fontSize: 11, color: "#555", fontFamily: "'Inter'", fontWeight: 500 }}>optional</span>}
                </div>
              </div>
              {/* Week picker trigger */}
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
            </div>

            {/* Week picker dropdown */}
            {showWeekPicker && (
              <div style={{ background: "#16161E", border: "1px solid #2A2A38", borderRadius: 14, padding: "12px", marginBottom: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 8 }}>SELECT WEEK</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => {
                    const wDone = DAYS.reduce((a, d) =>
                      a + d.exercises.reduce((b, e) =>
                        b + Array.from({ length: e.sets }, (_, s) => getD(w, d.id, e.name, s)).filter(Boolean).length, 0), 0);
                    const wTotal = DAYS.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets, 0), 0);
                    const hasData = wDone > 0;
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
              <span style={{ fontSize: 10, color: "#444" }}>Week {week} progress</span>
              <span style={{ fontSize: 10, color: pct === 100 ? "#22C55E" : day.color, fontWeight: 700 }}>{pct}% · {doneSets}/{totalSets} sets</span>
            </div>
            <div style={{ height: 3, background: "#1C1C22", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: day.color, borderRadius: 99, transition: "width 0.4s" }} />
            </div>

            {/* Day tabs */}
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {DAYS.map((d, i) => {
                const dT = d.exercises.reduce((a, e) => a + e.sets, 0);
                const dD = d.exercises.reduce((a, e) =>
                  a + Array.from({ length: e.sets }, (_, s) => getD(week, d.id, e.name, s)).filter(Boolean).length, 0);
                const full = dT === dD;
                return (
                  <button key={d.id} onClick={() => switchDay(i)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                    background: full ? "#14532D" : i === dayIdx ? day.color : "#16161E",
                    color: full ? "#22C55E" : i === dayIdx ? "#fff" : "#555",
                    fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, letterSpacing: 1,
                  }}>{d.id}{full ? " ✓" : ""}</button>
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
            {day.exercises.map((e, i) => {
              const done = Array.from({ length: e.sets }, (_, s) => getD(week, day.id, e.name, s)).every(Boolean);
              return (
                <button key={i} onClick={() => setExIdx(i)} style={{
                  width: i === exIdx ? 22 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer",
                  background: done ? "#22C55E" : i === exIdx ? day.color : "#1C1C22",
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
                      {exIdx + 1} / {day.exercises.length}{ex.spine ? "  🦴" : ""}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, color: "#EFEFEF", lineHeight: 1.05 }}>
                      {ex.name.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", marginLeft: 14, flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 36, fontWeight: 800, color: day.color, lineHeight: 1 }}>{ex.sets}</div>
                    <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, fontWeight: 600 }}>SETS</div>
                  </div>
                </div>
                <div style={{ marginTop: 6, display: "inline-flex", background: day.color + "25", borderRadius: 99, padding: "3px 10px" }}>
                  <span style={{ fontSize: 13, color: day.color, fontWeight: 600 }}>{ex.reps} reps</span>
                </div>
              </div>

              {/* Cue */}
              <div style={{ padding: "10px 18px", borderBottom: "1px solid #1A1A20" }}>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>
                  {ex.spine && <span style={{ color: "#F59E0B", marginRight: 4 }}>🦴</span>}{ex.note}
                </div>
              </div>

              {/* Sets */}
              <div style={{ padding: "12px 18px", flex: 1, overflowY: "auto" }}>
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
                        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: "#333", width: 22, textAlign: "center", flexShrink: 0 }}>S{i + 1}</div>
                        <input
                          type="number"
                          placeholder="lbs / kg"
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
                      {/* Previous week reference */}
                      {prevWeight !== "" && (
                        <div style={{ marginTop: 4, fontSize: 11, color: "#3A3A4A", paddingLeft: 32 }}>
                          Last week: <span style={{ color: "#4A4A5A", fontWeight: 600 }}>{prevWeight} lbs</span>
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
            <button onClick={() => exIdx > 0 && setExIdx(exIdx - 1)} disabled={exIdx === 0} style={{
              flex: 1, padding: 14, borderRadius: 14, border: "none",
              background: exIdx === 0 ? "#13131A" : "#1C1C22",
              color: exIdx === 0 ? "#2A2A2A" : "#BBB",
              fontFamily: "'Inter'", fontWeight: 600, fontSize: 15, cursor: exIdx === 0 ? "default" : "pointer",
            }}>← Prev</button>
            <button
              onClick={() => exIdx < day.exercises.length - 1 && setExIdx(exIdx + 1)}
              disabled={exIdx === day.exercises.length - 1}
              style={{
                flex: 2, padding: 14, borderRadius: 14, border: "none",
                background: exIdx === day.exercises.length - 1 ? "#13131A" : day.color,
                color: exIdx === day.exercises.length - 1 ? "#2A2A2A" : "#fff",
                fontFamily: "'Inter'", fontWeight: 600, fontSize: 15, cursor: exIdx === day.exercises.length - 1 ? "default" : "pointer",
              }}
            >{exIdx === day.exercises.length - 1 ? "Done 🎯" : "Next →"}</button>
          </div>

        </>) : (

          /* ── Overview tab ── */
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>PROGRAM</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: "#555" }}>WEEK {week} OF {TOTAL_WEEKS}</div>
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Intermediate · BJJ Functional Strength · F22 + Bowflex 1090</div>

            {/* Week grid */}
            <div style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 14, padding: "12px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 700, marginBottom: 8 }}>8-WEEK PROGRESS</div>
              <div style={{ display: "flex", gap: 5 }}>
                {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => {
                  const wDone = DAYS.reduce((a, d) =>
                    a + d.exercises.reduce((b, e) =>
                      b + Array.from({ length: e.sets }, (_, s) => getD(w, d.id, e.name, s)).filter(Boolean).length, 0), 0);
                  const wTotal = DAYS.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets, 0), 0);
                  const wp = wTotal ? Math.round((wDone / wTotal) * 100) : 0;
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
                          height: `${wp}%`, background: wp === 100 ? "#22C55E" : "#2563EB",
                          transition: "height 0.3s",
                        }} />
                      </div>
                      <div style={{ fontSize: 9, color: isActive ? "#EFEFEF" : "#444", fontWeight: 700 }}>W{w}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ background: "#13131A", border: "1px solid #7C2D12", borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B", letterSpacing: 2, marginBottom: 4 }}>⚠ L4/L5 DISC</div>
              <div style={{ fontSize: 12, color: "#8A6040", lineHeight: 1.55 }}>🦴 marks spine-safe exercises. Stop if you feel radiating leg pain. No barbell back squats or conventional deadlifts.</div>
            </div>

            {DAYS.map((d, i) => {
              const dT = d.exercises.reduce((a, e) => a + e.sets, 0);
              const dD = d.exercises.reduce((a, e) =>
                a + Array.from({ length: e.sets }, (_, s) => getD(week, d.id, e.name, s)).filter(Boolean).length, 0);
              const dp = dT ? Math.round((dD / dT) * 100) : 0;
              return (
                <div key={d.id} onClick={() => { switchDay(i); setTab("workout"); }}
                  style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: "14px", marginBottom: 10, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: d.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{d.emoji}</div>
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, letterSpacing: 1, color: "#EFEFEF" }}>
                          DAY {d.id} {d.optional && <span style={{ fontSize: 12, color: "#444", fontFamily: "'Inter'", fontWeight: 500 }}>optional</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#666" }}>{d.label} · {d.exercises.length} exercises</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 22, color: dp === 100 ? "#22C55E" : d.color }}>{dp}%</div>
                  </div>
                  <div style={{ height: 3, background: "#1C1C22", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${dp}%`, background: d.color, borderRadius: 99 }} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {d.exercises.map(e => (
                      <span key={e.name} style={{ fontSize: 11, color: "#555", background: "#1A1A22", padding: "3px 8px", borderRadius: 99 }}>
                        {e.spine ? "🦴 " : ""}{e.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ background: "#13131A", border: "1px solid #1C1C22", borderRadius: 16, padding: "14px", marginTop: 4, marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: 2, marginBottom: 10 }}>RULES</div>
              {[
                ["Rest between sets", "90s compound lifts · 60s accessories"],
                ["Deload every 4–6 wks", "Cut volume 40% — you're also doing BJJ 3–4×"],
                ["Progress weekly", "Add reps or a little weight each session"],
                ["Neutral spine first", "Reduce weight before compromising form"],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#CCC" }}>{t}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ background: "#0C0C10", borderTop: "1px solid #16161E", display: "flex", padding: "8px 16px 20px", gap: 8, flexShrink: 0 }}>
          {[["workout", "🏋️", "Workout"], ["overview", "📋", "Overview"]].map(([id, icon, label]) => (
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
