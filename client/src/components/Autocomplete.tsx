import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styled from "@emotion/styled";
import { ListSubheader, Typography, Popper } from "@mui/material";
import { VariableSizeList, ListChildComponentProps } from "react-window";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  const { key, ...optionProps } = dataSet[0];

  return (
    <Typography
      key={key}
      component="li"
      {...optionProps}
      noWrap
      style={inlineStyle}
    >
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        style={{ marginRight: 8 }}
        checked={optionProps.selected}
      />
      {dataSet[1]}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactElement<any>[] = [];
  (children as React.ReactElement<any>[]).forEach(
    (
      item: React.ReactElement<any> & { children?: React.ReactElement<any>[] }
    ) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  );

  const itemCount = itemData.length;
  const itemSize = 36;

  const getChildSize = (child: React.ReactElement<any>) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export interface CustomAutocompleteProps {
  label?: string;
  options?: any[];
  getOptionLabel?: (option: any) => string;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  freeSolo?: boolean;
  value?: any[];
  onChange?: (event: Event, newValue: any) => void;
}

export default function CustomAutocomplete(props: CustomAutocompleteProps) {
  const getOptionLabel = props?.getOptionLabel || ((s) => s);
  return (
    <Autocomplete
      multiple
      options={props?.options || []}
      disableCloseOnSelect
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={props?.isOptionEqualToValue || ((o, v) => o === v)}
      size="small"
      limitTags={2}
      freeSolo={props?.freeSolo || false}
      onChange={props?.onChange}
      value={props?.value}
      sx={{ minWidth: 240 }}
      renderInput={(params) => <TextField {...params} label={props?.label} />}
      disableListWrap
      renderOption={(props, option, state) =>
        [
          { ...props, selected: state.selected },
          getOptionLabel(option),
          state.index,
        ] as React.ReactNode
      }
      slots={{
        popper: StyledPopper,
        listbox: ListboxComponent,
      }}
    />
  );
}
