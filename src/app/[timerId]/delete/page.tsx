"use client";

import { notFound, useParams } from "next/navigation";

import { useGetTimers } from "@/hooks";

import { DeleteTimerPrompt } from "./components";

type DeleteTimerPageParams = {
  timerId: string;
};

export default function DeleteTimerPage() {
  const [timers, key] = useGetTimers();
  const { timerId } = useParams<DeleteTimerPageParams>();
  const timer = timers.find((t) => t.id === timerId);

  if (!timer) {
    return notFound();
  }

  return <DeleteTimerPrompt timer={timer} timers={timers} timersKey={key} />;
}
