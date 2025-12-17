import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { redirect } from "next/navigation";

import { useTimerForm } from "@/hooks";

import { TimerForm } from "./timer-form";

vi.mock("@/hooks", () => ({
  ...vi.importActual("@/hooks"),
  useTimerForm: vi.fn(),
}));

const useTimerFormMock = vi.mocked(useTimerForm);

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  redirect: vi.fn(),
}));

const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.resetAllMocks();
});

it("should render the form with initial values", () => {
  const timerForm = {
    id: "1",
    numIterations: 3,
    timerConfigs: [],
    title: "Test Timer",
  };
  const timerFormActions = {
    save: vi.fn(),
    updateTitle: vi.fn(),
    updateNumIterations: vi.fn(),
    updateTimerConfigs: vi.fn(),
  };
  useTimerFormMock.mockImplementation(() => [timerForm, timerFormActions]);

  render(<TimerForm />);

  expect(screen.getByRole("textbox", { name: /Title/ })).toHaveValue(timerForm.title);
  expect(screen.getByRole("spinbutton", { name: /Number of iterations/ })).toHaveValue(timerForm.numIterations);
  expect(screen.getByRole("button", { name: "Create Timer" })).toBeInTheDocument();
});

it("should call updateTitle when the title is changed", async () => {
  const event = userEvent.setup();
  const timerForm = {
    id: "1",
    numIterations: 3,
    timerConfigs: [],
    title: "Test Timer",
  };
  const timerFormActions = {
    save: vi.fn(),
    updateTitle: vi.fn().mockImplementation((newTitle) => {
      timerForm.title = newTitle;
    }),
    updateNumIterations: vi.fn(),
    updateTimerConfigs: vi.fn(),
  };
  useTimerFormMock.mockImplementation(() => [timerForm, timerFormActions]);

  const { rerender } = render(<TimerForm />);

  await event.clear(screen.getByRole("textbox", { name: /Title/ }));

  expect(timerFormActions.updateTitle).toHaveBeenLastCalledWith("");

  rerender(<TimerForm />);

  const nextCharacter = "s";
  await event.type(screen.getByRole("textbox", { name: /Title/ }), nextCharacter);

  expect(timerFormActions.updateTitle).toHaveBeenLastCalledWith(nextCharacter);
});

it("should call updateNumIterations when the number of iterations is changed", async () => {
  const event = userEvent.setup();
  const timerForm = {
    id: "1",
    numIterations: 3,
    timerConfigs: [],
    title: "Test Timer",
  };
  const timerFormActions = {
    save: vi.fn(),
    updateTitle: vi.fn(),
    updateNumIterations: vi.fn().mockImplementation((newNumIterations) => {
      timerForm.numIterations = newNumIterations;
    }),
    updateTimerConfigs: vi.fn(),
  };
  useTimerFormMock.mockImplementation(() => [timerForm, timerFormActions]);

  const { rerender } = render(<TimerForm />);

  await event.clear(screen.getByRole("spinbutton", { name: /Number of iterations/ }));

  expect(timerFormActions.updateNumIterations).toHaveBeenLastCalledWith(0);

  rerender(<TimerForm />);

  const nextCharacter = "1";
  await event.type(screen.getByRole("spinbutton", { name: /Number of iterations/ }), nextCharacter);

  expect(timerFormActions.updateNumIterations).toHaveBeenLastCalledWith(Number(nextCharacter));
});

it("should call save and redirect on form submission", async () => {
  const event = userEvent.setup();
  const timerForm = {
    id: "1",
    numIterations: 3,
    timerConfigs: [],
    title: "Test Timer",
  };
  const timerFormActions = {
    save: vi.fn(),
    updateTitle: vi.fn(),
    updateNumIterations: vi.fn(),
    updateTimerConfigs: vi.fn(),
  };
  useTimerFormMock.mockImplementation(() => [timerForm, timerFormActions]);

  render(<TimerForm />);

  await event.click(screen.getByRole("button", { name: "Create Timer" }));

  expect(timerFormActions.save).toHaveBeenCalled();
  expect(redirectMock).toHaveBeenCalledWith("/");
});

it('should display "Update Timer" when a timer prop is provided', () => {
  const timerForm = {
    id: "1",
    numIterations: 2,
    timerConfigs: [],
    title: "Existing Timer",
  };
  const timerFormActions = {
    save: vi.fn(),
    updateTitle: vi.fn(),
    updateNumIterations: vi.fn(),
    updateTimerConfigs: vi.fn(),
  };
  useTimerFormMock.mockImplementation(() => [timerForm, timerFormActions]);

  render(<TimerForm timer={timerForm} />);

  expect(screen.getByRole("button", { name: "Update Timer" })).toBeInTheDocument();
});
