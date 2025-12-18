import { render, screen } from "@testing-library/react";

import { TimerLink } from "./timer-link";

it("should render the timer link with all the correct information and links", () => {
  const mockTimer = {
    id: "123",
    title: "My Test Timer",
    numIterations: 3,
    timerIntervals: [
      { id: "a", duration: 25, title: "Work" },
      { id: "b", duration: 5, title: "Break" },
    ],
  };

  render(<TimerLink timer={mockTimer} />);

  expect(screen.getByText(mockTimer.title)).toBeInTheDocument();
  expect(screen.getByText(`Number of iterations: ${mockTimer.numIterations}`)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", `/${mockTimer.id}/edit`);
  expect(screen.getByRole("link", { name: "Delete" })).toHaveAttribute("href", `/${mockTimer.id}/delete`);
  expect(
    screen.getByRole("link", {
      name: `Number of iterations: ${mockTimer.numIterations} ${mockTimer.timerIntervals.map((timerInterval) => `${timerInterval.title} - ${timerInterval.duration} seconds`).join(" ")}`,
    }),
  ).toHaveAttribute("href", `/${mockTimer.id}`);
});
