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
  const timerConfigs = [
    { id: "1", title: "Timer 1", initialDuration: 10 },
    { id: "2", title: "Timer 2", initialDuration: 20 },
  ];

  render(<TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={vi.fn()} />);

  expect(screen.getAllByRole("textbox", { name: /Title/ })).toHaveLength(2);
  expect(screen.getAllByRole("spinbutton", { name: /Initial Duration \(seconds\)/ })).toHaveLength(2);
});

it("should call updateTimerConfigs when adding a new timer", async () => {
  const event = userEvent.setup();
  const newTimerUuid = "new-uuid";
  generateRandomUUIDMock.mockReturnValue(newTimerUuid);
  const timerConfigs = [{ id: "1", title: "Timer 1", initialDuration: 10 }];
  const updateTimerConfigs = vi.fn();

  render(<TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />);

  await event.click(screen.getByRole("button", { name: "Add Timer" }));

  expect(updateTimerConfigs).toHaveBeenCalledWith([
    ...timerConfigs,
    { id: newTimerUuid, title: "New interval", initialDuration: 60 },
  ]);
});

it("should call updateTimerConfigs when updating a timer title", async () => {
  const event = userEvent.setup();

  let timerConfigs = [
    { id: "1", title: "Timer 1", initialDuration: 10 },
    { id: "2", title: "Timer 2", initialDuration: 20 },
  ];
  const updateTimerConfigs = vi.fn().mockImplementation((newTimerConfigs) => {
    timerConfigs = newTimerConfigs;
  });

  const { rerender } = render(
    <TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />,
  );

  await event.clear(screen.getAllByRole("textbox", { name: /Title/ })[0]);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([{ ...timerConfigs[0], title: "" }, timerConfigs[1]]);

  rerender(<TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />);

  const nextCharacter = "s";
  await event.type(screen.getAllByRole("textbox", { name: /Title/ })[0], nextCharacter);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([{ ...timerConfigs[0], title: nextCharacter }, timerConfigs[1]]);
});

it("should call updateTimerConfigs when updating a timer duration", async () => {
  const event = userEvent.setup();
  let timerConfigs = [
    { id: "1", title: "Timer 1", initialDuration: 10 },
    { id: "2", title: "Timer 2", initialDuration: 20 },
  ];
  const updateTimerConfigs = vi.fn().mockImplementation((newTimerConfigs) => {
    timerConfigs = newTimerConfigs;
  });

  const { rerender } = render(
    <TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />,
  );

  await event.clear(screen.getAllByRole("spinbutton", { name: /Initial Duration \(seconds\)/ })[0]);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([{ ...timerConfigs[0], initialDuration: 0 }, timerConfigs[1]]);

  rerender(<TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />);

  const nextCharacter = "1";
  await event.type(screen.getAllByRole("spinbutton", { name: /Initial Duration \(seconds\)/ })[0], nextCharacter);

  expect(updateTimerConfigs).toHaveBeenLastCalledWith([
    { ...timerConfigs[0], initialDuration: Number(nextCharacter) },
    timerConfigs[1],
  ]);
});

it("should call updateTimerConfigs when deleting a timer", async () => {
  const event = userEvent.setup();
  const timerConfigs = [
    { id: "1", title: "Timer 1", initialDuration: 10 },
    { id: "2", title: "Timer 2", initialDuration: 20 },
  ];
  const updateTimerConfigs = vi.fn();

  render(<TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />);

  await event.click(screen.getAllByRole("button", { name: "Delete timer" })[0]);

  expect(updateTimerConfigs).toHaveBeenCalledWith([timerConfigs[1]]);
});

it("should disable the delete button when there is only one timer", () => {
  const timerConfigs = [{ id: "1", title: "Timer 1", initialDuration: 10 }];
  const updateTimerConfigs = vi.fn();

  render(<TimerConfigFormFields timerConfigs={timerConfigs} updateTimerConfigs={updateTimerConfigs} />);

  expect(screen.getByRole("button", { name: "Delete timer" })).toBeDisabled();
});
