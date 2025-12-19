import { render, screen } from "@testing-library/react";

import { useSequentialTimerIntervals } from "@/hooks";

import { SequentialTimerInterval } from "../sequential-timer-interval";
import { TimerIntervals } from "./timer-intervals";

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useSequentialTimerIntervals: vi.fn(),
}));

const useSequentialTimerIntervalsMock = vi.mocked(useSequentialTimerIntervals);

vi.mock("../sequential-timer-interval", () => ({
  ...vi.importActual("../sequential-timer-interval"),
  SequentialTimerInterval: vi.fn(() => <div data-testid="sequential-timer-interval" />),
}));

const SequentialTimerIntervalMock = vi.mocked(SequentialTimerInterval);

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

  render(<TimerIntervals numIterations={2} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={2} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={2} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={2} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={2} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
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

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(SequentialTimerIntervalMock).toHaveBeenCalledWith(
    expect.objectContaining({
      shouldStartPlaying: false,
      timerInterval: timerIntervals[0],
      onTimerFinished,
      onResetAll: undefined,
    }),
    undefined,
  );
});

it("should show the next timer snackbar when one iteration is left and this is not the last timer interval", () => {
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

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(screen.getByText("Up next: Timer 2")).toBeInTheDocument();
});

it("should show the next timer snackbar when one iteration is left and this is not the last timer interval", () => {
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

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(screen.getByText("Up next: Timer 2")).toBeInTheDocument();
});

it("should show the next timer snackbar when more than one iteration is left", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
    { id: "3", duration: 30, title: "Timer 3" },
  ];
  const onResetAll = vi.fn();
  const onTimerFinished = vi.fn();
  useSequentialTimerIntervalsMock.mockReturnValue({
    nextTimerIntervalIndex: 1,
    numIterationsLeft: 2,
    currentTimerIntervalIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<TimerIntervals numIterations={1} timerIntervals={timerIntervals} />);

  expect(screen.getByText("Up next: Timer 2")).toBeInTheDocument();
});
