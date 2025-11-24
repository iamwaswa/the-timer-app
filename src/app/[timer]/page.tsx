"use client";

import { useParams } from "next/navigation";
import { useGetTimers } from "@/hooks";
import { Timers } from "./components";

type TimerPageParams = {
  timer: string;
};

export default function TimerPage() {
  const timers = useGetTimers();
  const { timer } = useParams<TimerPageParams>();
  const currentTimer = timers.find((t) => t.id === timer);

  if (!currentTimer) {
    return null;
  }

  return (
    <Timers
      numIterations={currentTimer.numIterations}
      timerConfigs={currentTimer.timerConfigs}
    />
  );
}
