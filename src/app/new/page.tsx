import { Box, Typography } from "@mui/material";

import { TimerForm } from "@/components";

export default function CreateTimerPage() {
  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", mt: 8, padding: 2 }}>
      <Typography component="h1" typography="h4" sx={{ mb: 2 }}>
        Create New Timer
      </Typography>
      <TimerForm />
    </Box>
  );
}
