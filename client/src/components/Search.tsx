import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface SearchProps extends OutlinedInputProps {}

export default function Search(props: SearchProps) {
  return (
    <FormControl
      sx={{ width: { xs: "100%", md: "25ch" }, ...props.sx }}
      variant="outlined"
    >
      <OutlinedInput
        {...props}
        size="small"
        id="search"
        placeholder={props.placeholder || "Search…"}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search",
        }}
      />
    </FormControl>
  );
}
