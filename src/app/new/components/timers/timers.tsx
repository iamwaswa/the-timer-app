"use client";

import { Box, Button, TextField } from "@mui/material";

import { TimerConfig } from "@/types";
import { generateRandomUUID } from "@/utils";

type TimersProps = {
  timerConfigs: TimerConfig[];
  updateTimerConfigs(timerConfigs: TimerConfig[]): void;
};

export function Timers({ timerConfigs, updateTimerConfigs }: TimersProps) {
  const hasSingleTimerConfig = timerConfigs.length === 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {timerConfigs.map((timerConfig) => (
          <Box key={timerConfig.id} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Title"
              required={true}
              sx={{ flexGrow: 1 }}
              type="text"
              variant="outlined"
              value={timerConfig.title}
              onChange={(event) =>
                updateTimerConfigs(
                  timerConfigs.map((config) =>
                    timerConfig.id === config.id ? { ...config, title: event.currentTarget.value } : config,
                  ),
                )
              }
            />
            <TextField
              label="Initial Duration (seconds)"
              required={true}
              sx={{ flexGrow: 1 }}
              type="number"
              variant="outlined"
              value={timerConfig.initialDuration}
              onChange={(event) =>
                updateTimerConfigs(
                  timerConfigs.map((config) =>
                    config.id === timerConfig.id
                      ? {
                          ...config,
                          initialDuration: Number(event.currentTarget.value),
                        }
                      : config,
                  ),
                )
              }
            />
            <Button
              disabled={hasSingleTimerConfig}
              type="button"
              variant="text"
              onClick={() => updateTimerConfigs(timerConfigs.filter((config) => config.id !== timerConfig.id))}
            >
              Delete timer
            </Button>
          </Box>
        ))}
      </Box>
      <Button
        type="button"
        variant="outlined"
        onClick={() =>
          updateTimerConfigs([
            ...timerConfigs,
            {
              id: generateRandomUUID(),
              title: "New interval",
              initialDuration: 60,
            },
          ])
        }
      >
        Add Timer
      </Button>
    </Box>
  );
}
