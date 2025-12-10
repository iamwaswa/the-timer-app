import { useCallback, useState } from "react";

import type { TimerConfig, TimerType } from "@/types";
import { generateRandomUUID } from "@/utils";

import { useGetTimers } from "../get-timers";

export function useCreateTimerForm() {
  const [timers, key] = useGetTimers();

  const [formState, setFormState] = useState<TimerType>({
    id: generateRandomUUID(),
    numIterations: 1,
    title: "New timer",
    timerConfigs: [
      {
        id: generateRandomUUID(),
        initialDuration: 60,
        title: "New interval",
      },
    ],
  });

  const updateNumIterations = useCallback((updatedNumIterations: number) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      numIterations: updatedNumIterations,
    }));
  }, []);

  const updateTimerConfigs = useCallback((updatedTimerConfigs: TimerConfig[]) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      timerConfigs: updatedTimerConfigs,
    }));
  }, []);

  const updateTitle = useCallback((updatedTitle: string) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      title: updatedTitle,
    }));
  }, []);

  const save = useCallback(() => {
    localStorage.setItem(key, JSON.stringify([...timers, formState]));
  }, [key, formState, timers]);

  return [formState, { save, updateNumIterations, updateTimerConfigs, updateTitle }] as const;
}
