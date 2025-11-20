import { randomUUID } from "node:crypto";
import { Timers } from "@/app/components";

export default function Home() {
  return (
    <Timers
      numIterations={3}
      timerConfigs={[
        { id: randomUUID(), initialDuration: 45, title: "Modified Burpees" },
        { id: randomUUID(), initialDuration: 15, title: "Break" },
        { id: randomUUID(), initialDuration: 45, title: "Chair Dips" },
        { id: randomUUID(), initialDuration: 15, title: "Break" },
        { id: randomUUID(), initialDuration: 45, title: "Mountain Climbers" },
        { id: randomUUID(), initialDuration: 15, title: "Break" },
        { id: randomUUID(), initialDuration: 45, title: "Superman" },
        { id: randomUUID(), initialDuration: 15, title: "Break" },
        { id: randomUUID(), initialDuration: 45, title: "High Knees" },
        { id: randomUUID(), initialDuration: 60, title: "Long Break" },
      ]}
    />
  );
}
