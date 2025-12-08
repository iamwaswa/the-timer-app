export const pickTimerColor = ((): (() => string) => {
  const colors = ["#42a5f5", "#ba68c8", "#ef5350", "#ff9800", "#03a9f4", "#4caf50"];
  let nthColorIndex = -1;

  return function chooseNthColor(): string {
    nthColorIndex = (nthColorIndex + 1) % colors.length;
    return colors[nthColorIndex];
  };
})();
