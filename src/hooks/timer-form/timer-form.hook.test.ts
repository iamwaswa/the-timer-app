import { renderHook } from "@testing-library/react";
import { act } from "react";

import * as TimersContextHookModule from "@/context/timers/timers.context.hook";
import type { TimerConfig, TimerType } from "@/types";
import * as generateRandomUUIDUtilModule from "@/utils/generate-random-uuid/generate-random-uuid.util";

import { useTimerForm } from "./timer-form.hook";

const useTimersContextSpy = vi.spyOn(TimersContextHookModule, "useTimersContext");
const generateRandomUUIDSpy = vi.spyOn(generateRandomUUIDUtilModule, "generateRandomUUID");

beforeEach(() => {
  vi.resetAllMocks();
});

it("should initialize with a default state when no initial value is provided", () => {
  const id = "uuid-1";
  generateRandomUUIDSpy.mockImplementation(() => id);
  useTimersContextSpy.mockImplementation(() => [[], vi.fn()]);

  const { result } = renderHook(() => useTimerForm());

  expect(result.current[0]).toEqual({
    id: id,
    numIterations: 1,
    title: "New timer",
    timerConfigs: [
      {
        id: id,
        initialDuration: 60,
        title: "New interval",
      },
    ],
  });
});

it("should initialize with the initialValue when one is provided", () => {
  const id = "existing-timer-id";
  generateRandomUUIDSpy.mockImplementation(() => id);
  useTimersContextSpy.mockImplementation(() => [[], vi.fn()]);

  const initialValue: TimerType = {
    id,
    numIterations: 2,
    title: "Existing Timer",
    timerConfigs: [
      {
        id: "existing-config-id",
        initialDuration: 120,
        title: "Existing Interval",
      },
    ],
  };
  const { result } = renderHook(() => useTimerForm(initialValue));

  expect(result.current[0]).toEqual(initialValue);
});

it("should update the number of iterations", () => {
  generateRandomUUIDSpy.mockImplementation(() => "");
  const setTimers = vi.fn();
  useTimersContextSpy.mockImplementation(() => [[], setTimers]);

  const { result } = renderHook(() => useTimerForm());

  expect(setTimers).not.toHaveBeenCalled();

  const updatedNumIterations = 5;
  act(() => {
    result.current[1].updateNumIterations(updatedNumIterations);
  });

  expect(result.current[0].numIterations).toBe(updatedNumIterations);
  expect(setTimers).not.toHaveBeenCalled();
});

it("should update the timer configs", () => {
  generateRandomUUIDSpy.mockImplementation(() => "");
  const setTimers = vi.fn();
  useTimersContextSpy.mockImplementation(() => [[], setTimers]);

  const { result } = renderHook(() => useTimerForm());
  const newTimerConfigs: TimerConfig[] = [{ id: "new-config", initialDuration: 30, title: "New Config" }];

  expect(setTimers).not.toHaveBeenCalled();

  act(() => {
    result.current[1].updateTimerConfigs(newTimerConfigs);
  });

  expect(result.current[0].timerConfigs).toEqual(newTimerConfigs);
  expect(setTimers).not.toHaveBeenCalled();
});

it("should update the title", () => {
  generateRandomUUIDSpy.mockImplementation(() => "");
  const setTimers = vi.fn();
  useTimersContextSpy.mockImplementation(() => [[], setTimers]);

  const { result } = renderHook(() => useTimerForm());

  expect(setTimers).not.toHaveBeenCalled();

  const updatedTitle = "Updated Title";
  act(() => {
    result.current[1].updateTitle(updatedTitle);
  });

  expect(result.current[0].title).toBe(updatedTitle);
  expect(setTimers).not.toHaveBeenCalled();
});

it("should save a new timer to localStorage if it's a new timer", () => {
  const id1 = "uuid-1";
  const id2 = "uuid-2";
  generateRandomUUIDSpy.mockImplementationOnce(() => id1).mockImplementationOnce(() => id2);
  const setTimers = vi.fn();
  useTimersContextSpy.mockImplementation(() => [[], setTimers]);

  const { result } = renderHook(() => useTimerForm());

  expect(setTimers).not.toHaveBeenCalled();

  act(() => {
    result.current[1].save();
  });

  const expectedNewTimer: TimerType = {
    id: id1,
    numIterations: 1,
    title: "New timer",
    timerConfigs: [
      {
        id: id2,
        initialDuration: 60,
        title: "New interval",
      },
    ],
  };

  expect(setTimers).toHaveBeenCalledTimes(1);
  expect(setTimers).toHaveBeenCalledWith([expectedNewTimer]);
});

it("should update an existing timer in localStorage if the timer already exists", () => {
  const id = "existing-timer-id";
  const existingTimers: TimerType[] = [
    {
      id,
      numIterations: 1,
      title: "Existing Timer",
      timerConfigs: [{ id: "config-1", initialDuration: 60, title: "Interval" }],
    },
    {
      id: `${id}-2}`,
      numIterations: 1,
      title: "Existing Timer 2",
      timerConfigs: [{ id: "config-2", initialDuration: 60, title: "Interval" }],
    },
  ];
  generateRandomUUIDSpy.mockImplementation(() => id);
  const setTimers = vi.fn();
  useTimersContextSpy.mockImplementation(() => [existingTimers, setTimers]);

  const { result } = renderHook(() => useTimerForm(existingTimers[0]));

  expect(setTimers).not.toHaveBeenCalled();

  const title = "Updated Title";
  act(() => {
    result.current[1].updateTitle(title);
  });

  expect(setTimers).not.toHaveBeenCalled();

  act(() => {
    result.current[1].save();
  });

  const updatedTimers = existingTimers.map((existingTimer) =>
    existingTimer.id === id ? { ...existingTimer, title } : existingTimer,
  );

  expect(setTimers).toHaveBeenCalledTimes(1);
  expect(setTimers).toHaveBeenCalledWith(updatedTimers);
});
