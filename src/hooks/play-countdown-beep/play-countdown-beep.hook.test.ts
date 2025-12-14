import { renderHook } from "@testing-library/react";

import { usePlayCountdownBeep } from "./play-countdown-beep.hook";

const mockStart = vi.fn();
const mockStop = vi.fn();
const mockConnect = vi.fn();
const mockClose = vi.fn();

class MockOscillator {
  frequency = { value: 0 };
  type = "";
  connect = mockConnect;
  start = mockStart;
  stop = mockStop;
}

class MockAudioContext {
  destination = {};
  createOscillator() {
    return new MockOscillator();
  }
  close = mockClose;
}

let originalAudioContext: typeof window.AudioContext;

beforeEach(() => {
  originalAudioContext = window.AudioContext;
  vi.useFakeTimers();
  vi.resetAllMocks();
});

afterEach(() => {
  Object.defineProperty(window, "AudioContext", {
    value: originalAudioContext,
    configurable: true,
    writable: true,
  });
  vi.useRealTimers();
});

it("should not play beep if isPlaying is false", () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });

  renderHook(() => usePlayCountdownBeep(5, false));

  expect(mockStart).not.toHaveBeenCalled();
});

it("should not play beep if duration is greater than 10", () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });

  renderHook(() => usePlayCountdownBeep(11, true));

  expect(mockStart).not.toHaveBeenCalled();
});

it.each([2, 3, 4, 5, 6, 7, 8, 9, 10])("should play a 440Hz beep for 700ms when duration is %s", (currentDuration) => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });

  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");

  renderHook(() => usePlayCountdownBeep(currentDuration, true));

  expect(mockStart).toHaveBeenCalledTimes(1);
  expect(mockConnect).toHaveBeenCalledTimes(1);

  expect(spyCreateOscillator.mock.results[0].value.type).toBe("sine");
  expect(spyCreateOscillator.mock.results[0].value.frequency.value).toBe(440);

  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  const durationDecreaseLessThan700ms = 699;
  vi.advanceTimersByTime(durationDecreaseLessThan700ms);

  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  vi.advanceTimersByTime(700 - durationDecreaseLessThan700ms);

  expect(mockStop).toHaveBeenCalledTimes(1);
  expect(mockClose).toHaveBeenCalledTimes(1);
});

it("should play a 880Hz beep for 1000ms when duration is 1", () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });

  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");

  renderHook(() => usePlayCountdownBeep(1, true));

  expect(mockStart).toHaveBeenCalledTimes(1);
  expect(mockConnect).toHaveBeenCalledTimes(1);

  expect(spyCreateOscillator.mock.results[0].value.type).toBe("sine");
  expect(spyCreateOscillator.mock.results[0].value.frequency.value).toBe(880);

  const durationDecreaseLessThan1000ms = 999;
  vi.advanceTimersByTime(durationDecreaseLessThan1000ms);

  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1000 - durationDecreaseLessThan1000ms);

  expect(mockStop).toHaveBeenCalledTimes(1);
  expect(mockClose).toHaveBeenCalledTimes(1);
});

it("should clean up audio context immediately if component unmounts mid-beep", () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });

  const { unmount } = renderHook(() => usePlayCountdownBeep(5, true));

  expect(mockStart).toHaveBeenCalled();

  vi.advanceTimersByTime(699);

  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  unmount();

  expect(mockStop).toHaveBeenCalled();
  expect(mockClose).toHaveBeenCalled();
});
