import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { redirect } from "next/navigation";

import { DeleteTimerPrompt } from "./delete-timer-prompt";

let originalWindowLocalStorage: typeof window.localStorage;

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  redirect: vi.fn(),
}));

const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  originalWindowLocalStorage = window.localStorage;
  vi.resetAllMocks();
});

afterEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: originalWindowLocalStorage,
    configurable: true,
  });
});

it("should render the delete timer prompt with the correct title", () => {
  const timers = [
    {
      id: "1",
      initialDuration: 60,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 1",
    },
    {
      id: "2",
      initialDuration: 120,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 2",
    },
  ];

  render(<DeleteTimerPrompt timer={timers[0]} timers={timers} timersKey="timers" />);

  expect(screen.getByRole("heading", { level: 2, name: timers[0].title })).toBeInTheDocument();
});

it("should have cancel button set up to link to '/'", async () => {
  const timers = [
    {
      id: "1",
      initialDuration: 60,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 1",
    },
    {
      id: "2",
      initialDuration: 120,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 2",
    },
  ];

  render(<DeleteTimerPrompt timer={timers[0]} timers={timers} timersKey="timers" />);

  expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/");
});

it("should remove the timer from localStorage and redirect when delete button is clicked", async () => {
  const event = userEvent.setup();
  const timers = [
    {
      id: "1",
      initialDuration: 60,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 1",
    },
    {
      id: "2",
      initialDuration: 120,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 2",
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      setItem: vi.fn(),
    },
    configurable: true,
  });

  render(<DeleteTimerPrompt timer={timers[0]} timers={timers} timersKey="timers" />);

  await event.click(screen.getByRole("button", { name: "Delete" }));

  expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  expect(localStorage.setItem).toHaveBeenCalledWith("timers", JSON.stringify([timers[1]]));
  expect(redirectMock).toHaveBeenCalledWith("/");
});
