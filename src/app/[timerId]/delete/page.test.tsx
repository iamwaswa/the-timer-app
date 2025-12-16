import { render, screen } from "@testing-library/react";
import { notFound, useParams } from "next/navigation";

import { useGetTimers } from "@/hooks";

import DeleteTimerPage from "./page";

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  useParams: vi.fn(),
  notFound: vi.fn(),
}));

const useParamsMock = vi.mocked(useParams);

const notFoundMock = vi.mocked(notFound);

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useGetTimers: vi.fn(),
}));

const useGetTimersMock = vi.mocked(useGetTimers);

vi.mock("./components", () => ({
  ...vi.importActual("./components"),
  DeleteTimerPrompt: vi.fn(() => <div data-testid="delete-timer-prompt" />),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render DeleteTimerPrompt when timer is found", () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      initialDuration: 60,
      timerConfigs: [],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      initialDuration: 120,
      timerConfigs: [],
      title: "Timer 2",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: "1" });
  useGetTimersMock.mockReturnValue([timers, "timers-key"]);

  render(<DeleteTimerPage />);

  expect(screen.getByTestId("delete-timer-prompt")).toBeInTheDocument();
});

it("should call notFound when timer is not found", () => {
  const timers = [
    {
      id: "1",
      numIterations: 3,
      initialDuration: 60,
      timerConfigs: [],
      title: "Timer 1",
    },
    {
      id: "2",
      numIterations: 3,
      initialDuration: 120,
      timerConfigs: [],
      title: "Timer 2",
    },
  ];
  useParamsMock.mockReturnValue({ timerId: "3" });
  useGetTimersMock.mockReturnValue([timers, "timers-key"]);

  render(<DeleteTimerPage />);

  expect(notFoundMock).toHaveBeenCalled();
});
