import { renderHook } from "@testing-library/react";
import { act } from "react";

import { useSequentialTimerIntervals } from "./sequential-timer-intervals.hook";

it("should initialize with the correct values", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useSequentialTimerIntervals(numIterations, [
      {
        id: "1",
        duration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        duration: 2000,
        title: "Timer 2",
      },
    ]),
  );

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.nextTimerIntervalIndex).toBe(1);
  expect(result.current.numIterationsLeft).toBe(numIterations);
});

it("should advance to the next timer when onTimerFinished is called", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useSequentialTimerIntervals(numIterations, [
      {
        id: "1",
        duration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        duration: 2000,
        title: "Timer 2",
      },
    ]),
  );

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.currentTimerIntervalIndex).toBe(1);
  expect(result.current.nextTimerIntervalIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(numIterations);
});

it("should decrement iterations when a cycle is completed", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useSequentialTimerIntervals(numIterations, [
      {
        id: "1",
        duration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        duration: 2000,
        title: "Timer 2",
      },
    ]),
  );

  act(() => {
    result.current.onTimerFinished();
  });

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.nextTimerIntervalIndex).toBe(1);
  expect(result.current.numIterationsLeft).toBe(numIterations - 1);
});

it("should not change index or iterations when no iterations are left", () => {
  const { result } = renderHook(() =>
    useSequentialTimerIntervals(1, [
      {
        id: "1",
        duration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        duration: 2000,
        title: "Timer 2",
      },
    ]),
  );

  act(() => {
    result.current.onTimerFinished();
  });

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(0);

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(0);
});

it.each([
  [
    [
      {
        id: "1",
        duration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        duration: 2000,
        title: "Timer 2",
      },
    ],
  ],
  [
    [
      {
        id: "1",
        duration: 1000,
        title: "Timer 1",
      },
    ],
  ],
  [[]],
])("should reset all values when timer intervals = %o and onResetAll is called", (timerIntervals) => {
  const numIterations = 3;
  const { result } = renderHook(() => useSequentialTimerIntervals(numIterations, timerIntervals));

  timerIntervals.forEach(() => {
    act(() => {
      result.current.onTimerFinished();
    });
  });

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(timerIntervals.length ? numIterations - 1 : numIterations);

  act(() => {
    result.current.onResetAll();
  });

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(numIterations);
});

it("should handle an empty timerIntervals array", () => {
  const { result } = renderHook(() => useSequentialTimerIntervals(3, []));

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.nextTimerIntervalIndex).toBe(0);

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.currentTimerIntervalIndex).toBe(0);
  expect(result.current.nextTimerIntervalIndex).toBe(0);
});
