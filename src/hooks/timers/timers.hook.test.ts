import { act, renderHook } from "@testing-library/react";

import { useTimers } from "./timers.hook";

it("should initialize with the correct values", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useTimers(numIterations, [
      {
        id: "1",
        initialDuration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        initialDuration: 2000,
        title: "Timer 2",
      },
    ]),
  );

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.nextTimerConfigIndex).toBe(1);
  expect(result.current.numIterationsLeft).toBe(numIterations);
});

it("should advance to the next timer when onTimerFinished is called", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useTimers(numIterations, [
      {
        id: "1",
        initialDuration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        initialDuration: 2000,
        title: "Timer 2",
      },
    ]),
  );

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.timerConfigIndex).toBe(1);
  expect(result.current.nextTimerConfigIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(numIterations);
});

it("should decrement iterations when a cycle is completed", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useTimers(numIterations, [
      {
        id: "1",
        initialDuration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        initialDuration: 2000,
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

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.nextTimerConfigIndex).toBe(1);
  expect(result.current.numIterationsLeft).toBe(numIterations - 1);
});

it("should not change index or iterations when no iterations are left", () => {
  const { result } = renderHook(() =>
    useTimers(1, [
      {
        id: "1",
        initialDuration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        initialDuration: 2000,
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

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(0);

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(0);
});

it("should reset all values when onResetAll is called", () => {
  const numIterations = 3;
  const { result } = renderHook(() =>
    useTimers(numIterations, [
      {
        id: "1",
        initialDuration: 1000,
        title: "Timer 1",
      },
      {
        id: "2",
        initialDuration: 2000,
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

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(numIterations - 1);

  act(() => {
    result.current.onResetAll?.();
  });

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.numIterationsLeft).toBe(numIterations);
});

it("should have onResetAll as undefined if no timer configs are provided", () => {
  const { result } = renderHook(() => useTimers(3, []));
  expect(result.current.onResetAll).toBeUndefined();
});

it("should handle an empty timerConfigs array gracefully", () => {
  const { result } = renderHook(() => useTimers(3, []));

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.nextTimerConfigIndex).toBe(0);

  act(() => {
    result.current.onTimerFinished();
  });

  expect(result.current.timerConfigIndex).toBe(0);
  expect(result.current.nextTimerConfigIndex).toBe(0);
});
