import * as React from "react";
import { PaletteMode } from "@mui/material/styles";
import { WbSunny, ModeNight } from "@mui/icons-material";
import MenuButton, { MenuButtonProps } from "./MenuButton";

export interface ToggleColorModeProps extends MenuButtonProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function ToggleColorMode({
  mode,
  toggleColorMode,
  ...props
}: ToggleColorModeProps) {
  return (
    <MenuButton
      onClick={toggleColorMode}
      size="small"
      aria-label="button to toggle theme"
      {...props}
      sx={{ border: "0.5px solid", borderRadius: 1 }}
    >
      {mode === "dark" ? (
        <WbSunny fontSize="small" />
      ) : (
        <ModeNight fontSize="small" />
      )}
    </MenuButton>
  );
}
