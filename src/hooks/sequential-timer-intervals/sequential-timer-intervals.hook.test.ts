import { act, renderHook } from "@testing-library/react";

import type { TimerInterval } from "@/types";

import { useSequentialTimerIntervals } from "./sequential-timer-intervals.hook";

it.each([
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
])("should initialize with %s timer interval(s) and %s iteration(s)", (numTimerIntervals, numIterations) => {
  const timerIntervals: TimerInterval[] = Array.from({ length: numTimerIntervals }, (_, index) => ({
    id: (index + 1).toString(),
    duration: 10,
    title: `Timer Interval ${index + 1}`,
  }));

  if (numIterations === 0) {
    try {
      renderHook(() => useSequentialTimerIntervals(numIterations, timerIntervals));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Number of iterations must be at least 1");
    }
    return;
  }

  if (numTimerIntervals === 0) {
    try {
      renderHook(() => useSequentialTimerIntervals(numIterations, timerIntervals));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Timer intervals array cannot be empty");
    }
    return;
  }

  const { result } = renderHook(() => useSequentialTimerIntervals(numIterations, timerIntervals));

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  if (numTimerIntervals === 1 && numIterations > 1) {
    expect(result.current.nextTimerInterval).toBe(timerIntervals[0]);
  } else if (numTimerIntervals > 1 && numIterations >= 1) {
    expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);
  } else {
    expect(result.current.nextTimerInterval).toBeNull();
  }
});

it("should advance to the next timer interval", () => {
  const timerIntervals: TimerInterval[] = [
    { id: "1", duration: 10, title: "Interval 1" },
    { id: "2", duration: 20, title: "Interval 2" },
    { id: "3", duration: 30, title: "Interval 3" },
  ];

  const { result } = renderHook(() => useSequentialTimerIntervals(1, timerIntervals));

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);

  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[1]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[2]);
});

it("should advance to the last timer interval", () => {
  const timerIntervals: TimerInterval[] = [
    { id: "1", duration: 10, title: "Interval 1" },
    { id: "2", duration: 20, title: "Interval 2" },
    { id: "3", duration: 30, title: "Interval 3" },
  ];

  const { result } = renderHook(() => useSequentialTimerIntervals(1, timerIntervals));

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);

  act(() => {
    result.current.advanceSequence();
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[2]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();
});

it("should not be able to advance past the end of the sequence", () => {
  const timerIntervals: TimerInterval[] = [
    { id: "1", duration: 10, title: "Interval 1" },
    { id: "2", duration: 20, title: "Interval 2" },
    { id: "3", duration: 30, title: "Interval 3" },
  ];

  const { result } = renderHook(() => useSequentialTimerIntervals(1, timerIntervals));

  // Advance to the end
  timerIntervals.forEach(() => {
    act(() => {
      result.current.advanceSequence();
    });
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();

  // Try advance again
  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();
});

it("should reset to the first timer interval when there is more than one timer interval", () => {
  const timerIntervals: TimerInterval[] = [
    { id: "1", duration: 10, title: "Interval 1" },
    { id: "2", duration: 20, title: "Interval 2" },
    { id: "3", duration: 30, title: "Interval 3" },
  ];

  const { result } = renderHook(() => useSequentialTimerIntervals(1, timerIntervals));

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);

  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[1]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[2]);

  act(() => {
    result.current.resetSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);
});

it("should reset to the first timer interval when there is a single timer interval", () => {
  const timerIntervals: TimerInterval[] = [{ id: "1", duration: 10, title: "Interval 1" }];

  const { result } = renderHook(() => useSequentialTimerIntervals(1, timerIntervals));

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();

  act(() => {
    result.current.resetSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();
});

it("should handle multiple iterations correctly", () => {
  const timerIntervals: TimerInterval[] = [
    { id: "1", duration: 10, title: "Interval 1" },
    { id: "2", duration: 20, title: "Interval 2" },
    { id: "3", duration: 30, title: "Interval 3" },
  ];

  const { result } = renderHook(() => useSequentialTimerIntervals(2, timerIntervals));

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);

  // First iteration
  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[1]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[2]);

  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[2]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[0]);

  // Second iteration
  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[1]);

  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[1]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toEqual(timerIntervals[2]);

  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[2]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();

  // Try to advance past the end
  act(() => {
    result.current.advanceSequence();
  });

  expect(result.current.currentTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.firstTimerInterval).toEqual(timerIntervals[0]);
  expect(result.current.nextTimerInterval).toBeNull();
});
