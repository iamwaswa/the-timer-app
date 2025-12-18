import { createContext } from "react";

import type { TimerType } from "@/types";

export type TimersContextType = {
  timers: TimerType[];
  setTimers(timers: TimerType[]): void;
};

export const TimersContext = createContext<Partial<TimersContextType>>({});
