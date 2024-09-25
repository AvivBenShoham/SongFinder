import * as React from "react";
import Stack from "@mui/material/Stack";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import ToggleColorMode, { ToggleColorModeProps } from "./ToggleColorMode";
import SongFormDialog from "./SongFormDialog";

export interface HeaderProps extends ToggleColorModeProps {}

export default function Header(props: HeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack
        direction="row"
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
        }}
        spacing={2}
      >
        <SongFormDialog />
        <ToggleColorMode
          data-screenshot="toggle-mode"
          mode={props.mode}
          toggleColorMode={props.toggleColorMode}
        />
      </Stack>
    </Stack>
  );
}
