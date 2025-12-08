import { type Breakpoint, Card, CardActionArea, CardHeader } from "@mui/material";
import Link from "next/link";

type AddNewTimerProps = {
  singleColumnBreakpoint: Breakpoint;
  minHeight: number | null;
};

export function AddNewTimer({ singleColumnBreakpoint, minHeight }: AddNewTimerProps) {
  return (
    <Card
      sx={(theme) => ({
        height: "100%",
        [theme.breakpoints.down(singleColumnBreakpoint)]: {
          minHeight,
        },
      })}
    >
      <CardActionArea href="/new" LinkComponent={Link} sx={{ height: "100%" }}>
        <CardHeader title="Add new timer" />
      </CardActionArea>
    </Card>
  );
}
