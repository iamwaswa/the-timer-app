"use client";

import { notFound, useParams } from "next/navigation";

import { useGetTimers } from "@/hooks";

import { Timers } from "./components";

type TimerPageParams = {
  timerId: string;
};

export default function TimerPage() {
  const [timers] = useGetTimers();
  const { timerId } = useParams<TimerPageParams>();
  const timer = timers.find((t) => t.id === timerId);

  if (!timer) {
    return notFound();
  }

  return <Timers numIterations={timer.numIterations} timerConfigs={timer.timerConfigs} />;
}
