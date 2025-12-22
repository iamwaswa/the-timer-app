import { render, screen } from "@testing-library/react";
import { notFound, useParams } from "next/navigation";

import { TimersContext } from "@/context";

import EditTimerPage from "./page";

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  notFound: vi.fn(),
  useParams: vi.fn(),
}));

const notFoundMock = vi.mocked(notFound);

const useParamsMock = vi.mocked(useParams);

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the edit timer form as expected", () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [
        { id: "1", duration: 10, title: "Timer 1" },
        { id: "2", duration: 20, title: "Timer 2" },
      ],
      title: "Timer 1",
    },
    { id: "2", numIterations: 3, timerIntervals: [], title: "Timer 2" },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <EditTimerPage />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("heading", { level: 1, name: "Edit Timer" })).toBeInTheDocument();
  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Delete timer" })).toHaveLength(timers[0].timerIntervals.length);
  expect(screen.getByRole("button", { name: "Add Timer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Update Timer" })).toBeInTheDocument();
});

it("should call notFound when the timer does not exist", () => {
  const timers = [
    { id: "1", numIterations: 3, timerIntervals: [], title: "Timer 1" },
    { id: "2", numIterations: 3, timerIntervals: [], title: "Timer 2" },
  ];
  useParamsMock.mockReturnValue({ timerId: "3" });

  expect(notFoundMock).not.toHaveBeenCalled();

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <EditTimerPage />
    </TimersContext.Provider>,
  );

  expect(notFoundMock).toHaveBeenCalled();
});
