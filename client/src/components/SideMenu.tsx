import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        padding={1.5}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        direction="row"
        sx={{ width: "100%" }}
      >
        <LibraryMusicIcon />
        <Typography variant="h3">SongFinder</Typography>
      </Stack>
      <Divider />
      <MenuContent />
    </Drawer>
  );
}
