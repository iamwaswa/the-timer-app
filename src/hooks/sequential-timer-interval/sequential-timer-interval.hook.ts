"use client";

import { useEffect, useEffectEvent, useReducer, useRef } from "react";

import type {
  TimerInterval,
  TimerIntervalReducerAction,
  TimerIntervalReducerPauseAction,
  TimerIntervalReducerRestartAction,
  TimerIntervalReducerState,
  TimerIntervalReducerStateAnimationToggle,
} from "@/types";

export function useSequentialTimerInterval(
  timerInterval: TimerInterval,
  onDurationComplete: () => TimerIntervalReducerPauseAction | TimerIntervalReducerRestartAction,
) {
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [{ animationToggle, duration, status }, dispatch] = useReducer(timerIntervalReducer, {
    animationToggle: 0,
    duration: timerInterval.duration,
    status: "idle",
  });

  const onDurationCompleteEvent = useEffectEvent(onDurationComplete);

  function pause() {
    clearInterval(timeout.current);
    dispatch({ type: "pause" });
  }

  const pauseEvent = useEffectEvent(pause);

  function restart(restartTimerIntervalDuration = timerInterval.duration) {
    clearInterval(timeout.current);
    startInterval();
    dispatch({ payload: { duration: restartTimerIntervalDuration }, type: "restart" });
  }

  function startInterval() {
    timeout.current = setInterval(() => {
      dispatch({ type: "decrement-duration" });
    }, 1000);
  }

  const restartEvent = useEffectEvent(restart);

  useEffect(() => {
    if (duration === 0) {
      const timerIntervalReducerAction = onDurationCompleteEvent();
      switch (timerIntervalReducerAction.type) {
        case "pause":
          pauseEvent();
          break;
        case "restart":
          restartEvent(timerIntervalReducerAction.payload.duration);
          break;
      }
    }
  }, [duration]);

  return {
    animationToggle,
    duration,
    status,
    pause,
    play() {
      startInterval();
      dispatch({ type: "play" });
    },
    reset(updatedTimerInterval = timerInterval) {
      clearInterval(timeout.current);
      dispatch({ payload: { duration: updatedTimerInterval.duration }, type: "reset" });
    },
    restart(restartTimerInterval = timerInterval) {
      clearInterval(timeout.current);
      startInterval();
      dispatch({ payload: { duration: restartTimerInterval.duration }, type: "restart" });
    },
  };
}

function timerIntervalReducer(state: TimerIntervalReducerState, action: TimerIntervalReducerAction) {
  switch (action.type) {
    case "decrement-duration":
      return {
        ...state,
        duration: state.duration - 1,
      };
    case "pause":
      return {
        ...state,
        status: "idle" as const,
      };
    case "play":
      return {
        ...state,
        status: "playing" as const,
      };
    case "reset":
      return {
        ...state,
        animationToggle: (state.animationToggle === 1 ? 0 : 1) as TimerIntervalReducerStateAnimationToggle,
        duration: action.payload.duration,
        status: "idle" as const,
      };
    case "restart":
      return {
        ...state,
        animationToggle: (state.animationToggle === 1 ? 0 : 1) as TimerIntervalReducerStateAnimationToggle,
        duration: action.payload.duration,
        status: "playing" as const,
      };
  }
}
