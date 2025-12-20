import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { TimerInterval } from "@/types";

import { SequentialTimerInterval } from "./sequential-timer-interval";

it("should render the sequential timer interval with the correct title and duration", () => {
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 10,
  };
  const onFinished = vi.fn();
  const onResetAll = vi.fn().mockReturnValue(timerInterval);

  render(
    <SequentialTimerInterval
      timerInterval={timerInterval}
      onAdvanceSequence={onFinished}
      onResetSequence={onResetAll}
    />,
  );

  expect(screen.getByRole("heading", { level: 1, name: "00:00:10" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timerInterval.title })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Restart" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset All" })).toBeInTheDocument();
});

it("should render the sequential timer interval as expected when played and paused", async () => {
  const event = userEvent.setup();
  const timerInterval: TimerInterval = {
    id: "1",
    title: "Test Interval",
    duration: 20,
  };
  const onFinished = vi.fn();
  const onResetAll = vi.fn();

  render(
    <SequentialTimerInterval
      timerInterval={timerInterval}
      onAdvanceSequence={onFinished}
      onResetSequence={onResetAll}
    />,
  );

  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Play" }));

  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Pause" }));

  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
});
