import { render } from "@testing-library/react";

import { useTimers } from "@/hooks";

import { Timer } from "../timer";
import { Timers } from "./timers";

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useTimers: vi.fn(),
}));

const useTimersMock = vi.mocked(useTimers);

vi.mock("../timer", () => ({
  ...vi.importActual("../timer"),
  Timer: vi.fn(() => <div data-testid="timer-mock" />),
}));

const TimerMock = vi.mocked(Timer);

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render as expected", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 1,
    numIterationsLeft: 2,
    timerConfigIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerConfig: timerConfigs[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set shouldStartPlaying to false when it's the first timer and the first iteration", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 1,
    numIterationsLeft: 2,
    timerConfigIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerConfig: timerConfigs[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set shouldStartPlaying to true for timers after the first", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 0,
    numIterationsLeft: 2,
    timerConfigIndex: 1,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[0],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerConfig: timerConfigs[1],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set shouldStartPlaying to true for iterations after the first for the first timer", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 1,
    numIterationsLeft: 1,
    timerConfigIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerConfig: timerConfigs[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should show the next timer if there are more iterations", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 0,
    numIterationsLeft: 2,
    timerConfigIndex: 2,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={2} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[0],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerConfig: timerConfigs[2],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should show the next timer if there are more timers in the current iteration", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 1,
    numIterationsLeft: 1,
    timerConfigIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerConfig: timerConfigs[0],
      onResetAll: undefined,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should not show the next timer if it is the last timer of the last iteration", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onTimerFinished = vi.fn();
  const onResetAll = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 0,
    numIterationsLeft: 1,
    timerConfigIndex: 2,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[0],
      shouldShowNextTimer: false,
      shouldStartPlaying: true,
      timerConfig: timerConfigs[2],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should set reset all action when timerConfigIndex > 0", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onResetAll = vi.fn();
  const onTimerFinished = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 2,
    numIterationsLeft: 1,
    timerConfigIndex: 1,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[2],
      shouldShowNextTimer: true,
      shouldStartPlaying: true,
      timerConfig: timerConfigs[1],
      onResetAll,
      onTimerFinished,
    }),
    undefined,
  );
});

it("should not set reset all action when timerConfigIndex is 0", () => {
  const timerConfigs = [
    { id: "1", initialDuration: 10, title: "Timer 1" },
    { id: "2", initialDuration: 20, title: "Timer 2" },
    { id: "3", initialDuration: 30, title: "Timer 3" },
  ];
  const onResetAll = vi.fn();
  const onTimerFinished = vi.fn();
  useTimersMock.mockReturnValue({
    nextTimerConfigIndex: 1,
    numIterationsLeft: 1,
    timerConfigIndex: 0,
    onResetAll,
    onTimerFinished,
  });

  render(<Timers numIterations={1} timerConfigs={timerConfigs} />);

  expect(TimerMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nextTimerConfig: timerConfigs[1],
      shouldShowNextTimer: true,
      shouldStartPlaying: false,
      timerConfig: timerConfigs[0],
      onTimerFinished,
      onResetAll: undefined,
    }),
    undefined,
  );
});
