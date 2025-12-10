import { Box, Button, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import Link from "next/link";

import { TimerType } from "@/types";

import { DeleteTimerPrompt } from "../delete-timer-prompt";

type TimerLinkProps = {
  timer: TimerType;
};

export function TimerLink({ timer }: TimerLinkProps) {
  return (
    <>
      <Card>
        <CardHeader
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button href={`/${timer.id}/edit`} LinkComponent={Link}>
                Edit
              </Button>
              <Button color="error" href={`?delete=${timer.id}`} LinkComponent={Link}>
                Delete
              </Button>
            </Box>
          }
          title={timer.title}
        />
        <CardActionArea href={`/${timer.id}`} LinkComponent={Link}>
          <CardContent>
            <Typography variant="body2">Number of iterations: {timer.numIterations}</Typography>
            <Box component="ol">
              {timer.timerConfigs.map((timerConfig) => (
                <Box key={timerConfig.id} component="li">
                  <Typography variant="body2">
                    {timerConfig.title} - {timerConfig.initialDuration} seconds
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <DeleteTimerPrompt timer={timer} />
    </>
  );
}
