import { render, screen } from "@testing-library/react";
import { redirect, useParams } from "next/navigation";

import { useTimersContext } from "@/context";

import DeleteTimerPage from "./page";

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  redirect: vi.fn(),
  useParams: vi.fn(),
}));

const redirectMock = vi.mocked(redirect);

const useParamsMock = vi.mocked(useParams);

vi.mock("@/context", () => ({
  ...vi.importActual("@/context"),
  useTimersContext: vi.fn(),
}));

const useTimersContextMock = vi.mocked(useTimersContext);

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
  useTimersContextMock.mockReturnValue([timers, vi.fn()]);

  render(<DeleteTimerPage />);

  expect(screen.getByTestId("delete-timer-prompt")).toBeInTheDocument();
});

it('should redirect to "/" when timer is not found', () => {
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
  useTimersContextMock.mockReturnValue([timers, vi.fn()]);

  expect(redirectMock).not.toHaveBeenCalled();

  render(<DeleteTimerPage />);

  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith("/");
});
