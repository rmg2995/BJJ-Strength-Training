import { useState } from "react";
import WorkoutApp from "./WorkoutApp";
import intermediate from "./workouts/intermediate";
import advanced from "./workouts/advanced";

const PROGRAMS = { intermediate, advanced };

export default function App() {
  const [level, setLevel] = useState("intermediate");
  const [data, setData] = useState({});

  return (
    <WorkoutApp
      level={level}
      program={PROGRAMS[level]}
      onLevelChange={setLevel}
      data={data}
      setData={setData}
    />
  );
}
