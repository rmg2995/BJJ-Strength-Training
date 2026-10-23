import { useState, useEffect } from "react";
import { fmt } from "./engine";

// ───────── Audio / haptics ─────────
let actx;
function beep(freq = 880, dur = 0.15) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = freq; g.gain.value = 0.15;
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
  } catch { /* audio unavailable */ }
  try { navigator.vibrate?.(dur > 0.2 ? [200, 100, 200] : 60); } catch { /* no haptics */ }
}

// ───────── Interval timer ─────────
export default function IntervalTimer({ segs, color, onSegDone }) {
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(segs[0]?.secs || 0);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [run]);

  useEffect(() => {
    if (!run) return;
    if (left > 0) { if (left <= 3) beep(660, 0.08); return; }
    const s = segs[i];
    const next = segs[i + 1];
    if (s.done !== undefined) onSegDone(s.done);
    if (!next) { beep(988, 0.4); setRun(false); setI(segs.length); return; }
    beep(next.kind === "work" ? 988 : 520, 0.3);
    setI(i + 1); setLeft(next.secs);
  }, [left, run]);

  useEffect(() => {
    let lock;
    if (run && navigator.wakeLock) navigator.wakeLock.request("screen").then((l) => { lock = l; }).catch(() => {});
    return () => { try { lock?.release(); } catch { /* ignore */ } };
  }, [run]);

  const finished = i >= segs.length;
  const cur = segs[i];
  const isWork = cur?.kind === "work";
  const col = finished ? "#22C55E" : isWork ? color : "#3B82F6";
  const totalRounds = Math.max(...segs.map((s) => s.round)) + 1;
  const remaining = finished ? 0 : left + segs.slice(i + 1).reduce((a, s) => a + s.secs, 0);

  function reset() { setRun(false); setI(0); setLeft(segs[0]?.secs || 0); }
  function toggle() { if (finished) { reset(); return; } if (!run) beep(660, 0.08); setRun(!run); }

  return (
    <div style={{ background: col + "18", border: `1.5px solid ${col}55`, borderRadius: 14, padding: "12px 14px", marginBottom: 12, transition: "all 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: 2, fontWeight: 700, color: col, marginBottom: 2 }}>
        <span>{finished ? "COMPLETE" : isWork ? "WORK" : "RECOVER"}</span>
        <span>{finished ? "" : `ROUND ${cur.round + 1} / ${totalRounds}`}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 56, lineHeight: 1, color: col, minWidth: 110 }}>
          {finished ? "✓" : fmt(Math.max(left, 0))}
        </div>
        <div style={{ flex: 1, fontSize: 13, color: "#BBB", lineHeight: 1.3 }}>
          {finished ? "Log your rounds below." : cur.label}
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{fmt(remaining)} left total</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={toggle} style={{ flex: 2, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", background: col, color: "#fff", fontWeight: 700, fontSize: 14 }}>
          {finished ? "Restart" : run ? "Pause" : i === 0 && left === segs[0].secs ? "Start" : "Resume"}
        </button>
        {run && <button onClick={() => setLeft(0)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", background: "#1C1C22", color: "#BBB", fontWeight: 600, fontSize: 13 }}>Skip</button>}
        <button onClick={reset} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", background: "#1C1C22", color: "#BBB", fontWeight: 600, fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}

