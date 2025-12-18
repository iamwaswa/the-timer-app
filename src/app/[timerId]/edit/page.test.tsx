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
  const mockTimers = [
    { id: "1", initialDuration: 60, numIterations: 3, timerConfigs: [], title: "Timer 1" },
    { id: "2", initialDuration: 120, numIterations: 3, timerConfigs: [], title: "Timer 2" },
  ];
  useParamsMock.mockReturnValue({ timerId: mockTimers[0].id });
  useGetTimersContextMock.mockReturnValue(mockTimers);

  render(<EditTimerPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Edit Timer" })).toBeInTheDocument();
  expect(screen.getByTestId("timer-form")).toBeInTheDocument();
});

it("should call notFound when the timer does not exist", () => {
  const mockTimers = [
    { id: "1", initialDuration: 60, numIterations: 3, timerConfigs: [], title: "Timer 1" },
    { id: "2", initialDuration: 120, numIterations: 3, timerConfigs: [], title: "Timer 2" },
  ];
  useParamsMock.mockReturnValue({ timerId: "3" });
  useGetTimersContextMock.mockReturnValue(mockTimers);

  expect(notFoundMock).not.toHaveBeenCalled();

  render(<EditTimerPage />);

  expect(notFoundMock).toHaveBeenCalled();
});
