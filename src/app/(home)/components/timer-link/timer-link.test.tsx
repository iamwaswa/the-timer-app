import { render, screen } from "@testing-library/react";

import { TimerLink } from "./timer-link";

it("should render the timer link with all the correct information and links", () => {
  const mockTimer = {
    id: "123",
    title: "My Test Timer",
    numIterations: 3,
    timerConfigs: [
      { id: "a", title: "Work", initialDuration: 25 },
      { id: "b", title: "Break", initialDuration: 5 },
    ],
  };

  render(<TimerLink timer={mockTimer} />);

  expect(screen.getByText(mockTimer.title)).toBeInTheDocument();
  expect(screen.getByText(`Number of iterations: ${mockTimer.numIterations}`)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", `/${mockTimer.id}/edit`);
  expect(screen.getByRole("link", { name: "Delete" })).toHaveAttribute("href", `/${mockTimer.id}/delete`);
  expect(
    screen.getByRole("link", {
      name: `Number of iterations: ${mockTimer.numIterations} ${mockTimer.timerConfigs.map((config) => `${config.title} - ${config.initialDuration} seconds`).join(" ")}`,
    }),
  ).toHaveAttribute("href", `/${mockTimer.id}`);
});
