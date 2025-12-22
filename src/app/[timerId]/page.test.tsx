import { render, screen } from "@testing-library/react";
import { notFound, useParams } from "next/navigation";

import { TimersContext } from "@/context";
import type { Timer } from "@/types";

import TimerPage from "./page";

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  useParams: vi.fn(),
  notFound: vi.fn(),
}));

const useParamsMock = vi.mocked(useParams);

const notFoundMock = vi.mocked(notFound);

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("should render as expected when a single timer interval exists", () => {
  const timers: Timer[] = [
    {
      id: "1",
      numIterations: 1,
      timerIntervals: [
        {
          id: "1",
          duration: 10,
          title: "Work",
        },
      ],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <TimerPage />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("heading", { level: 1, name: "00:00:10" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timers[0].timerIntervals[0].title })).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("should render as expected when more than one timer interval exists", () => {
  const timers: Timer[] = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [
        {
          id: "1",
          duration: 10,
          title: "Work",
        },
        {
          id: "2",
          duration: 10,
          title: "Home",
        },
      ],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <TimerPage />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("heading", { level: 1, name: "00:00:10" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: timers[0].timerIntervals[0].title })).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(`Up next: ${timers[0].timerIntervals[1].title}`);
});

it("should call notFound when the timer does not exist", () => {
  const timers: Timer[] = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: "non-existent-timer" });

  expect(notFoundMock).not.toHaveBeenCalled();

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <TimerPage />
    </TimersContext.Provider>,
  );

  expect(notFoundMock).toHaveBeenCalled();
});
