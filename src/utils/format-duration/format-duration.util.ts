export function formatDuration(durationInSeconds: number): string {
  const secondsInAnHour = 60 * 60;
  const hours = Math.floor(durationInSeconds / secondsInAnHour);
  const minutesInAnHour = 60;
  const minutes = Math.floor((durationInSeconds - hours * secondsInAnHour) / minutesInAnHour);
  const seconds = Math.floor((durationInSeconds - (hours * secondsInAnHour + minutes * minutesInAnHour)) % 60)
    .toString()
    .padStart(2, "0");

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds}`;
}
