import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { TimerIntervalFormFields } from "./timer-interval-form-fields";

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the form with initial values", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];

  render(<TimerIntervalFormFields timerIntervals={timerIntervals} updateTimerIntervals={vi.fn()} />);

  expect(screen.getAllByRole("textbox", { name: "Label" })).toHaveLength(2);
  expect(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })).toHaveLength(2);
});

it("should add a new timer interval", async () => {
  const event = userEvent.setup();
  const timerIntervals = [{ id: "1", duration: 10, title: "Timer 1" }];
  const updateTimerIntervals = vi.fn();

  render(<TimerIntervalFormFields timerIntervals={timerIntervals} updateTimerIntervals={updateTimerIntervals} />);

  expect(updateTimerIntervals).not.toHaveBeenCalled();

  await event.click(screen.getByRole("button", { name: "Add Timer" }));

  expect(updateTimerIntervals).toHaveBeenCalledWith([
    ...timerIntervals,
    { id: expect.any(String), title: "New timer interval", duration: 60 },
  ]);
});

it("should update a timer interval's title", async () => {
  const event = userEvent.setup();

  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];
  const updateTimerIntervals = vi.fn();

  render(<TimerIntervalFormFields timerIntervals={timerIntervals} updateTimerIntervals={updateTimerIntervals} />);

  expect(updateTimerIntervals).not.toHaveBeenCalled();

  await event.clear(screen.getAllByRole("textbox", { name: "Label" })[0]);

  expect(updateTimerIntervals).toHaveBeenLastCalledWith([{ ...timerIntervals[0], title: "" }, timerIntervals[1]]);

  const nextCharacter = "s";
  await event.type(screen.getAllByRole("textbox", { name: "Label" })[0], nextCharacter);

  expect(updateTimerIntervals).toHaveBeenLastCalledWith([
    { ...timerIntervals[0], title: `${timerIntervals[0].title}${nextCharacter}` },
    timerIntervals[1],
  ]);
});

it("should update a timer interval's duration", async () => {
  const event = userEvent.setup();
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];
  const updateTimerIntervals = vi.fn();

  render(<TimerIntervalFormFields timerIntervals={timerIntervals} updateTimerIntervals={updateTimerIntervals} />);

  expect(updateTimerIntervals).not.toHaveBeenCalled();

  await event.clear(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })[0]);

  expect(updateTimerIntervals).toHaveBeenLastCalledWith([{ ...timerIntervals[0], duration: 0 }, timerIntervals[1]]);

  const nextCharacter = "1";
  await event.type(screen.getAllByRole("spinbutton", { name: "Duration (seconds)" })[0], nextCharacter);

  expect(updateTimerIntervals).toHaveBeenLastCalledWith([
    { ...timerIntervals[0], duration: Number(`${timerIntervals[0].duration}${nextCharacter}`) },
    timerIntervals[1],
  ]);
});

it("should delete a timer interval", async () => {
  const event = userEvent.setup();
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];
  const updateTimerIntervals = vi.fn();

  render(<TimerIntervalFormFields timerIntervals={timerIntervals} updateTimerIntervals={updateTimerIntervals} />);

  await event.click(screen.getAllByRole("button", { name: "Delete Timer" })[0]);

  expect(updateTimerIntervals).toHaveBeenCalledWith([timerIntervals[1]]);
});

it("should disable the delete button when there is only one timer", () => {
  const timerIntervals = [{ id: "1", duration: 10, title: "Timer 1" }];
  const updateTimerIntervals = vi.fn();

  render(<TimerIntervalFormFields timerIntervals={timerIntervals} updateTimerIntervals={updateTimerIntervals} />);

  expect(screen.getByRole("button", { name: "Delete Timer" })).toBeDisabled();
});
