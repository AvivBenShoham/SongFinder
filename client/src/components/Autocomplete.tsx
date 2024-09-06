import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface CustomAutocompleteProps {
  label?: string;
  options?: any[];
  getOptionLabel?: (option: any) => string;
}

export default function CustomAutocomplete(props: CustomAutocompleteProps) {
  return (
    <Autocomplete
      multiple
      options={props?.options || []}
      disableCloseOnSelect
      getOptionLabel={props?.getOptionLabel || ((s) => s)}
      size="small"
      limitTags={2}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;

        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.title}
          </li>
        );
      }}
      sx={{ minWidth: 300 }}
      renderInput={(params) => <TextField {...params} label={props?.label} />}
    />
  );
}
