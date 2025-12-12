import { formatDuration } from "./format-duration.util";

it("should format duration correctly when hours, minutes and seconds are provided", () => {
  // 1 hour, 1 minute, and 1 second
  expect(formatDuration(3661)).toBe("01:01:01");
});

it("should format duration correctly when minutes and seconds are provided", () => {
  // 0 hours, 1 minute, and 1 second
  expect(formatDuration(61)).toBe("00:01:01");
});

it("should format duration correctly when only seconds are provided", () => {
  // 0 hours, 0 minutes, and 1 second
  expect(formatDuration(1)).toBe("00:00:01");
});

it("should format duration correctly when only minutes are provided", () => {
  // 0 hours, 1 minute, and 0 seconds
  expect(formatDuration(60)).toBe("00:01:00");
});

it("should format duration correctly when only hours are provided", () => {
  // 1 hour, 0 minutes, and 0 seconds
  expect(formatDuration(3600)).toBe("01:00:00");
});

it("should format duration correctly when duration is zero", () => {
  // 0 hours, 0 minutes, and 0 seconds
  expect(formatDuration(0)).toBe("00:00:00");
});

it("should format duration correctly for large durations", () => {
  // 10 hours, 59 minutes, and 59 seconds
  expect(formatDuration(39599)).toBe("10:59:59");
});

it("should format duration correctly for durations less than 10 seconds", () => {
  // 0 hours, 0 minutes, and 5 seconds
  expect(formatDuration(5)).toBe("00:00:05");
});
