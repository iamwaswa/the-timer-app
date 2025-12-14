import { useMemo } from "react";

import type { TimerConfig, TimerType } from "@/types";
import { parseJson } from "@/utils";

type UseGetTimersReturnType = [TimerType[], string];

export function useGetTimers() {
  return useMemo<UseGetTimersReturnType>(() => {
    const key = "timers";

    if (!window?.localStorage) {
      return [[], key];
    }

    return [
      parseJson<TimerType[]>(
        window.localStorage.getItem("timers"),
        function parseJsonToTimerTypeArray(json) {
          if (!Array.isArray(json)) {
            return [];
          }

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
              Array.from(item.timerConfigs).every((timerConfig): timerConfig is TimerConfig => {
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
        },
        [],
      ),
      key,
    ];
  }, []);
}
