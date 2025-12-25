import { render, screen } from "@testing-library/react";

import { Timer } from "@/types";

import { TimerLink } from "./timer-link";

it("should render the timer link with all the correct information and links", () => {
  const timer: Timer = {
    id: "123",
    title: "My Test Timer",
    numIterations: 3,
    timerIntervals: [
      { id: "a", duration: 25, title: "Work" },
      { id: "b", duration: 5, title: "Break" },
    ],
  };

  render(<TimerLink timer={timer} />);

  expect(screen.getByText(timer.title)).toBeInTheDocument();
  expect(screen.getByText(`Number of iterations: ${timer.numIterations}`)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", `/${timer.id}/edit`);
  expect(screen.getByRole("link", { name: "Delete" })).toHaveAttribute("href", `/${timer.id}/delete`);
  expect(
    screen.getByRole("link", {
      name: `Number of iterations: ${timer.numIterations} ${timer.timerIntervals.map((timerInterval) => `${timerInterval.title} - ${timerInterval.duration} seconds`).join(" ")}`,
    }),
  ).toHaveAttribute("href", `/${timer.id}`);
});
