export const pickTimerIntervalBackgroundColor = ((): (() => string) => {
  const backgroundColors = ["#42a5f5", "#ba68c8", "#ef5350", "#ff9800", "#03a9f4", "#4caf50"];
  let nthBackgroundColorIndex = -1;

  return function chooseNthBackgroundColor(): string {
    nthBackgroundColorIndex = (nthBackgroundColorIndex + 1) % backgroundColors.length;
    return backgroundColors[nthBackgroundColorIndex];
  };
})();
