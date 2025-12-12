import { Grid } from "@mui/material";
import { useId } from "react";

import { TimersClientOnlyComponent } from "./components";

export default function HomePage() {
  const gridContainerId = useId();

  return (
    <Grid
      alignItems="stretch"
      id={gridContainerId}
      columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
      container={true}
      spacing={2}
      padding={2}
    >
      <TimersClientOnlyComponent parentElementId={gridContainerId} />
    </Grid>
  );
}
