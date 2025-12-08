import { Grid } from "@mui/material";
import { TimersClientOnlyComponent } from "./components";

export default function HomePage() {
  return (
    <Grid
      alignItems="stretch"
      columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
      container={true}
      spacing={2}
      padding={2}
    >
      <TimersClientOnlyComponent singleColumnBreakpoint="sm" />
    </Grid>
  );
}
