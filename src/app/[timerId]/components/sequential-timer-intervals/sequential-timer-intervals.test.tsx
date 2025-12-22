import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { TimerInterval } from "@/types";
import { formatDuration } from "@/utils";

import { SequentialTimerIntervals } from "./sequential-timer-intervals";

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

it("should render the first timer interval and show the next one as a notification", () => {
  const timerIntervals: TimerInterval[] = [
    {
      id: "1",
      title: "First Interval",
      duration: 10,
    },
    {
      id: "2",
      title: "Second Interval",
      duration: 20,
    },
  ];
  const numIterations = 1;

  render(<SequentialTimerIntervals timerIntervals={timerIntervals} numIterations={numIterations} />);

  expect(screen.getByRole("heading", { level: 1, name: "00:00:10" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timerIntervals[0].title })).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(`Up next: ${timerIntervals[1].title}`);
});

it("should not render the next timer interval notification if there is only one timer interval", () => {
  const timerIntervals: TimerInterval[] = [
    {
      id: "1",
      title: "Single Interval",
      duration: 10,
    },
  ];
  const numIterations = 1;

  render(<SequentialTimerIntervals timerIntervals={timerIntervals} numIterations={numIterations} />);

  expect(screen.getByRole("heading", { level: 1, name: "00:00:10" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timerIntervals[0].title })).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("should advance the sequence and pause when the timer interval completes", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const timerIntervals: TimerInterval[] = [
    {
      id: "1",
      title: "First Interval",
      duration: 1,
    },
  ];
  const numIterations = 1;

  render(<SequentialTimerIntervals timerIntervals={timerIntervals} numIterations={numIterations} />);

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

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerIntervals[0].duration) }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  expect(spyCreateOscillator).toHaveBeenCalledTimes(1);
  expect(mockConnect).toHaveBeenCalled();
  expect(mockStart).toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(timerIntervals[0].duration * 1000);
  });

  expect(screen.getByRole("heading", { level: 1, name: formatDuration(0) })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
  expect(mockStop).toHaveBeenCalledTimes(1);
  expect(mockClose).toHaveBeenCalledTimes(1);
});

it("should advance the sequence and restart when the timer interval completes", async () => {
  Object.defineProperty(window, "AudioContext", {
    value: MockAudioContext,
    configurable: true,
    writable: true,
  });
  const spyCreateOscillator = vi.spyOn(MockAudioContext.prototype, "createOscillator");
  const event = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const timerIntervals: TimerInterval[] = [
    {
      id: "1",
      title: "First Interval",
      duration: 1,
    },
    {
      id: "2",
      title: "Second Interval",
      duration: 20,
    },
  ];
  const numIterations = 1;

  render(<SequentialTimerIntervals timerIntervals={timerIntervals} numIterations={numIterations} />);

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

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerIntervals[0].duration) }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  expect(spyCreateOscillator).toHaveBeenCalledTimes(1);
  expect(mockConnect).toHaveBeenCalled();
  expect(mockStart).toHaveBeenCalled();
  expect(mockStop).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(timerIntervals[0].duration * 1000);
  });

  expect(
    screen.getByRole("heading", { level: 1, name: formatDuration(timerIntervals[1].duration) }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  expect(mockStop).toHaveBeenCalledTimes(1);
  expect(mockClose).toHaveBeenCalledTimes(1);
});
