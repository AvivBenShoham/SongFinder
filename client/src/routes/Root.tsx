import * as React from "react";
import {
  PaletteMode,
  createTheme,
  ThemeProvider,
  alpha,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import getDashboardTheme from "../theme/getDashboardTheme";
import AppNavbar from "../components/AppNavbar";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { Outlet } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Root() {
  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const dashboardTheme = createTheme(getDashboardTheme(mode));

  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);

    localStorage.setItem("themeMode", newMode);
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: "flex", height: "100%" }}>
          <SideMenu />
          <AppNavbar />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 1,
                mt: { xs: 8, md: 0 },
                height: "100%",
              }}
            >
              <Header mode={mode} toggleColorMode={toggleColorMode} />
              <Outlet />
            </Stack>
          </Box>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
