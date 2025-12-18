import { render, screen } from "@testing-library/react";
import { notFound, useParams } from "next/navigation";

import { useGetTimersContext } from "@/context";

import EditTimerPage from "./page";

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  useParams: vi.fn(),
  notFound: vi.fn(),
}));

const useParamsMock = vi.mocked(useParams);

const notFoundMock = vi.mocked(notFound);

vi.mock("@/context", () => ({
  ...vi.importActual("@/context"),
  useGetTimersContext: vi.fn(),
}));

const useGetTimersContextMock = vi.mocked(useGetTimersContext);

vi.mock("@/components", () => ({
  ...vi.importActual("@/components"),
  TimerForm: vi.fn(() => <div data-testid="timer-form" />),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the edit timer form with the correct timer data", () => {
  const timers = [
    { id: "1", numIterations: 3, timerIntervals: [], title: "Timer 1" },
    { id: "2", numIterations: 3, timerIntervals: [], title: "Timer 2" },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });
  useGetTimersContextMock.mockReturnValue(timers);

  render(<EditTimerPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Edit Timer" })).toBeInTheDocument();
  expect(screen.getByTestId("timer-form")).toBeInTheDocument();
});

it("should call notFound when the timer does not exist", () => {
  const timers = [
    { id: "1", numIterations: 3, timerIntervals: [], title: "Timer 1" },
    { id: "2", numIterations: 3, timerIntervals: [], title: "Timer 2" },
  ];
  useParamsMock.mockReturnValue({ timerId: "3" });
  useGetTimersContextMock.mockReturnValue(timers);

  expect(notFoundMock).not.toHaveBeenCalled();

  render(<EditTimerPage />);

  expect(notFoundMock).toHaveBeenCalled();
});
