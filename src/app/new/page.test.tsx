import { render, screen } from "@testing-library/react";

import CreateTimerPage from "./page";

vi.mock("@/components", () => ({
  ...vi.importActual("@/components"),
  TimerForm: () => <div data-testid="timer-form" />,
}));

it("should render the create timer page with the timer form", () => {
  render(<CreateTimerPage />);
  expect(screen.getByRole("heading", { level: 1, name: "Create New Timer" })).toBeInTheDocument();
  expect(screen.getByTestId("timer-form")).toBeInTheDocument();
});
