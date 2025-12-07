"use client";

import dynamic from "next/dynamic";

export const TimersClientOnlyComponent = dynamic(
  () => import("./timers").then((mod) => mod.Timers),
  {
    ssr: false,
  }
);
