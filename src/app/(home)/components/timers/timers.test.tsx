import { render, screen } from "@testing-library/react";

import { TimersContext } from "@/context";
import type { Timer } from "@/types";

import { Timers, TimersClientOnlyComponent } from "./timers";

it.each([true, false])("should render as expected when timers exist = %s", (hasTimers) => {
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
  const parentElementId = "parent-element-id";
  const height = 100;

  render(
    <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
      <div className="MuiGrid-container" id={parentElementId}>
        <div className="MuiGrid-root">
          <div>
            <div className="MuiPaper-root" style={{ height }} />
          </div>
          <div />
        </div>
        <Timers parentElementId={parentElementId} />
      </div>
    </TimersContext.Provider>,
  );

  if (hasTimers) {
    expect(screen.getAllByRole("link", { name: "Edit" }).map((element) => element.getAttribute("href"))).toEqual(
      timers.map((timer) => `/${timer.id}/edit`),
    );
    expect(screen.getAllByRole("link", { name: "Delete" }).map((element) => element.getAttribute("href"))).toEqual(
      timers.map((timer) => `/${timer.id}/delete`),
    );
  } else {
    expect(screen.queryAllByRole("link", { name: "Edit" })).toHaveLength(0);
    expect(screen.queryAllByRole("link", { name: "Delete" })).toHaveLength(0);
  }
  timers.forEach((timer) => {
    expect(
      screen.getByRole("link", {
        name: `Number of iterations: ${timer.numIterations} ${timer.timerIntervals.map((timerInterval) => `${timerInterval.title} - ${timerInterval.duration} seconds`).join(" ")}`.trim(),
      }),
    ).toHaveAttribute("href", `/${timer.id}`);
  });
  expect(screen.getByRole("link", { name: "Add new timer" })).toHaveAttribute("href", "/new");
});

it.each([true, false])(
  "should render the client-only component asynchronously as expected when timers exist = %s",
  async (hasTimers) => {
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
    const parentElementId = "parent-element-id";
    const height = 100;

    render(
      <TimersContext.Provider value={{ timers, updateTimers: vi.fn() }}>
        <div className="MuiGrid-container" id={parentElementId}>
          <div className="MuiGrid-root">
            <div>
              <div className="MuiPaper-root" style={{ height }} />
            </div>
            <div />
          </div>
          <TimersClientOnlyComponent parentElementId={parentElementId} />
        </div>
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
  },
);
