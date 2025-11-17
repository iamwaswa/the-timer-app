"use client";

import { useState, useEffect, useCallback } from "react";
import type { TimerConfig } from "@/app/components";

export function useTimer(timerConfig: TimerConfig, shouldStartPlaying = false) {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(shouldStartPlaying);
  const [duration, setDuration] = useState<number>(timerConfig.initialDuration);
  const [resetOrRestartToggle, setResetOrRestartToggle] =
    useState<boolean>(false);
  const [toggleRestartInterval, setToggleRestartInterval] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setDuration((previousTimeLeft) => {
        if (previousTimeLeft <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          setIsPlaying(false);
          return 0;
        }
        return previousTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, toggleRestartInterval]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    setDuration(timerConfig.initialDuration);
    setIsPlaying(false);
    setResetOrRestartToggle((prev) => !prev);
  }, [timerConfig.initialDuration]);

  const restart = useCallback(() => {
    setDuration(timerConfig.initialDuration);
    setIsPlaying(true);
    setResetOrRestartToggle((prev) => !prev);
    setToggleRestartInterval((prev) => !prev);
  }, [timerConfig.initialDuration]);

  return {
    duration,
    isFinished,
    isPlaying,
    resetOrRestartToggle,
    pause,
    play,
    reset,
    restart,
  };
}
