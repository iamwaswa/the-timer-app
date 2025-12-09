import { useCallback, useState } from "react";

import type { TimerConfig, TimerType } from "@/types";
import { generateRandomUUID } from "@/utils";

export function useCreateTimerForm() {
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

  return [formState, { updateNumIterations, updateTimerConfigs, updateTitle }] as const;
}
