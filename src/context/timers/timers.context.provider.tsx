"use client";

import dynamic from "next/dynamic";
import { type PropsWithChildren, useState } from "react";

import type { Timer, TimerInterval } from "@/types";
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

  return parseJson<Timer[]>(
    window.localStorage.getItem(timersLocalStorageKey),
    function parseJsonToTimerTypeArray(json) {
      if (!Array.isArray(json)) {
        return [];
      } else {
        return json.filter((item): item is Timer => {
          return (
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            typeof item.id === "string" &&
            "numIterations" in item &&
            typeof item.numIterations === "number" &&
            "timerIntervals" in item &&
            Array.isArray(item.timerIntervals) &&
            Array.from(item.timerIntervals).every((timerInterval): timerInterval is TimerInterval => {
              return (
                typeof timerInterval === "object" &&
                timerInterval !== null &&
                "id" in timerInterval &&
                typeof timerInterval.id === "string" &&
                "duration" in timerInterval &&
                typeof timerInterval.duration === "number" &&
                "title" in timerInterval &&
                typeof timerInterval.title === "string"
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
