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
  const onDurationComplete = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onDurationComplete));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onDurationComplete).not.toHaveBeenCalled();
});

it("should decrease duration when playing", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onDurationComplete = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onDurationComplete));

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
  expect(onDurationComplete).not.toHaveBeenCalled();
});

it("should pause the timer interval", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onDurationComplete = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onDurationComplete));

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
  expect(onDurationComplete).not.toHaveBeenCalled();
});

it("should reset the timer interval to its initial duration", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onDurationComplete = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onDurationComplete));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.play();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  const advanceTimeInMs = 2000;
  act(() => {
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
  expect(onDurationComplete).not.toHaveBeenCalled();

  act(() => {
    result.current.reset();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");
  expect(onDurationComplete).not.toHaveBeenCalled();
});

it("should restart the timer interval", () => {
  const timerInterval: TimerInterval = {
    id: "test-id",
    duration: 10,
    title: "Test Interval",
  };
  const onDurationComplete = vi.fn();

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onDurationComplete));

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("idle");

  act(() => {
    result.current.play();
  });

  expect(result.current.animationToggle).toBe(0);
  expect(result.current.duration).toBe(timerInterval.duration);
  expect(result.current.status).toBe("playing");

  const advanceTimeInMs = 2000;
  act(() => {
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
  expect(onDurationComplete).not.toHaveBeenCalled();
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
  const onDurationComplete = vi
    .fn()
    .mockReturnValue(
      nextTimerInterval === null
        ? { type: "pause" }
        : { payload: { duration: nextTimerInterval.duration }, type: "restart" },
    );

  const { result } = renderHook(() => useSequentialTimerInterval(timerInterval, onDurationComplete));

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

  expect(onDurationComplete).toHaveBeenCalled();
});
