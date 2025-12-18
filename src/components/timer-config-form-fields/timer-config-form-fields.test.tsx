import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { generateRandomUUID } from "@/utils";

import { TimerConfigFormFields } from "./timer-config-form-fields";

vi.mock("@/utils", () => ({
  ...vi.importActual("@/utils"),
  generateRandomUUID: vi.fn(),
}));

const generateRandomUUIDMock = vi.mocked(generateRandomUUID);

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the form with initial values", () => {
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];

  render(<TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={vi.fn()} />);

  expect(screen.getAllByRole("textbox", { name: /Title/ })).toHaveLength(2);
  expect(screen.getAllByRole("spinbutton", { name: /Initial Duration \(seconds\)/ })).toHaveLength(2);
});

it("should call updateTimerConfigs when adding a new timer", async () => {
  const event = userEvent.setup();
  const newTimerUuid = "new-uuid";
  generateRandomUUIDMock.mockReturnValue(newTimerUuid);
  const timerIntervals = [{ id: "1", duration: 10, title: "Timer 1" }];
  const updateTimerConfigs = vi.fn();

  render(<TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />);

  await event.click(screen.getByRole("button", { name: "Add Timer" }));

  expect(updateTimerConfigs).toHaveBeenCalledWith([
    ...timerIntervals,
    { id: newTimerUuid, title: "New interval", duration: 60 },
  ]);
});

it("should call updateTimerConfigs when updating a timer title", async () => {
  const event = userEvent.setup();

  let timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];
  const updateTimerConfigs = vi.fn().mockImplementation((newTimerConfigs) => {
    timerIntervals = newTimerConfigs;
  });

  const { rerender } = render(
    <TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />,
  );

  await event.clear(screen.getAllByRole("textbox", { name: /Title/ })[0]);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([{ ...timerIntervals[0], title: "" }, timerIntervals[1]]);

  rerender(<TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />);

  const nextCharacter = "s";
  await event.type(screen.getAllByRole("textbox", { name: /Title/ })[0], nextCharacter);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([
    { ...timerIntervals[0], title: nextCharacter },
    timerIntervals[1],
  ]);
});

it("should call updateTimerConfigs when updating a timer duration", async () => {
  const event = userEvent.setup();
  let timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];
  const updateTimerConfigs = vi.fn().mockImplementation((newTimerConfigs) => {
    timerIntervals = newTimerConfigs;
  });

  const { rerender } = render(
    <TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />,
  );

  await event.clear(screen.getAllByRole("spinbutton", { name: /Initial Duration \(seconds\)/ })[0]);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([{ ...timerIntervals[0], duration: 0 }, timerIntervals[1]]);

  rerender(<TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />);

  const nextCharacter = "1";
  await event.type(screen.getAllByRole("spinbutton", { name: /Initial Duration \(seconds\)/ })[0], nextCharacter);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([
    { ...timerIntervals[0], duration: Number(nextCharacter) },
    timerIntervals[1],
  ]);
});

it("should call updateTimerConfigs when deleting a timer", async () => {
  const event = userEvent.setup();
  const timerIntervals = [
    { id: "1", duration: 10, title: "Timer 1" },
    { id: "2", duration: 20, title: "Timer 2" },
  ];
  const updateTimerConfigs = vi.fn();

  render(<TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />);

  await event.click(screen.getAllByRole("button", { name: "Delete timer" })[0]);

  expect(updateTimerConfigs).toHaveBeenCalledWith([timerIntervals[1]]);
});

it("should disable the delete button when there is only one timer", () => {
  const timerIntervals = [{ id: "1", duration: 10, title: "Timer 1" }];
  const updateTimerConfigs = vi.fn();

  render(<TimerConfigFormFields timerConfigs={timerIntervals} updateTimerConfigs={updateTimerConfigs} />);

  expect(screen.getByRole("button", { name: "Delete timer" })).toBeDisabled();
});
