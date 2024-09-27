import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Add, Delete, GroupAdd, LibraryAdd } from "@mui/icons-material";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid2";
import { useMutation } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { Typography, IconButton } from "@mui/material";

const schema = yup.object().shape({
  groupName: yup.string().required("Phrase is required"),
  words: yup.array().of(
    yup.object().shape({
      word: yup.string().required("word is required"),
    })
  ),
});

interface GroupForm {
  groupName?: string;
  words?: { word: string }[];
}

const CreateGroupDialog = () => {
  const [open, setOpen] = React.useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "words",
  });

  const mutation = useMutation({
    mutationFn: async (group: GroupForm) =>
      await Promise.allSettled(
        (group?.words || []).map(async ({ word }) =>
          httpClient.post("/groups", { groupName: group.groupName, word })
        )
      ),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset({ words: [], groupName: "" });
  };

  const onSubmit = async (group: GroupForm) => {
    await mutation.mutateAsync(group);

    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<LibraryAdd />}
      >
        Create Group
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} marginY={1}>
              <Grid size={12}>
                <Controller
                  name="groupName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Group Name"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid container size={12} alignItems={"center"} spacing={1}>
                <Grid size={12}>
                  {fields.length > 0 && (
                    <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                      Words:
                    </Typography>
                  )}
                </Grid>
                {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <Grid size={11}>
                      <Controller
                        name={`words.${index}.word`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Word"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={1}>
                      <IconButton color="error" onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => append({ word: "" })}
                  startIcon={<Add />}
                >
                  Add Word
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </LocalizationProvider>
      </Dialog>
    </React.Fragment>
  );
};

export default CreateGroupDialog;
