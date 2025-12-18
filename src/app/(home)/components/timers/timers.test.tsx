import { render, screen } from "@testing-library/react";

import { useGetTimersContext } from "@/context";
import { useGetItemHeight } from "@/hooks";

import { Timers, TimersClientOnlyComponent } from "./timers";

vi.mock("@/context", () => ({
  ...vi.importActual("@/context"),
  useGetTimersContext: vi.fn(),
}));

const useGetTimersContextMock = vi.mocked(useGetTimersContext);

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useGetItemHeight: vi.fn(),
}));

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
  useGetTimersContextMock.mockReturnValue(mockTimers);
  useGetItemHeightMock.mockReturnValue(100);

  render(<Timers parentElementId="test-parent" />);

  expect(screen.getAllByTestId("timer-link")).toHaveLength(mockTimers.length);
  expect(screen.getByTestId("add-new-timer")).toBeInTheDocument();
});

it("should render no timers if there are none", () => {
  useGetTimersContextMock.mockReturnValue([]);
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
  useGetTimersContextMock.mockReturnValue(mockTimers);
  useGetItemHeightMock.mockReturnValue(100);

  render(<TimersClientOnlyComponent parentElementId="test-parent" />);

  // Use findBy queries to wait for the async component to render
  expect(await screen.findAllByTestId("timer-link")).toHaveLength(mockTimers.length);
  expect(await screen.findByTestId("add-new-timer")).toBeInTheDocument();
});
