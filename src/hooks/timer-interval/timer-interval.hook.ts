"use client";

import { useEffect, useEffectEvent, useReducer, useRef } from "react";

import type { TimerInterval } from "@/types";

export function useTimerInterval(timerInterval: TimerInterval, shouldStartPlaying = false) {
  const [{ duration, isFinished, isPlaying, resetOrRestartToggle, toggleRestartInterval }, dispatch] = useReducer(
    timerIntervalReducer,
    {
      duration: timerInterval.duration,
      isFinished: false,
      isPlaying: shouldStartPlaying,
      resetOrRestartToggle: false,
      toggleRestartInterval: false,
    },
  );
  const interval = useRef<NodeJS.Timeout | null>(null);

  const clearIntervalIfPresent = useEffectEvent(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  });

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    interval.current = setInterval(() => {
      dispatch({ type: "decrease-duration" });
    }, 1000);

    return clearIntervalIfPresent;
  }, [isPlaying, toggleRestartInterval]);

  useEffect(() => {
    if (duration === 0) {
      clearIntervalIfPresent();
    }
  }, [duration]);

  return {
    duration,
    isFinished,
    isPlaying,
    resetOrRestartToggle,
    pause() {
      dispatch({ type: "pause" });
    },
    play() {
      dispatch({ type: "play" });
    },
    reset() {
      dispatch({ payload: { initialDuration: timerInterval.duration }, type: "reset" });
    },
    restart() {
      dispatch({ payload: { initialDuration: timerInterval.duration }, type: "restart" });
    },
  };
}

type TimerIntervalReducerState = {
  isFinished: boolean;
  isPlaying: boolean;
  duration: number;
  resetOrRestartToggle: boolean;
  toggleRestartInterval: boolean;
};

type TimerIntervalReducerAction =
  | {
      type: "decrease-duration";
    }
  | {
      type: "pause";
    }
  | {
      type: "play";
    }
  | {
      payload: {
        initialDuration: number;
      };
      type: "reset";
    }
  | {
      payload: {
        initialDuration: number;
      };
      type: "restart";
    };

function timerIntervalReducer(state: TimerIntervalReducerState, action: TimerIntervalReducerAction) {
  switch (action.type) {
    case "decrease-duration":
      if (state.duration <= 1) {
        return {
          ...state,
          duration: 0,
          isFinished: true,
          isPlaying: false,
        };
      }

      return {
        ...state,
        duration: state.duration - 1,
      };
    case "pause":
      return {
        ...state,
        isPlaying: false,
      };
    case "play":
      return {
        ...state,
        isPlaying: true,
      };
    case "reset":
      return {
        ...state,
        duration: action.payload.initialDuration,
        isPlaying: false,
        resetOrRestartToggle: !state.resetOrRestartToggle,
      };
    case "restart":
      return {
        ...state,
        duration: action.payload.initialDuration,
        isPlaying: true,
        resetOrRestartToggle: !state.resetOrRestartToggle,
        toggleRestartInterval: !state.toggleRestartInterval,
      };
  }
}
