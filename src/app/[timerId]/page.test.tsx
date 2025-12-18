import { render, screen } from "@testing-library/react";
import { notFound, useParams } from "next/navigation";

import { useGetTimersContext } from "@/context";

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
  Timers: vi.fn(() => <div data-testid="timers" />),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the Timers component when timer is found", () => {
  const timers = [
    {
      id: "1",
      initialDuration: 60,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: timers[0].id });
  useGetTimersContextMock.mockReturnValue(timers);

  render(<TimerPage />);

  expect(screen.getByTestId("timers")).toBeInTheDocument();
});

it("should call notFound when timer is not found", () => {
  const timers = [
    {
      id: "1",
      initialDuration: 60,
      numIterations: 3,
      timerConfigs: [],
      title: "Timer 1",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: "non-existent-timer" });
  useGetTimersContextMock.mockReturnValue(timers);

  expect(notFoundMock).not.toHaveBeenCalled();

  render(<TimerPage />);

  expect(notFoundMock).toHaveBeenCalled();
});
