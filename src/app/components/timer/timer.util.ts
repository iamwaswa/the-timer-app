export function formatDuration(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / (60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(durationInSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(durationInSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export const pickTimerColor = ((): (() => string) => {
  const colors = [
    "#42a5f5",
    "#ba68c8",
    "#ef5350",
    "#ff9800",
    "#03a9f4",
    "#4caf50",
  ];
  let nthColorIndex = -1;

  return function chooseNthColor(): string {
    nthColorIndex = (nthColorIndex + 1) % colors.length;
    return colors[nthColorIndex];
  };
})();
