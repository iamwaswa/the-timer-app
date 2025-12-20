"use client";

import { useEffect, useEffectEvent, useReducer, useRef } from "react";

import type { TimerInterval } from "@/types";

export function useSequentialTimerInterval(
  timerInterval: TimerInterval,
  onAdvanceSequence: () => TimerInterval | null,
  onResetSequence: () => TimerInterval,
) {
  const [{ animationToggle, duration, status }, dispatch] = useReducer(timerIntervalReducer, {
    animationToggle: 0,
    duration: timerInterval.duration,
    status: "idle",
  });

  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  function startInterval() {
    timeout.current = setInterval(() => {
      dispatch({ type: "decrement-duration" });
    }, 1000);
  }

  const onAdvanceSequenceEvent = useEffectEvent(onAdvanceSequence);

  function pause() {
    clearInterval(timeout.current);
    dispatch({ type: "pause" });
  }

  const pauseEvent = useEffectEvent(pause);

  useEffect(() => {
    if (duration === 0) {
      const nextTimerInterval = onAdvanceSequenceEvent();
      if (nextTimerInterval === null) {
        pauseEvent();
      } else {
        dispatch({ type: "set-duration", payload: { updatedDuration: nextTimerInterval.duration } });
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
    reset() {
      clearInterval(timeout.current);
      dispatch({ payload: { duration: timerInterval.duration }, type: "reset" });
    },
    resetAll() {
      clearInterval(timeout.current);
      const firstTimerInterval = onResetSequence();
      dispatch({ payload: { duration: firstTimerInterval.duration }, type: "reset" });
    },
    restart() {
      clearInterval(timeout.current);
      startInterval();
      dispatch({ payload: { duration: timerInterval.duration }, type: "restart" });
    },
  };
}

type AnimationToggle = 0 | 1;

type TimerIntervalReducerState = {
  animationToggle: AnimationToggle;
  duration: number;
  status: "idle" | "playing";
};

type TimerIntervalReducerAction =
  | {
      type: "decrement-duration";
    }
  | {
      type: "pause";
    }
  | {
      type: "play";
    }
  | {
      payload: {
        duration: number;
      };
      type: "reset";
    }
  | {
      payload: {
        duration: number;
      };
      type: "restart";
    }
  | {
      payload: {
        updatedDuration: number;
      };
      type: "set-duration";
    };

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
        animationToggle: (state.animationToggle === 1 ? 0 : 1) as AnimationToggle,
        duration: action.payload.duration,
        status: "idle" as const,
      };
    case "restart":
      return {
        ...state,
        animationToggle: (state.animationToggle === 1 ? 0 : 1) as AnimationToggle,
        duration: action.payload.duration,
        status: "playing" as const,
      };
    case "set-duration":
      return {
        ...state,
        duration: action.payload.updatedDuration,
      };
  }
}
