import { act, renderHook } from "@testing-library/react";

import { TimerInterval } from "@/types";

import { useSequentialTimerInterval } from "./sequential-timer-interval.hook";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("should initialize with the correct duration and status", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onAdvanceSequence = vi.fn();
  const onResetSequence = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onAdvanceSequence, onResetSequence));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();
});

it("should decrease duration when playing", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onAdvanceSequence = vi.fn();
  const onResetSequence = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onAdvanceSequence, onResetSequence));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.play();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  const advanceTimeInMs = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe((timerInterval.duration * 1000 - advanceTimeInMs) / 1000);
  expect(result.current.status).toBe("playing");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();
});

it("should pause the timer interval", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onAdvanceSequence = vi.fn();
  const onResetSequence = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onAdvanceSequence, onResetSequence));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.play();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  act(() => {
    result.current.pause();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.play();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  const advanceTimeInMs = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe((timerInterval.duration * 1000 - advanceTimeInMs) / 1000);
  expect(result.current.status).toBe("playing");

  act(() => {
    result.current.pause();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe((timerInterval.duration * 1000 - advanceTimeInMs) / 1000);
  expect(result.current.status).toBe("idle");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();
});

it("should reset the timer interval to its initial duration", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onAdvanceSequence = vi.fn();
  const onResetSequence = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onAdvanceSequence, onResetSequence));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  const advanceTimeInMs = 2000;
  act(() => {
    result.current.play();
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe((timerInterval.duration * 1000 - advanceTimeInMs) / 1000);
  expect(result.current.status).toBe("playing");

  act(() => {
    result.current.reset();
  });

  expect(result.current.animationToggle).toBe(1);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();

  act(() => {
    result.current.reset();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();
});

it("should restart the timer interval", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onAdvanceSequence = vi.fn();
  const onResetSequence = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onAdvanceSequence, onResetSequence));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  const advanceTimeInMs = 2000;
  act(() => {
    result.current.play();
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe((timerInterval.duration * 1000 - advanceTimeInMs) / 1000);
  expect(result.current.status).toBe("playing");

  act(() => {
    result.current.restart();
  });

  expect(result.current.animationToggle).toBe(1);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  act(() => {
    result.current.restart();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  const advanceTimeInMs2 = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs2);
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe((timerInterval.duration * 1000 - advanceTimeInMs2) / 1000);
  expect(result.current.status).toBe("playing");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();
});

it.each([
  {
    id: "next-test-id",
    duration: 5,
    title: "Next Test Interval",
  } as TimerInterval,
  null,
])("should handle case where next timer interval = %s and duration reaches 0", (nextTimerInterval) => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 3,
    title: "Test Interval",
  };
  const onAdvanceSequence = vi.fn().mockReturnValue(nextTimerInterval);
  const onResetSequence = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onAdvanceSequence, onResetSequence));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.play();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  act(() => {
    vi.advanceTimersByTime(timerInterval.duration * 1000);
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(nextTimerInterval === null ? 0 : nextTimerInterval.duration);
  expect(result.current.status).toBe(nextTimerInterval === null ? "idle" : "playing");
  expect(onAdvanceSequence).toHaveBeenCalled();
  expect(onResetSequence).not.toHaveBeenCalled();
});

it("should call onResetSequence when reset all is called", () => {
  const firstTimerInterval: TimerInterval = {
    id: "first-test-id",
    duration: 5,
    title: "First Test Interval",
  };
  const secondTimerInterval: TimerInterval = {
    id: "second-test-id",
    duration: 3,
    title: "Second Test Interval",
  };
  const onAdvanceSequence = vi.fn();
  const onResetSequence = vi.fn().mockReturnValue(firstTimerInterval);

  const { result } = renderHook(() =>
    useSequentialTimerInterval(secondTimerInterval, onAdvanceSequence, onResetSequence),
  );

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(secondTimerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.resetAll();
  });

  expect(result.current.animationToggle).toBe(1);
  expect(result.current.duration).toBe(firstTimerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).toHaveBeenCalled();

  act(() => {
    result.current.resetAll();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(firstTimerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onAdvanceSequence).not.toHaveBeenCalled();
  expect(onResetSequence).toHaveBeenCalled();
});
