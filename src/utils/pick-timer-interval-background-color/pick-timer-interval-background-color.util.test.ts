import { pickTimerIntervalBackgroundColor } from "./pick-timer-interval-background-color.util";

it("should cycle through a predefined list of background colors in sequence and wrap around", () => {
  const expectedTimerIntervalBackgroundColors = ["#42a5f5", "#ba68c8", "#ef5350", "#ff9800", "#03a9f4", "#4caf50"];

  // This test runs in a single block because pickTimerIntervalBackgroundColor is stateful.
  // The test will loop twice to ensure the background color sequence wraps around correctly.
  for (let i = 0; i < expectedTimerIntervalBackgroundColors.length * 2; i++) {
    const timerIntervalBackgroundColor = pickTimerIntervalBackgroundColor();
    expect(typeof timerIntervalBackgroundColor).toBe("string");
    expect(/^#[0-9a-f]{6}$/i.test(timerIntervalBackgroundColor)).toBe(true);
    expect(timerIntervalBackgroundColor).toBe(
      expectedTimerIntervalBackgroundColors[i % expectedTimerIntervalBackgroundColors.length],
    );
  }
});
