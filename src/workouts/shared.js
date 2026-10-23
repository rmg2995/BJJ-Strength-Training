// Weekly plan and recovery menu shared by every level. Pure data.
//
// week[i] is Mon..Sun. `lift.id` points at a day id in the program's `days`.
// Cold is kept off lifting days on purpose: cold water right after lifting can blunt strength and muscle gains.

export const week = [
  {
    day: "Mon",
    bjj: ["BJJ (gi) · 7:00–8:00 am"],
    recovery: [
      "Evening: 10-minute Reset (hips + upper back)",
      "Optional: 15-minute sauna after dinner, with water",
      "Protein and carbs within a few hours of class",
    ],
    tip: "Nothing else hard today.",
  },
  {
    day: "Tue",
    lift: { id: "B", time: "8:00–8:45 am after drop-off (or 5:30–6:30 pm)" },
    recovery: [
      "After lifting: easy 10–15 minute walk",
      "Skip ice today since you lifted",
      "Evening: 10-minute Reset",
    ],
    tip: "No extra grip work. Wednesday is gi.",
  },
  {
    day: "Wed",
    bjj: ["BJJ (gi) · 7:00–8:00 am"],
    recovery: [
      "Busy day: do the 5-minute version of the Reset (2 min breathing, 1 min hip flexor each side)",
      "Protein-rich dinner and an on-time bedtime. Thursday is an early lift",
    ],
    tip: "Nothing else on the schedule.",
  },
  {
    day: "Thu",
    lift: { id: "C", time: "8:00–8:45 am after drop-off" },
    extras: ["Optional BJJ class · 7:30–8:30 pm, only if you feel Fresh"],
    recovery: [
      "No class tonight: 15–20 minute sauna, or the 10-minute Reset",
      "Skip ice today since you lifted",
      "Early bedtime. Friday is a 7 am no-gi class",
    ],
    tip: "Light lift. The grip work lives here because Friday is no-gi.",
  },
  {
    day: "Fri",
    bjj: ["BJJ (no-gi) · 7:00–8:00 am"],
    recovery: [
      "Afternoon: sauna 15–20 minutes, or a hot shower and the 10-minute Reset",
      "Protein and carbs, and drink water",
      "Skip ice. Tomorrow is your heavy lift",
    ],
    tip: "Expect a faster, more cardio-heavy class.",
  },
  {
    day: "Sat",
    lift: { id: "A", time: "Any time, about 40 minutes" },
    recovery: [
      "After lifting: 10-minute Reset",
      "Sauna 15–20 minutes is fine after lifting",
      "No ice bath today. Eat a full meal with protein",
    ],
    tip: "Heaviest day of the week. Eat well and sleep well.",
  },
  {
    day: "Sun",
    extras: ["Easy basketball, or the Zone 2 walk (Day D) if you skip it"],
    recovery: [
      "Cold shower or ice bath, 5–10 minutes (best day since you didn't lift)",
      "Sauna 15–20 minutes",
      "20-minute Sunday Flow (below)",
      "Prep food and get to bed on time. Monday is a 7 am gi class",
    ],
    tip: "Keep basketball easy. This is your main recovery day.",
  },
];

export const recovery = [
  {
    name: "10-minute Reset",
    when: "After any session or before bed. Daily is fine.",
    steps: [
      "Hip flexor stretch · 60s each side",
      "90/90 hip hold · 60s each side",
      "Upper back over a foam roller · 2 min (not the lower back)",
      "Child's pose with arm reach · 60s",
      "Hamstring stretch with a strap · 45s each side",
      "Slow nasal breathing, lying down · 2 min",
    ],
    caution: "Ease in, never force a stretch. Skip deep toe-touches while your back is touchy.",
  },
  {
    name: "Sunday Flow (20 min)",
    when: "Sundays, or any day you're stiff.",
    steps: [
      "Cat-cow · 10 slow reps",
      "Thread-the-needle · 8 each side",
      "90/90 switches · 8 each side",
      "Couch stretch · 60s each side",
      "Glute bridge holds · 3 × 20s",
      "Supine knee drop twist (gentle) · 30s each side",
      "Easy walk · 5 min to finish",
    ],
    caution: "Gentle only. Stop if you feel pain or leg tingling.",
  },
  {
    name: "Sauna",
    when: "1–3 times a week: Mon evening, Thu if no class, Fri afternoon, or after Saturday's lift.",
    steps: [
      "15–20 minutes at about 160–185°F",
      "Drink water before and after",
      "Cool down for a few minutes before you stand up fast",
    ],
    caution: "Not right before class. Skip it if you're dizzy, dehydrated or have been drinking. Check with a doctor first if you have heart or blood pressure issues.",
  },
  {
    name: "Cold shower or ice bath",
    when: "Once a week on a non-lifting day. Sunday is best.",
    steps: [
      "5–10 minutes at about 50–59°F (10–15°C), or a 2–3 minute cold shower",
      "Breathe slowly, no hyperventilating",
    ],
    caution: "Skip it for several hours after lifting, since it can blunt strength and muscle gains. Check with a doctor first if you have heart or blood pressure issues.",
  },
  {
    name: "Easy walk",
    when: "Any day. Great after lifting or on the busy days.",
    steps: ["15–30 minutes, conversational pace, nasal breathing"],
    caution: "",
  },
  {
    name: "Sleep and food",
    when: "Every day. This does more than any gadget.",
    steps: [
      "7.5+ hours of sleep, with a consistent bedtime",
      "Protein at every meal",
      "Carbs around class, and drink water through the day",
    ],
    caution: "",
  },
];
