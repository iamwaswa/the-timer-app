import { useCallback, useState } from "react";

import type { TimerConfig, TimerType } from "@/types";
import { generateRandomUUID } from "@/utils";

import { useGetTimers } from "../get-timers";

export function useTimerForm(initialValue?: TimerType) {
  const [timers, key] = useGetTimers();

  const [formState, setFormState] = useState<TimerType>({
    id: initialValue?.id ?? generateRandomUUID(),
    numIterations: initialValue?.numIterations ? Number(initialValue.numIterations) : 1,
    title: initialValue?.title ?? "New timer",
    timerConfigs: initialValue?.timerConfigs ?? [
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
    const hasTimer = timers.some((existingTimer) => existingTimer.id === formState.id);
    localStorage.setItem(
      key,
      JSON.stringify(
        hasTimer
          ? timers.map((existingTimer) => (existingTimer.id === formState.id ? formState : existingTimer))
          : [...timers, formState],
      ),
    );
  }, [key, formState, timers]);

  return [formState, { save, updateNumIterations, updateTimerConfigs, updateTitle }] as const;
}
