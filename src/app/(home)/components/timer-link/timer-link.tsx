import { Box, Button, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import Link from "next/link";

import type { Timer } from "@/types";

type TimerLinkProps = {
  timer: Timer;
};

export function TimerLink({ timer }: TimerLinkProps) {
  return (
    <Card>
      <CardHeader
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button href={`/${timer.id}/edit`} LinkComponent={Link}>
              Edit
            </Button>
            <Button color="error" href={`/${timer.id}/delete`} LinkComponent={Link}>
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
            {timer.timerIntervals.map((timerInterval) => (
              <Box key={timerInterval.id} component="li">
                <Typography variant="body2">
                  {timerInterval.title} - {timerInterval.duration} seconds
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
