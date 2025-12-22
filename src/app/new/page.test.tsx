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
  expect(screen.getAllByRole("textbox", { name: "Title" })[0]).toHaveValue("New timer");
  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(1);
  expect(screen.getAllByRole("textbox", { name: "Title" })[1]).toHaveValue("New interval");
  expect(screen.getByRole("spinbutton", { name: "Initial Duration (seconds)" })).toHaveValue(60);
  expect(screen.getByRole("button", { name: "Delete timer" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Add Timer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Timer" })).toBeInTheDocument();
});
