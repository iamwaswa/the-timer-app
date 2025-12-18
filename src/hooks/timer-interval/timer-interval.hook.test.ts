import { renderHook } from "@testing-library/react";
import { act } from "react";

import { useTimerInterval } from "./timer-interval.hook";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("should initialize with the correct default state", () => {
  const timerInterval = {
    id: "1",
    duration: 10,
    title: "Test interval",
  };
  const { result } = renderHook(() => useTimerInterval(timerInterval));

  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.isPlaying).toBe(false);
  expect(result.current.isFinished).toBe(false);
});

it("should initialize with isPlaying as true if shouldStartPlaying is true", () => {
  const { result } = renderHook(() =>
    useTimerInterval(
      {
        id: "1",
        duration: 10,
        title: "Test interval",
      },
      true,
    ),
  );
  expect(result.current.isPlaying).toBe(true);
});

it("should start playing when play is called", () => {
  const { result } = renderHook(() =>
    useTimerInterval({
      id: "1",
      duration: 10,
      title: "Test interval",
    }),
  );

  expect(result.current.isPlaying).toBe(false);

  act(() => {
    result.current.play();
  });

  expect(result.current.isPlaying).toBe(true);
});

it("should pause playing when pause is called", () => {
  const { result } = renderHook(() =>
    useTimerInterval(
      {
        id: "1",
        duration: 10,
        title: "Test interval",
      },
      true,
    ),
  );

  expect(result.current.isPlaying).toBe(true);

  act(() => {
    result.current.pause();
  });

  expect(result.current.isPlaying).toBe(false);
});

it("should decrease duration when playing", () => {
  const timerInterval = {
    id: "1",
    duration: 10,
    title: "Test interval",
  };
  const { result } = renderHook(() => useTimerInterval(timerInterval, true));

  const durationDecreaseInMs = 3000;
  act(() => {
    vi.advanceTimersByTime(durationDecreaseInMs);
  });

  expect(result.current.duration).toBe((timerInterval.duration * 1000 - durationDecreaseInMs) / 1000);
});

it("should stop playing and set isFinished to true when timer ends", () => {
  const timerInterval = {
    id: "1",
    duration: 10,
    title: "Test interval",
  };
  const { result } = renderHook(() => useTimerInterval(timerInterval, true));

  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);

  act(() => {
    vi.advanceTimersByTime(timerInterval.duration * 1000);
  });

  expect(result.current.duration).toBe(0);
  expect(result.current.isPlaying).toBe(false);
  expect(result.current.isFinished).toBe(true);
});

it("should reset the timer interval when reset is called", () => {
  const timerInterval = {
    id: "1",
    duration: 10,
    title: "Test interval",
  };
  const { result } = renderHook(() => useTimerInterval(timerInterval, true));

  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);

  const durationDecreaseInMs = 5000;
  act(() => {
    vi.advanceTimersByTime(durationDecreaseInMs);
  });

  expect(result.current.duration).toBe((timerInterval.duration * 1000 - durationDecreaseInMs) / 1000);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);

  act(() => {
    result.current.reset();
  });

  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.isPlaying).toBe(false);
  expect(result.current.isFinished).toBe(false);
});

it("should restart the timer interval when restart is called", () => {
  const timerInterval = {
    id: "1",
    duration: 10,
    title: "Test interval",
  };
  const { result } = renderHook(() => useTimerInterval(timerInterval, true));

  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);

  const firstDurationDecreaseInMs = 5000;
  act(() => {
    vi.advanceTimersByTime(firstDurationDecreaseInMs);
  });

  expect(result.current.duration).toBe((timerInterval.duration * 1000 - firstDurationDecreaseInMs) / 1000);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);

  act(() => {
    result.current.restart();
  });

  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);

  const secondDurationDecreaseInMs = 3000;
  act(() => {
    vi.advanceTimersByTime(secondDurationDecreaseInMs);
  });

  expect(result.current.duration).toBe((timerInterval.duration * 1000 - secondDurationDecreaseInMs) / 1000);
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.isFinished).toBe(false);
});
