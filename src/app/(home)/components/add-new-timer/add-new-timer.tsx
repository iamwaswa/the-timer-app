import { Card, CardActionArea, CardHeader } from "@mui/material";
import Link from "next/link";

type AddNewTimerProps = {
  itemHeight: number | undefined;
};

export function AddNewTimer({ itemHeight: itemHeight }: AddNewTimerProps) {
  return (
    <Card
      sx={{
        height: itemHeight,
      }}
    >
      <CardActionArea href="/new" LinkComponent={Link} sx={{ height: "100%" }}>
        <CardHeader title="Add new timer" />
      </CardActionArea>
    </Card>
  );
}
