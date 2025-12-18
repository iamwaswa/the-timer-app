import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { TimersContext } from "./timers.context";
import { useGetTimersContext, useSetTimersContext, useTimersContext } from "./timers.context.hook";

it("should throw error from useGetTimersContext if used outside of a TimersContextProvider", () => {
  try {
    renderHook(() => useGetTimersContext());
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(Error);
    expect((e as Error).message).toBe("useGetTimersContext must be used within a TimersContextProvider");
  }
});

it("should return the timers from useGetTimersContext if used within a TimersContextProvider", () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <TimersContext.Provider value={{ timers: [], setTimers: vi.fn() }}>{children}</TimersContext.Provider>
  );
  const { result } = renderHook(() => useGetTimersContext(), { wrapper });
  expect(result.current).toEqual([]);
});

it("should throw error from useSetTimersContext if used outside of a TimersContextProvider", () => {
  try {
    renderHook(() => useSetTimersContext());
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(Error);
    expect((e as Error).message).toBe("useSetTimersContext must be used within a TimersContextProvider");
  }
});

it("should return the set timers function from useSetTimersContext if used within a TimersContextProvider", () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <TimersContext.Provider value={{ timers: [], setTimers: vi.fn() }}>{children}</TimersContext.Provider>
  );
  const { result } = renderHook(() => useSetTimersContext(), { wrapper });
  expect(result.current).toEqual(expect.any(Function));
});

it("should throw error from useTimersContext if used outside of a TimersContextProvider", () => {
  try {
    renderHook(() => useTimersContext());
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(Error);
    expect((e as Error).message).toBe("useTimersContext must be used within a TimersContextProvider");
  }
});

it("should return the set timers function from useTimersContext if used within a TimersContextProvider", () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <TimersContext.Provider value={{ timers: [], setTimers: vi.fn() }}>{children}</TimersContext.Provider>
  );
  const { result } = renderHook(() => useTimersContext(), { wrapper });
  expect(result.current).toEqual([[], expect.any(Function)]);
});
