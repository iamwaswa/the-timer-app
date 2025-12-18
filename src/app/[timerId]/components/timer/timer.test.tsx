import { render, screen } from "@testing-library/react";

import { useTimerInterval } from "@/hooks";
import { formatDuration, pickTimerColor } from "@/utils";

import { TimerActions } from "../timer-actions";
import { TimerDuration } from "../timer-duration";
import { TimerTitle } from "../timer-title";
import { Timer } from "./timer";

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useTimerInterval: vi.fn(),
  usePlayCountdownBeep: vi.fn(),
}));

const useTimerIntervalMock = vi.mocked(useTimerInterval);

vi.mock("@/utils", () => ({
  ...vi.importActual("@/utils"),
  formatDuration: vi.fn(),
  pickTimerColor: vi.fn(),
}));

const formatDurationMock = vi.mocked(formatDuration);

const pickTimerColorMock = vi.mocked(pickTimerColor);

vi.mock("../timer-actions", () => ({
  ...vi.importActual("../timer-actions"),
  TimerActions: vi.fn(),
}));

const TimerActionsMock = vi.mocked(TimerActions);

vi.mock("../timer-duration", () => ({
  ...vi.importActual("../timer-duration"),
  TimerDuration: vi.fn(),
}));

const TimerDurationMock = vi.mocked(TimerDuration);

vi.mock("../timer-title", () => ({
  ...vi.importActual("../timer-title"),
  TimerTitle: vi.fn(),
}));

const TimerTitleMock = vi.mocked(TimerTitle);

const onTimerFinished = vi.fn();

const onResetAll = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

it.each([true, false])(
  "should render the timer with the correct title and duration when isPlaying = %s",
  (isPlaying) => {
    const useTimerMockResult = {
      duration: 10,
      isFinished: false,
      isPlaying,
      resetOrRestartToggle: false,
      pause: vi.fn(),
      play: vi.fn(),
      reset: vi.fn(),
      restart: vi.fn(),
    };
    useTimerIntervalMock.mockReturnValue(useTimerMockResult);
    formatDurationMock.mockReturnValue("00:10");
    const backgroundColor = "red";
    pickTimerColorMock.mockReturnValue(backgroundColor);

    const timerConfig = {
      id: "1",
      title: "Timer 1",
      initialDuration: 10,
    };

    const nextTimerConfig = {
      id: "2",
      title: "Timer 2",
      initialDuration: 20,
    };

    render(
      <Timer
        nextTimerConfig={nextTimerConfig}
        shouldStartPlaying={false}
        shouldShowNextTimer={false}
        timerConfig={timerConfig}
        onResetAll={onResetAll}
        onTimerFinished={onTimerFinished}
      />,
    );

    expect(TimerTitleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        backgroundColor,
        children: "Timer 1",
      }),
      undefined,
    );
    expect(TimerDurationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        children: "00:10",
      }),
      undefined,
    );
  },
);

it("should call onTimerFinished when the timer is finished", () => {
  const useTimerMockResult = {
    duration: 10,
    isFinished: true,
    isPlaying: false,
    resetOrRestartToggle: false,
    pause: vi.fn(),
    play: vi.fn(),
    reset: vi.fn(),
    restart: vi.fn(),
  };
  useTimerIntervalMock.mockReturnValue(useTimerMockResult);
  formatDurationMock.mockReturnValue("00:10");
  pickTimerColorMock.mockReturnValue("red");

  const timerConfig = {
    id: "1",
    title: "Timer 1",
    initialDuration: 10,
  };

  const nextTimerConfig = {
    id: "2",
    title: "Timer 2",
    initialDuration: 20,
  };

  render(
    <Timer
      nextTimerConfig={nextTimerConfig}
      shouldStartPlaying={false}
      shouldShowNextTimer={false}
      timerConfig={timerConfig}
      onResetAll={onResetAll}
      onTimerFinished={onTimerFinished}
    />,
  );

  expect(onTimerFinished).toHaveBeenCalled();
});

it("should show the next timer snackbar when shouldShowNextTimer is true", () => {
  const useTimerMockResult = {
    duration: 10,
    isFinished: true,
    isPlaying: false,
    resetOrRestartToggle: false,
    pause: vi.fn(),
    play: vi.fn(),
    reset: vi.fn(),
    restart: vi.fn(),
  };
  useTimerIntervalMock.mockReturnValue(useTimerMockResult);
  formatDurationMock.mockReturnValue("00:10");
  pickTimerColorMock.mockReturnValue("red");

  const timerConfig = {
    id: "1",
    title: "Timer 1",
    initialDuration: 10,
  };

  const nextTimerConfig = {
    id: "2",
    title: "Timer 2",
    initialDuration: 20,
  };

  render(
    <Timer
      nextTimerConfig={nextTimerConfig}
      shouldStartPlaying={false}
      shouldShowNextTimer={true}
      timerConfig={timerConfig}
      onResetAll={onResetAll}
      onTimerFinished={onTimerFinished}
    />,
  );

  expect(onTimerFinished).toHaveBeenCalledTimes(1);

  expect(screen.getByText("Up next: Timer 2")).toBeInTheDocument();
});

it("should not show the next timer snackbar when shouldShowNextTimer is false", () => {
  const useTimerMockResult = {
    duration: 10,
    isFinished: false,
    isPlaying: false,
    resetOrRestartToggle: false,
    pause: vi.fn(),
    play: vi.fn(),
    reset: vi.fn(),
    restart: vi.fn(),
  };
  useTimerIntervalMock.mockReturnValue(useTimerMockResult);
  formatDurationMock.mockReturnValue("00:10");
  pickTimerColorMock.mockReturnValue("red");

  const timerConfig = {
    id: "1",
    title: "Timer 1",
    initialDuration: 10,
  };

  const nextTimerConfig = {
    id: "2",
    title: "Timer 2",
    initialDuration: 20,
  };

  render(
    <Timer
      nextTimerConfig={nextTimerConfig}
      shouldStartPlaying={false}
      shouldShowNextTimer={false}
      timerConfig={timerConfig}
      onResetAll={onResetAll}
      onTimerFinished={onTimerFinished}
    />,
  );

  expect(screen.queryByText("Up next: Timer 2")).not.toBeInTheDocument();
});

it("should pass the correct props to TimerActions", () => {
  const useTimerMockResult = {
    duration: 10,
    isFinished: false,
    isPlaying: false,
    resetOrRestartToggle: false,
    pause: vi.fn(),
    play: vi.fn(),
    reset: vi.fn(),
    restart: vi.fn(),
  };
  useTimerIntervalMock.mockReturnValue(useTimerMockResult);
  formatDurationMock.mockReturnValue("00:10");
  const backgroundColor = "red";
  pickTimerColorMock.mockReturnValue(backgroundColor);

  const timerConfig = {
    id: "1",
    title: "Timer 1",
    initialDuration: 10,
  };

  const nextTimerConfig = {
    id: "2",
    title: "Timer 2",
    initialDuration: 20,
  };

  render(
    <Timer
      nextTimerConfig={nextTimerConfig}
      shouldStartPlaying={false}
      shouldShowNextTimer={false}
      timerConfig={timerConfig}
      onResetAll={onResetAll}
      onTimerFinished={onTimerFinished}
    />,
  );

  expect(TimerActionsMock).toHaveBeenCalledWith(
    expect.objectContaining({
      backgroundColor,
      isPlaying: useTimerMockResult.isPlaying,
      pause: useTimerMockResult.pause,
      play: useTimerMockResult.play,
      reset: useTimerMockResult.reset,
      restart: useTimerMockResult.restart,
      resetAll: onResetAll,
    }),
    undefined,
  );
});
