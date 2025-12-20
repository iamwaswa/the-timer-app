import { render, screen } from "@testing-library/react";

import type { TimerInterval } from "@/types";

import { SequentialTimerIntervals } from "./sequential-timer-intervals";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
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
