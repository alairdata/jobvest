import { useState } from "react";

const steps = [
  { p: 14, t: 400 },
  { p: 32, t: 600 },
  { p: 50, t: 500 },
  { p: 68, t: 700 },
  { p: 82, t: 500 },
  { p: 95, t: 500 },
  { p: 100, t: 300 },
];

const runTailor = (setProgress, setDone, setActive) => {
  setProgress(0);
  setDone(false);
  setActive(true);
  let i = 0;
  const run = () => {
    if (i < steps.length) {
      setTimeout(() => {
        setProgress(steps[i].p);
        i++;
        run();
      }, steps[i].t);
    } else {
      setTimeout(() => {
        setDone(true);
        setActive(false);
      }, 400);
    }
  };
  run();
};

export const useTailor = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(false);

  const start = () => runTailor(setProgress, setDone, setActive);
  const reset = () => { setProgress(0); setDone(false); setActive(false); };

  return { progress, done, active, start, reset };
};
