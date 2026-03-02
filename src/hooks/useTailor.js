import { useState } from "react";
import { runTailor } from "../utils/tailor";

export const useTailor = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(false);

  const start = () => runTailor(setProgress, setDone, setActive);

  const reset = () => {
    setProgress(0);
    setDone(false);
    setActive(false);
  };

  return { progress, done, active, start, reset };
};
