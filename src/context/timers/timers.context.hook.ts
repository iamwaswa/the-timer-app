import { useContext } from "react";

import { TimersContext, type TimersContextType } from "./timers.context";

export function useGetTimersContext() {
  const timersContext = useContext<Partial<TimersContextType>>(TimersContext);

  if (timersContext === undefined || timersContext.timers === undefined) {
    throw new Error("useGetTimersContext must be used within a TimersContextProvider");
  }

  return timersContext.timers;
}

export function useSetTimersContext() {
  const timersContext = useContext<Partial<TimersContextType>>(TimersContext);

  if (timersContext === undefined || timersContext.setTimers === undefined) {
    throw new Error("useSetTimersContext must be used within a TimersContextProvider");
  }

  return timersContext.setTimers;
}

export function useTimersContext() {
  const timersContext = useContext<Partial<TimersContextType>>(TimersContext);

  if (timersContext === undefined || timersContext.timers === undefined || timersContext.setTimers === undefined) {
    throw new Error("useTimersContext must be used within a TimersContextProvider");
  }

  return [timersContext.timers, timersContext.setTimers] as const;
}
