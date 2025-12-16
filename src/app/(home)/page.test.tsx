import { render, screen } from "@testing-library/react";

import HomePage from "./page";

vi.mock("./components", () => ({
  ...vi.importActual("./components"),
  TimersClientOnlyComponent: vi.fn(() => <div data-testid="timers-client-only-component" />),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it("HomePage should render TimersClientOnlyComponent", () => {
  render(<HomePage />);
  expect(screen.getByTestId("timers-client-only-component")).toBeInTheDocument();
});
