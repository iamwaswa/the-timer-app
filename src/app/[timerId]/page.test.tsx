import { render, screen } from "@testing-library/react";
import { notFound, useParams } from "next/navigation";

import { useGetTimersContext } from "@/context";
import { TimerType } from "@/types";

import TimerPage from "./page";

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

vi.mock("./components", () => ({
  ...vi.importActual("./components"),
  SequentialTimerIntervals: vi.fn(() => <div data-testid="sequential-timer-intervals" />),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render as expected when the timer exists", () => {
  const timers: TimerType[] = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });
  useGetTimersContextMock.mockReturnValue(timers);

  render(<TimerPage />);

  expect(screen.getByTestId("sequential-timer-intervals")).toBeInTheDocument();
});

it("should call notFound when the timer does not exist", () => {
  const timers: TimerType[] = [
    {
      id: "1",
      numIterations: 3,
      timerIntervals: [],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: "non-existent-timer" });
  useGetTimersContextMock.mockReturnValue(timers);

  expect(notFoundMock).not.toHaveBeenCalled();

  render(<TimerPage />);

  expect(notFoundMock).toHaveBeenCalled();
});
