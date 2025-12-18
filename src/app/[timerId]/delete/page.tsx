"use client";

import { redirect, useParams } from "next/navigation";

import { useTimersContext } from "@/context";

import { DeleteTimerPrompt } from "./components";

type DeleteTimerPageParams = {
  timerId: string;
};

export default function DeleteTimerPage() {
  const [timers, setTimers] = useTimersContext();
  const { timerId } = useParams<DeleteTimerPageParams>();
  const timer = timers.find((t) => t.id === timerId);

  if (!timer) {
    return redirect("/");
  }

  return <DeleteTimerPrompt timer={timer} timers={timers} setTimers={setTimers} />;
}
