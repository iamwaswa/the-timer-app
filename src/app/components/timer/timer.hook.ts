"use client";

import { useState, useEffect, useCallback } from "react";

export function useTimer(initialDuration: number) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(initialDuration);
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
    setDuration(initialDuration);
    setIsPlaying(false);
    setResetOrRestartToggle((prev) => !prev);
  }, [initialDuration]);

  const restart = useCallback(() => {
    setDuration(initialDuration);
    setIsPlaying(true);
    setResetOrRestartToggle((prev) => !prev);
    setToggleRestartInterval((prev) => !prev);
  }, [initialDuration]);

  return {
    duration,
    isPlaying,
    resetOrRestartToggle,
    pause,
    play,
    reset,
    restart,
  };
}
