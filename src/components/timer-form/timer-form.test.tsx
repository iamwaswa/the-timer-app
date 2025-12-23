import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { redirect } from "next/navigation";

import { TimersContext } from "@/context";
import { Timer } from "@/types";

import { TimerForm } from "./timer-form";

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  redirect: vi.fn(),
}));

const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render and submit the form with initial values when no timer is provided", async () => {
  const event = userEvent.setup();
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [], updateTimers }}>
      <TimerForm />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("New timer");
  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(1);
  expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue("New timer interval");
  expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toHaveValue(60);
  expect(screen.getByRole("button", { name: "Delete Timer" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Add Timer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Timer" })).toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Create Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([
    {
      id: expect.any(String),
      numIterations: 1,
      title: "New timer",
      timerIntervals: [
        {
          id: expect.any(String),
          duration: 60,
          title: "New timer interval",
        },
      ],
    },
  ]);
});

it("should render and submit the form with initial values when a timer is provided without timer intervals", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
    numIterations: 3,
    timerIntervals: [],
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(timer.title);
  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(timer.numIterations);
  expect(screen.queryByRole("spinbutton", { name: "Label" })).not.toBeInTheDocument();
  expect(screen.queryByRole("spinbutton", { name: "Duration (seconds)" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Delete Timer" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Add Timer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Update Timer" })).toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([timer]);
});

it("should render and submit the form with initial values when a timer is provided with timer intervals", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
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
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(timer.title);
  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(timer.numIterations);
  expect(screen.getAllByRole("textbox", { name: "Label" })).toHaveLength(timer.timerIntervals.length);
  expect(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })).toHaveLength(timer.timerIntervals.length);
  expect(screen.getAllByRole("button", { name: "Delete Timer" })).toHaveLength(timer.timerIntervals.length);
  expect(screen.getByRole("button", { name: "Add Timer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Update Timer" })).toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([timer]);
});

it("should update the title and submit the form", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
    numIterations: 3,
    timerIntervals: [],
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  await event.clear(screen.getByRole("textbox", { name: "Title" }));

  expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("");

  const updatedTitle = "a";
  await event.type(screen.getByRole("textbox", { name: "Title" }), updatedTitle);

  expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(updatedTitle);

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([{ ...timer, title: updatedTitle }]);
});

it("should update the number of iterations and submit the form", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
    numIterations: 3,
    timerIntervals: [],
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  await event.clear(screen.getByRole("spinbutton", { name: "Number of iterations" }));

  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(0);

  const updatedNumberOfIterations = "1";
  await event.type(screen.getByRole("spinbutton", { name: "Number of iterations" }), updatedNumberOfIterations);

  expect(screen.getByRole("spinbutton", { name: "Number of iterations" })).toHaveValue(
    Number(updatedNumberOfIterations),
  );

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([{ ...timer, numIterations: Number(updatedNumberOfIterations) }]);
});

it("should update the timer interval label and submit the form", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
    numIterations: 3,
    timerIntervals: [
      {
        id: "1",
        duration: 10,
        title: "Interval 1",
      },
    ],
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  await event.clear(screen.getByRole("textbox", { name: "Label" }));

  expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue("");

  const updatedLabel = "a";
  await event.type(screen.getByRole("textbox", { name: "Label" }), updatedLabel);

  expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue(updatedLabel);

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([
    { ...timer, timerIntervals: [{ ...timer.timerIntervals[0], title: updatedLabel }] },
  ]);
});

it("should update the timer interval duration and submit the form", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
    numIterations: 3,
    timerIntervals: [
      {
        id: "1",
        duration: 10,
        title: "Interval 1",
      },
    ],
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  await event.clear(screen.getByRole("spinbutton", { name: "Duration (seconds)" }));

  expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toHaveValue(0);

  const updatedDuration = "1";
  await event.type(screen.getByRole("spinbutton", { name: "Duration (seconds)" }), updatedDuration);

  expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toHaveValue(Number(updatedDuration));

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([
    { ...timer, timerIntervals: [{ ...timer.timerIntervals[0], duration: Number(updatedDuration) }] },
  ]);
});

it("should add a timer interval and submit the form", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
    numIterations: 3,
    timerIntervals: [
      {
        id: "1",
        duration: 10,
        title: "Interval 1",
      },
    ],
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  expect(screen.getAllByRole("textbox", { name: "Label" })).toHaveLength(1);
  expect(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })).toHaveLength(1);

  await event.click(screen.getByRole("button", { name: "Add Timer" }));

  expect(screen.getAllByRole("textbox", { name: "Label" })[0]).toHaveValue(timer.timerIntervals[0].title);
  expect(screen.getAllByRole("textbox", { name: "Label" })[1]).toHaveValue("New timer interval");
  expect(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })[0]).toHaveValue(
    timer.timerIntervals[0].duration,
  );
  expect(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })[1]).toHaveValue(60);

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([
    {
      ...timer,
      timerIntervals: [timer.timerIntervals[0], { id: expect.any(String), duration: 60, title: "New timer interval" }],
    },
  ]);
});

it("should delete a timer interval if it is not the only one and submit the form", async () => {
  const event = userEvent.setup();
  const timer: Timer = {
    id: "1",
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
    title: "Test Timer",
  };
  const updateTimers = vi.fn();

  render(
    <TimersContext.Provider value={{ timers: [timer], updateTimers }}>
      <TimerForm timer={timer} />
    </TimersContext.Provider>,
  );

  expect(screen.getAllByRole("button", { name: "Delete Timer" })).toHaveLength(2);

  await event.click(screen.getAllByRole("button", { name: "Delete Timer" })[0]);

  expect(screen.getAllByRole("button", { name: "Delete Timer" })).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Delete Timer" })).toBeDisabled();

  await event.click(screen.getByRole("button", { name: "Update Timer" }));

  expect(redirectMock).toHaveBeenCalledWith("/");
  expect(updateTimers).toHaveBeenCalledTimes(1);
  expect(updateTimers).toHaveBeenCalledWith([
    {
      ...timer,
      timerIntervals: [
        {
          id: "2",
          duration: 20,
          title: "Interval 2",
        },
      ],
    },
  ]);
});
