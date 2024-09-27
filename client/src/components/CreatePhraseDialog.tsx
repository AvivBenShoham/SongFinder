import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Add } from "@mui/icons-material";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid2";
import { useCreatePhraseMutation } from "../hooks";

const schema = yup.object().shape({
  phrase: yup.string().required("Phrase is required"),
});

const CreatePhraseDialog = ({ songId }: { songId: number }) => {
  const [open, setOpen] = React.useState(false);

  const mutation = useCreatePhraseMutation({ songId });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset({ phrase: "" });
  };

  const onSubmit = async ({ phrase }: { phrase: string }) => {
    await mutation.mutateAsync(phrase);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} startIcon={<Add />}>
        Add Phrase
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
          <DialogTitle>Add New Phrase</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} marginY={1}>
              <Grid size={12}>
                <Controller
                  name="phrase"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Phrase"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
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

export default CreatePhraseDialog;
