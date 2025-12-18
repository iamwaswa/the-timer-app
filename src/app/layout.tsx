import { Box, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { TimersContextProviderClientOnlyComponent } from "@/context/timers/timers.context.provider";
import { theme } from "@/theme";

const font = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "The Timer App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <TimersContextProviderClientOnlyComponent>
              <Box
                component="main"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100dvh",
                }}
              >
                {children}
              </Box>
            </TimersContextProviderClientOnlyComponent>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
