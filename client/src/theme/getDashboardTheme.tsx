import type {} from "@mui/material/themeCssVarsAugmentation";
import { ThemeOptions, PaletteMode } from "@mui/material/styles";
import { getDesignTokens } from "./themePrimitives";
import {
  chartsCustomizations,
  datePickersCustomizations,
  dataDisplayCustomizations,
  feedbackCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
  inputsCustomizations,
} from "./customizations";

export default function getDashboardTheme(mode: PaletteMode): ThemeOptions {
  return {
    ...getDesignTokens(mode),
    components: {
      ...inputsCustomizations,
      ...chartsCustomizations,
      ...datePickersCustomizations,
      ...dataDisplayCustomizations,
      ...feedbackCustomizations,
      ...navigationCustomizations,
      ...surfacesCustomizations,
    },
  };
}
