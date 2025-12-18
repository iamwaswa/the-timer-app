import { useReducer } from "react";

import { useTimersContext } from "@/context";
import type { TimerInterval, TimerType } from "@/types";
import { generateRandomUUID } from "@/utils";

export function useTimerForm(initialValue?: TimerType) {
  const [timers, setTimers] = useTimersContext();

  const [state, dispatch] = useReducer(timerFormReducer, {
    id: initialValue?.id ?? generateRandomUUID(),
    numIterations: initialValue?.numIterations !== undefined ? Number(initialValue.numIterations) : 1,
    title: initialValue?.title ?? "New timer",
    timerIntervals: initialValue?.timerIntervals ?? [
      {
        id: generateRandomUUID(),
        duration: 60,
        title: "New interval",
      },
    ],
  });

  return [
    state,
    {
      save() {
        const hasTimer = timers.some((existingTimer) => existingTimer.id === state.id);
        setTimers(
          hasTimer
            ? timers.map((existingTimer) => (existingTimer.id === state.id ? state : existingTimer))
            : [...timers, state],
        );
      },
      updateNumIterations(updatedNumIterations: number) {
        dispatch({ payload: { updatedNumIterations }, type: "update-num-iterations" });
      },
      updateTimerConfigs(updatedTimerIntervals: TimerInterval[]) {
        dispatch({ payload: { updatedTimerIntervals }, type: "update-timer-intervals" });
      },
      updateTitle(updatedTitle: string) {
        dispatch({ payload: { updatedTitle }, type: "update-title" });
      },
    },
  ] as const;
}

type TimerFormReducerAction =
  | {
      payload: {
        updatedNumIterations: number;
      };
      type: "update-num-iterations";
    }
  | {
      payload: {
        updatedTimerIntervals: TimerInterval[];
      };
      type: "update-timer-intervals";
    }
  | {
      payload: {
        updatedTitle: string;
      };
      type: "update-title";
    };

function timerFormReducer(state: TimerType, action: TimerFormReducerAction) {
  switch (action.type) {
    case "update-num-iterations":
      return {
        ...state,
        numIterations: action.payload.updatedNumIterations,
      };
    case "update-timer-intervals":
      return {
        ...state,
        timerIntervals: action.payload.updatedTimerIntervals,
      };
    case "update-title":
      return {
        ...state,
        title: action.payload.updatedTitle,
      };
  }
}
