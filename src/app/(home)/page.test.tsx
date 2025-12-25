import { render, screen } from "@testing-library/react";

import { TimersContext } from "@/context";
import type { Timer } from "@/types";

import HomePage from "./page";

it.each([true, false])("should render the home page as expected when timers exist = %s", async (hasTimers) => {
  const timers: Timer[] = hasTimers
    ? [
        {
          id: "1",
          numIterations: 1,
          timerIntervals: [],
          title: "Timer 1",
        },
        {
          id: "2",
          numIterations: 2,
          timerIntervals: [
            {
              id: "1",
              duration: 10,
              title: "Interval 1",
            },
          ],
          title: "Timer 2",
        },
        {
          id: "3",
          numIterations: 3,
          timerIntervals: [
            {
              id: "1",
              duration: 10,
              title: "Interval 1",
            },
            {
              id: "2",
              duration: 20,
              title: "Interval 2",
            },
          ],
          title: "Timer 3",
        },
      ]
    : [];

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <HomePage />
    </TimersContext.Provider>,
  );

  // Use findBy queries to wait for the async component to render
  if (hasTimers) {
    expect(
      (await screen.findAllByRole("link", { name: "Edit" })).map((element) => element.getAttribute("href")),
    ).toEqual(timers.map((timer) => `/${timer.id}/edit`));
    expect(
      (await screen.findAllByRole("link", { name: "Delete" })).map((element) => element.getAttribute("href")),
    ).toEqual(timers.map((timer) => `/${timer.id}/delete`));
  } else {
    expect(screen.queryAllByRole("link", { name: "Edit" })).toHaveLength(0);
    expect(screen.queryAllByRole("link", { name: "Delete" })).toHaveLength(0);
  }
  timers.forEach(async (timer) => {
    expect(
      await screen.findByRole("link", {
        name: `Number of iterations: ${timer.numIterations} ${timer.timerIntervals.map((timerInterval) => `${timerInterval.title} - ${timerInterval.duration} seconds`).join(" ")}`.trim(),
      }),
    ).toHaveAttribute("href", `/${timer.id}`);
  });
  expect(await screen.findByRole("link", { name: "Add new timer" })).toHaveAttribute("href", "/new");
});
