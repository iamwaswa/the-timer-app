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
