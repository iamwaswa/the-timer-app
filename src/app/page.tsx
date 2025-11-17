import { randomUUID } from "node:crypto";
import { Timers } from "@/app/components";

export default function Home() {
  return (
    <Timers
      numIterations={3}
      timerConfigs={[
        { id: randomUUID(), initialDuration: 3, title: "Workout 1" },
        { id: randomUUID(), initialDuration: 2, title: "Break" },
      ]}
    />
  );
}
