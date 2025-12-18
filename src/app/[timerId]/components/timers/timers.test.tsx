import { render } from "@testing-library/react";

import { useSequentialTimerIntervals } from "@/hooks";

import { Timer } from "../timer";
import { Timers } from "./timers";

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useSequentialTimerIntervals: vi.fn(),
}));

const useSequentialTimerIntervalsMock = vi.mocked(useSequentialTimerIntervals);

vi.mock("../timer", () => ({
  ...vi.importActual("../timer"),
  Timer: vi.fn(() => <div data-testid="timer-mock" />),
}));

const TimerMock = vi.mocked(Timer);

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render as expected", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 1,
    numIterationsLeft: 2,
    currentTimerIntervalIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerInterval: timerIntervals[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set shouldStartPlaying to false when it's the first timer and the first iteration", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 1,
    numIterationsLeft: 2,
    currentTimerIntervalIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerInterval: timerIntervals[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set shouldStartPlaying to true for timers after the first", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 0,
    numIterationsLeft: 2,
    currentTimerIntervalIndex: 1,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[0],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerInterval: timerIntervals[1],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set shouldStartPlaying to true for iterations after the first for the first timer", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 1,
    numIterationsLeft: 1,
    currentTimerIntervalIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerInterval: timerIntervals[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should show the next timer if there are more iterations", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 0,
    numIterationsLeft: 2,
    currentTimerIntervalIndex: 2,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[0],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerInterval: timerIntervals[2],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should show the next timer if there are more timers in the current iteration", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 1,
    numIterationsLeft: 1,
    currentTimerIntervalIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerInterval: timerIntervals[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should not show the next timer if it is the last timer of the last iteration", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 0,
    numIterationsLeft: 1,
    currentTimerIntervalIndex: 2,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[0],
      shouldShowNextTimer: false,
      shouldStartPlaying: true,
      timerInterval: timerIntervals[2],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set reset all action when timerIntervalIndex > 0", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onResetAll = vi.fn();
  const onTimerFinished = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 2,
    numIterationsLeft: 1,
    currentTimerIntervalIndex: 1,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[2],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerInterval: timerIntervals[1],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should not set reset all action when timerIntervalIndex is 0", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onResetAll = vi.fn();
  const onTimerFinished = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 1,
    numIterationsLeft: 1,
    currentTimerIntervalIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerIntervals={timerIntervals} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerInterval: timerIntervals[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerInterval: timerIntervals[0],
      onTimerFinished,
      onResetAll: undefined,
    }),
    undefined,
  );
});
