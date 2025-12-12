import { pickTimerColor } from "./pick-timer-color.util";

it("should cycle through a predefined list of colors in sequence and wrap around", () => {
  const expectedTimerColors = ["#42a5f5", "#ba68c8", "#ef5350", "#ff9800", "#03a9f4", "#4caf50"];

  // This test runs in a single block because pickTimerColor is stateful.
  // The test will loop twice to ensure the color sequence wraps around correctly.
  for (let i = 0; i < expectedTimerColors.length * 2; i++) {
    const timerColor = pickTimerColor();
    expect(typeof timerColor).toBe("string");
    expect(/^#[0-9a-f]{6}$/i.test(timerColor)).toBe(true);
    expect(timerColor).toBe(expectedTimerColors[i % expectedTimerColors.length]);
  }
});
