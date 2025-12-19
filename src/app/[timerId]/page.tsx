"use client";

import { notFound, useParams } from "next/navigation";

import { useGetTimersContext } from "@/context";

import { TimerIntervals } from "./components";

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

  return <TimerIntervals numIterations={timer.numIterations} timerIntervals={timer.timerIntervals} />;
}
