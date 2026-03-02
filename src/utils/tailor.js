export const runTailor = (setProgress, setDone, setActive) => {
  setProgress(0);
  setDone(false);
  setActive(true);
  const steps = [
    { p: 14, t: 400 },
    { p: 32, t: 600 },
    { p: 50, t: 500 },
    { p: 68, t: 700 },
    { p: 82, t: 500 },
    { p: 95, t: 500 },
    { p: 100, t: 300 },
  ];
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
