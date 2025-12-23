import { render, screen } from "@testing-library/react";

import { TimersContext } from "@/context";

import CreateTimerPage from "./page";

it("should render the create timer form as expected", () => {
  render(
    <TimersContext.Provider value={{ timers: [], updateTimers: vi.fn() }}>
      <CreateTimerPage />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("heading", { level: 1, name: "Create New Timer" })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("New timer");
  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(1);
  expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue("New timer interval");
  expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toHaveValue(60);
  expect(screen.getByRole("button", { name: "Delete Timer" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Add Timer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Timer" })).toBeInTheDocument();
});
