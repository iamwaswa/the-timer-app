"use client";

import { createContext } from "react";

import type { Timer } from "@/types";

export type TimersContextType = {
  timers: Timer[];
  updateTimers(timers: Timer[]): void;
};

export const TimersContext = createContext<Partial<TimersContextType>>({});
