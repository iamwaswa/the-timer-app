import { render, screen } from "@testing-library/react";

import { useGetItemHeight, useGetTimers } from "@/hooks";

import { Timers, TimersClientOnlyComponent } from "./timers";

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useGetTimers: vi.fn(),
  useGetItemHeight: vi.fn(),
}));

const useGetTimersMock = vi.mocked(useGetTimers);

const useGetItemHeightMock = vi.mocked(useGetItemHeight);

vi.mock("../add-new-timer", () => ({
  ...vi.importActual("../add-new-timer"),
  AddNewTimer: () => <div data-testid="add-new-timer" />,
}));

vi.mock("../timer-link", () => ({
  ...vi.importActual("../timer-link"),
  TimerLink: () => <div data-testid="timer-link" />,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render a list of timers and the add new timer button", () => {
  const mockTimers = [
    {
      id: "1",
      title: "Timer 1",
      numIterations: 1,
      timerConfigs: [],
    },
    {
      id: "2",
      title: "Timer 2",
      numIterations: 2,
      timerConfigs: [],
    },
  ];
  useGetTimersMock.mockReturnValue([mockTimers, ""]);
  useGetItemHeightMock.mockReturnValue(100);

  render(<Timers parentElementId="test-parent" />);

  expect(screen.getAllByTestId("timer-link")).toHaveLength(mockTimers.length);
  expect(screen.getByTestId("add-new-timer")).toBeInTheDocument();
});

it("should render no timers if there are none", () => {
  useGetTimersMock.mockReturnValue([[], ""]);
  useGetItemHeightMock.mockReturnValue(100);

  render(<Timers parentElementId="test-parent" />);

  expect(screen.queryAllByTestId("timer-link")).toHaveLength(0);
  expect(screen.getByTestId("add-new-timer")).toBeInTheDocument();
});

it("should render the client-only component asynchronously", async () => {
  const mockTimers = [
    {
      id: "1",
      title: "Timer 1",
      numIterations: 1,
      timerConfigs: [],
    },
    {
      id: "2",
      title: "Timer 2",
      numIterations: 2,
      timerConfigs: [],
    },
  ];
  useGetTimersMock.mockReturnValue([mockTimers, ""]);
  useGetItemHeightMock.mockReturnValue(100);

  render(<TimersClientOnlyComponent parentElementId="test-parent" />);

  // Use findBy queries to wait for the async component to render
  expect(await screen.findAllByTestId("timer-link")).toHaveLength(mockTimers.length);
  expect(await screen.findByTestId("add-new-timer")).toBeInTheDocument();
});
