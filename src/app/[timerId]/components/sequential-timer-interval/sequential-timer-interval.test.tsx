import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { TimerInterval } from "@/types";
import { formatDuration } from "@/utils";

import { SequentialTimerInterval } from "./sequential-timer-interval";

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

it("should render as expected", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 10,
  };
  const onDurationComplete = vi.fn();
  const resetTimerInterval = vi.fn();

  render(
    <SequentialTimerInterval
      backgroundColor="#ffffff"
      timerInterval={timerInterval}
      onDurationComplete={onDurationComplete}
      resetTimerInterval={resetTimerInterval}
    />,
  );

  expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timerInterval.title })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Restart" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset All" })).toBeInTheDocument();
  expect(spyCreateOscillator).not.toHaveBeenCalled();
  expect(mockConnect).not.toHaveBeenCalled();
  expect(mockStart).not.toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).not.toHaveBeenCalled();
});

it("should render as expected when played and paused", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 12,
  };
  const onDurationComplete = vi.fn();
  const resetTimerInterval = vi.fn().mockReturnValue(timerInterval);

  render(
    <SequentialTimerInterval
      backgroundColor="#ffffff"
      timerInterval={timerInterval}
      onDurationComplete={onDurationComplete}
      resetTimerInterval={resetTimerInterval}
    />,
  );

  expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

  const playButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Play" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await playButtonClickEventPromise;

  expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).not.toHaveBeenCalled();

  const advanceTimeInMs = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration - advanceTimeInMs / 1000) }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).not.toHaveBeenCalled();

  const pauseButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Pause" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await pauseButtonClickEventPromise;

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration - advanceTimeInMs / 1000) }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
  expect(spyCreateOscillator).not.toHaveBeenCalled();
  expect(mockConnect).not.toHaveBeenCalled();
  expect(mockStart).not.toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).not.toHaveBeenCalled();
});

it.each([
  { frequency: 880, duration: 1000, timerIntervalDuration: 1 },
  { frequency: 440, duration: 700, timerIntervalDuration: 2 },
  { frequency: 440, duration: 700, timerIntervalDuration: 3 },
  { frequency: 440, duration: 700, timerIntervalDuration: 4 },
  { frequency: 440, duration: 700, timerIntervalDuration: 5 },
  { frequency: 440, duration: 700, timerIntervalDuration: 6 },
  { frequency: 440, duration: 700, timerIntervalDuration: 7 },
  { frequency: 440, duration: 700, timerIntervalDuration: 8 },
  { frequency: 440, duration: 700, timerIntervalDuration: 9 },
  { frequency: 440, duration: 700, timerIntervalDuration: 10 },
])(
  "should play a $frequency Hz beep for $duration ms when the timer interval duration is $timerIntervalDuration second(s)",
  async ({ duration, frequency, timerIntervalDuration }) => {
    Object.defineProperty(window, "AudioContext", {
      value: MockAudioContext,
      configurable: true,
      writable: true,
    });
    const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
    const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const timerInterval: TimerInterval = {
      id: "1",
      title: "Test Interval",
      duration: timerIntervalDuration,
    };
    const onDurationComplete = vi.fn().mockReturnValue({ type: "pause" });
    const resetTimerInterval = vi.fn().mockReturnValue(timerInterval);

    render(
      <SequentialTimerInterval
        backgroundColor="#ffffff"
        timerInterval={timerInterval}
        onDurationComplete={onDurationComplete}
        resetTimerInterval={resetTimerInterval}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(spyCreateOscillator).not.toHaveBeenCalled();
    expect(mockConnect).not.toHaveBeenCalled();
    expect(mockStart).not.toHaveBeenCalled();
    expect(mockStop).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();

    const playButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Play" }));
    await act(() => {
      return vi.advanceTimersToNextTimerAsync();
    });
    await playButtonClickEventPromise;

    expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
    expect(onDurationComplete).not.toHaveBeenCalled();
    expect(resetTimerInterval).not.toHaveBeenCalled();
    expect(spyCreateOscillator).toHaveBeenCalledTimes(1);
    expect(spyCreateOscillator.mock.results[0].value.type).toBe("sine");
    expect(spyCreateOscillator.mock.results[0].value.frequency.value).toBe(frequency);
    expect(mockConnect).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
    expect(mockStop).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(duration));

    expect(mockStop).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  },
);

it("should render as expected when reset", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 12,
  };
  const onDurationComplete = vi.fn();
  const resetTimerInterval = vi.fn().mockReturnValue(timerInterval);

  render(
    <SequentialTimerInterval
      backgroundColor="#ffffff"
      timerInterval={timerInterval}
      onDurationComplete={onDurationComplete}
      resetTimerInterval={resetTimerInterval}
    />,
  );

  const playButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Play" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await playButtonClickEventPromise;

  const advanceTimeInMs = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration - advanceTimeInMs / 1000) }),
  ).toBeInTheDocument();

  const resetButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Reset" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await resetButtonClickEventPromise;

  expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
  expect(spyCreateOscillator).not.toHaveBeenCalled();
  expect(mockConnect).not.toHaveBeenCalled();
  expect(mockStart).not.toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).not.toHaveBeenCalled();
});

it("should render as expected when reset all", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 12,
  };
  const onDurationComplete = vi.fn();
  const updatedTimerInterval: TimerInterval = {
    id: "2",
    title: "Test Interval Update",
    duration: 15,
  };
  const resetTimerInterval = vi.fn().mockReturnValue(updatedTimerInterval);

  render(
    <SequentialTimerInterval
      backgroundColor="#ffffff"
      timerInterval={timerInterval}
      onDurationComplete={onDurationComplete}
      resetTimerInterval={resetTimerInterval}
    />,
  );

  const playButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Play" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await playButtonClickEventPromise;

  const advanceTimeInMs = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration - advanceTimeInMs / 1000) }),
  ).toBeInTheDocument();

  const resetAllButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Reset All" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await resetAllButtonClickEventPromise;

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(updatedTimerInterval.duration) }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
  expect(spyCreateOscillator).not.toHaveBeenCalled();
  expect(mockConnect).not.toHaveBeenCalled();
  expect(mockStart).not.toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).toHaveBeenCalledTimes(1);
});

it("should render as expected when restarted", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 12,
  };
  const onDurationComplete = vi.fn();
  const resetTimerInterval = vi.fn().mockReturnValue(timerInterval);

  render(
    <SequentialTimerInterval
      backgroundColor="#ffffff"
      timerInterval={timerInterval}
      onDurationComplete={onDurationComplete}
      resetTimerInterval={resetTimerInterval}
    />,
  );

  const playButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Play" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await playButtonClickEventPromise;

  const advanceTimeInMs = 1000;
  act(() => {
    vi.advanceTimersByTime(advanceTimeInMs);
  });

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration - advanceTimeInMs / 1000) }),
  ).toBeInTheDocument();

  const restartButtonClickEventPromise = event.click(screen.getByRole("button", { name: "Restart" }));
  await act(() => {
    return vi.advanceTimersToNextTimerAsync();
  });
  await restartButtonClickEventPromise;

  expect(screen.getByRole("heading", { level: 1, name: formatDuration(timerInterval.duration) })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  expect(spyCreateOscillator).not.toHaveBeenCalled();
  expect(mockConnect).not.toHaveBeenCalled();
  expect(mockStart).not.toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();
  expect(onDurationComplete).not.toHaveBeenCalled();
  expect(resetTimerInterval).not.toHaveBeenCalled();
});
