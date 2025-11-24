import { useState, useEffect } from "react";
import type { TimerType } from "@/types";

export function useGetTimers() {
  const [timers, setTimers] = useState<TimerType[]>([]);

  useEffect(() => {
    if (localStorage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimers(
        (window.localStorage
          ? JSON.parse(window.localStorage.getItem("timers") ?? "[]")
          : []) as TimerType[]
      );
    }
  }, []);

  return timers;
}
