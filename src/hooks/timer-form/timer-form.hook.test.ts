import { act, renderHook } from "@testing-library/react";

import * as useGetTimersHookModule from "@/hooks/get-timers/get-timers.hook";
import type { TimerConfig, TimerType } from "@/types";
import * as generateRandomUUIDUtilModule from "@/utils/generate-random-uuid/generate-random-uuid.util";

import { useTimerForm } from "./timer-form.hook";

const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
const useGetTimersSpy = vi.spyOn(useGetTimersHookModule, "useGetTimers");
const generateRandomUUIDSpy = vi.spyOn(generateRandomUUIDUtilModule, "generateRandomUUID");

beforeEach(() => {
  vi.clearAllMocks();
});

it("should initialize with a default state when no initial value is provided", () => {
  const id = "uuid-1";
  generateRandomUUIDSpy.mockImplementation(() => id);
  useGetTimersSpy.mockImplementation(() => [[], "timers"]);

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
  useGetTimersSpy.mockImplementation(() => [[], "timers"]);

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
  useGetTimersSpy.mockImplementation(() => [[], "timers"]);

  const { result } = renderHook(() => useTimerForm());

  act(() => {
    result.current[1].updateNumIterations(5);
  });

  expect(result.current[0].numIterations).toBe(5);
});

it("should update the timer configs", () => {
  generateRandomUUIDSpy.mockImplementation(() => "");
  useGetTimersSpy.mockImplementation(() => [[], "timers"]);

  const { result } = renderHook(() => useTimerForm());
  const newTimerConfigs: TimerConfig[] = [{ id: "new-config", initialDuration: 30, title: "New Config" }];

  act(() => {
    result.current[1].updateTimerConfigs(newTimerConfigs);
  });

  expect(result.current[0].timerConfigs).toEqual(newTimerConfigs);
});

it("should update the title", () => {
  generateRandomUUIDSpy.mockImplementation(() => "");
  useGetTimersSpy.mockImplementation(() => [[], "timers"]);

  const { result } = renderHook(() => useTimerForm());

  act(() => {
    result.current[1].updateTitle("Updated Title");
  });

  expect(result.current[0].title).toBe("Updated Title");
});

it("should save a new timer to localStorage if it's a new timer", () => {
  const id1 = "uuid-1";
  const id2 = "uuid-2";
  generateRandomUUIDSpy.mockImplementationOnce(() => id1).mockImplementationOnce(() => id2);
  useGetTimersSpy.mockImplementation(() => [[], "timers"]);

  const { result } = renderHook(() => useTimerForm());

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

  expect(setItemSpy).toHaveBeenCalledWith("timers", JSON.stringify([expectedNewTimer]));
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
  useGetTimersSpy.mockImplementation(() => [existingTimers, "timers"]);

  const { result } = renderHook(() => useTimerForm(existingTimers[0]));

  const title = "Updated Title";
  act(() => {
    result.current[1].updateTitle(title);
  });

  act(() => {
    result.current[1].save();
  });

  const updatedTimers = existingTimers.map((existingTimer) =>
    existingTimer.id === id ? { ...existingTimer, title } : existingTimer,
  );

  expect(setItemSpy).toHaveBeenCalledWith("timers", JSON.stringify(updatedTimers));
});
