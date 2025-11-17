"use client";

import { pickTimerColor, Timer, useTimer } from "@/app/components";

export default function Home() {
  const initialDuration = 60;
  const {
    duration,
    isPlaying,
    resetOrRestartToggle,
    pause,
    play,
    reset,
    restart,
  } = useTimer(initialDuration);

  return (
    <Timer
      backgroundColor={pickTimerColor()}
      duration={duration}
      initialDuration={initialDuration}
      isPlaying={isPlaying}
      resetOrRestartToggle={resetOrRestartToggle}
      title="Workout"
      pause={pause}
      play={play}
      reset={reset}
      restart={restart}
    />
  );
}
