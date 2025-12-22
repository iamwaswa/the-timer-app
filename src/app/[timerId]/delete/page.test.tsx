import { render, screen } from "@testing-library/react";
import { redirect, useParams } from "next/navigation";

import { TimersContext } from "@/context";

import DeleteTimerPage from "./page";

let originalWindowLocalStorage: typeof window.localStorage;

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  redirect: vi.fn(),
  useParams: vi.fn(),
}));

const redirectMock = vi.mocked(redirect);

const useParamsMock = vi.mocked(useParams);

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

it("should render the page as expected when the timer id is valid", () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [
        {
          id: "1",
          duration: 12,
          title: "Timer Interval 1",
        },
      ],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      timerIntervals: [
        {
          id: "1",
          duration: 12,
          title: "Timer Interval 1",
        },
      ],
      title: "Timer 2",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <DeleteTimerPage />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("dialog", { name: timers[0].title })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timers[0].title })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
});

it('should redirect to "/" when the timer id is invalid', () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [
        {
          id: "1",
          duration: 12,
          title: "Timer Interval 1",
        },
      ],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      timerIntervals: [
        {
          id: "1",
          duration: 12,
          title: "Timer Interval 1",
        },
      ],
      title: "Timer 2",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: "non-existent-timer-id" });

  expect(redirectMock).not.toHaveBeenCalled();

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <DeleteTimerPage />
    </TimersContext.Provider>,
  );

  expect(screen.queryByRole("dialog", { name: timers[0].title })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { level: 2, name: timers[0].title })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Cancel" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith("/");
});
