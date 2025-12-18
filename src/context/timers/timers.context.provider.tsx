"use client";

import dynamic from "next/dynamic";
import { type PropsWithChildren, useState } from "react";

import type { TimerInterval, TimerType } from "@/types";
import { parseJson } from "@/utils";

import { TimersContext, type TimersContextType } from "./timers.context";

const timersLocalStorageKey = "timers" as const;

export const TimersContextProviderClientOnlyComponent = dynamic(() => Promise.resolve(TimersContextProvider), {
  ssr: false,
});

export function TimersContextProvider({ children }: PropsWithChildren) {
  const [timers, setTimers] = useState<TimersContextType["timers"]>(getTimersFromLocalStorage);

  return (
    <TimersContext.Provider
      value={{
        timers,
        updateTimers(updatedTimers) {
          setTimers(updatedTimers);
          persistTimersToLocalStorage(updatedTimers);
        },
      }}
    >
      {children}
    </TimersContext.Provider>
  );
}

function getTimersFromLocalStorage() {
  if (typeof window === "undefined" || !window?.localStorage) {
    return [];
  }

  return parseJson<TimerType[]>(
    window.localStorage.getItem(timersLocalStorageKey),
    function parseJsonToTimerTypeArray(json) {
      if (!Array.isArray(json)) {
        return [];
      } else {
        return json.filter((item): item is TimerType => {
          return (
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            typeof item.id === "string" &&
            "numIterations" in item &&
            typeof item.numIterations === "number" &&
            "timerConfigs" in item &&
            Array.isArray(item.timerConfigs) &&
            Array.from(item.timerConfigs).every((timerConfig): timerConfig is TimerInterval => {
              return (
                typeof timerConfig === "object" &&
                timerConfig !== null &&
                "id" in timerConfig &&
                typeof timerConfig.id === "string" &&
                "initialDuration" in timerConfig &&
                typeof timerConfig.initialDuration === "number" &&
                "title" in timerConfig &&
                typeof timerConfig.title === "string"
              );
            }) &&
            "title" in item &&
            typeof item.title === "string"
          );
        });
      }
    },
    [],
  );
}

function persistTimersToLocalStorage(timersToPersist: TimersContextType["timers"]) {
  window.localStorage.setItem(timersLocalStorageKey, JSON.stringify(timersToPersist));
}
