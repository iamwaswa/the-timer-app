import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { TimerType } from "@/types";

type TimerLinkProps = {
  timer: TimerType;
};

export function TimerLink({ timer }: TimerLinkProps) {
  return (
    <Card>
      <CardActionArea href={`/${timer.id}`} LinkComponent={Link}>
        <CardHeader title={timer.title} />
        <CardContent>
          <Typography variant="body2">
            Number of iterations: {timer.numIterations}
          </Typography>
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
  );
}
