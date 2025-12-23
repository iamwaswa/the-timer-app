import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { DeleteTimerPrompt } from "./delete-timer-prompt";

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the Delete Timer prompt with the correct title", () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 2",
    },
  ];

  render(<DeleteTimerPrompt timer={timers[0]} timers={timers} setTimers={vi.fn()} />);

  expect(screen.getByRole("heading", { level: 2, name: timers[0].title })).toBeInTheDocument();
});

it("should have cancel button set up to link to '/'", async () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 2",
    },
  ];

  render(<DeleteTimerPrompt timer={timers[0]} timers={timers} setTimers={vi.fn()} />);

  expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/");
});

it("should remove the timer when delete button is clicked", async () => {
  const setTimers = vi.fn();
  const event = userEvent.setup();
  const timers = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 2",
    },
  ];

  render(<DeleteTimerPrompt timer={timers[0]} timers={timers} setTimers={setTimers} />);

  expect(setTimers).not.toHaveBeenCalled();

  await event.click(screen.getByRole("button", { name: "Delete" }));

  expect(setTimers).toHaveBeenCalledTimes(1);
  expect(setTimers).toHaveBeenCalledWith([timers[1]]);
});
