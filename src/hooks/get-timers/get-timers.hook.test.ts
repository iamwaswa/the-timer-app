import { renderHook } from "@testing-library/react";

import { useGetTimers } from "./get-timers.hook";

let originalWindowLocalStorage: typeof window.localStorage;

beforeEach(() => {
  originalWindowLocalStorage = window.localStorage;
});

afterEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: originalWindowLocalStorage,
    configurable: true,
  });
});

it("should return an empty array when window.localStorage is not defined", () => {
  Object.defineProperty(window, "localStorage", {
    value: undefined,
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([]);
  expect(result.current[1]).toBe("timers");
});

it.each([null, "", "[]"])('should return an empty array when localStorage returns "%s" for the timers key', (item) => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => item,
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([]);
  expect(result.current[1]).toBe("timers");
});

it("should return timers from localStorage if they exist", () => {
  const timers = [
    {
      id: "timer-1",
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Pomodoro",
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify(timers),
    },
    configurable: true,
  });
  expect(window.localStorage.getItem("timers")).toBe(JSON.stringify(timers));

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual(timers);
  expect(result.current[1]).toBe("timers");
});

it("should return an empty array if localStorage contains non-array data", () => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify({ a: 1 }),
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([]);
  expect(result.current[1]).toBe("timers");
});

it("should return an empty array if localStorage contains a string", () => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => "not an array",
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([]);
  expect(result.current[1]).toBe("timers");
});

it("should filter out timers with missing properties", () => {
  const timers = [
    {
      id: "timer-1",
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Pomodoro",
    },
    {
      id: "timer-2",
      // Missing numIterations
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Invalid Timer",
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify(timers),
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([timers[0]]);
  expect(result.current[1]).toBe("timers");
});

it("should filter out timers with incorrect property types", () => {
  const timers = [
    {
      id: "timer-1",
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Pomodoro",
    },
    {
      id: "timer-2",
      numIterations: "3", // Should be a number
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Invalid Timer",
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify(timers),
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([timers[0]]);
  expect(result.current[1]).toBe("timers");
});

it("should filter out timers with invalid timerConfigs array", () => {
  const timers = [
    {
      id: "timer-1",
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Pomodoro",
    },
    {
      id: "timer-2",
      numIterations: 3,
      timerConfigs: "not-an-array", // Should be an array
      title: "Invalid Timer",
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify(timers),
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([timers[0]]);
  expect(result.current[1]).toBe("timers");
});

it("should filter out timers with timerConfigs containing invalid items", () => {
  const timers = [
    {
      id: "timer-1",
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Pomodoro",
    },
    {
      id: "timer-2",
      numIterations: 1,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
        {
          id: "config-2",
          // Missing initialDuration
          title: "Break",
        },
      ],
      title: "Invalid Timer",
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify(timers),
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([timers[0]]);
  expect(result.current[1]).toBe("timers");
});

it("should return a valid timer even if others in local storage are malformed", () => {
  const timers = [
    {
      id: "timer-1",
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
      title: "Pomodoro",
    },
    null,
    { some: "object" },
    "a string",
    123,
    {
      id: "timer-2",
      title: null, // invalid title
      numIterations: 3,
      timerConfigs: [
        {
          id: "timer-config-1",
          initialDuration: 60,
          title: "Work",
        },
      ],
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: () => JSON.stringify(timers),
    },
    configurable: true,
  });

  const { result } = renderHook(() => useGetTimers());

  expect(result.current[0]).toEqual([timers[0]]);
  expect(result.current[1]).toBe("timers");
});
