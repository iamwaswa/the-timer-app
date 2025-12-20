"use client";

import { notFound, useParams } from "next/navigation";

import { useGetTimersContext } from "@/context";

import { SequentialTimerIntervals } from "./components";

type TimerPageParams = {
  timerId: string;
};

export default function TimerPage() {
  const timers = useGetTimersContext();
  const { timerId } = useParams<TimerPageParams>();
  const timer = timers.find((t) => t.id === timerId);

  if (!timer) {
    return notFound();
  }

  return <SequentialTimerIntervals numIterations={timer.numIterations} timerIntervals={timer.timerIntervals} />;
}
