import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Add, Delete } from "@mui/icons-material";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid2";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import httpClient from "../httpClient";

const contributorTypes = ["producer", "singer", "writer", "compositor"];

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  album: yup.string().required("Album is required"),
  releaseDate: yup.date().required("Release date is required").nullable(),
  coverUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Cover URL is required"),
  artistName: yup.string().required("Artist name is required"),
  artistImageUrl: yup.string().url("Must be a valid URL"),
  lyrics: yup.string().required("Lyrics is required"),
  contributors: yup.array().of(
    yup.object().shape({
      artistName: yup.string().required("Contributor name is required"),
      type: yup.string().required("Contributor type is required"),
    })
  ),
});

interface SongFormData {
  name: string;
  album: string;
  releaseDate: Date | null;
  coverUrl: string;
  artistName: string;
  artistImageUrl?: string;
  lyrics: string;
  contributors?: { artistName: string; type: string }[];
}

const SongFormDialog = () => {
  const [open, setOpen] = React.useState(false);
  const mutation = useMutation({
    mutationFn: (newSong: SongFormData) => {
      return httpClient.post("/songs", newSong);
    },
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      contributors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contributors",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: SongFormData) => {
    await mutation.mutateAsync(data);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Add />}>
        Add new song
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogContent>
            <DialogContentText>Fill the song details:</DialogContentText>
            <Grid container spacing={2} marginY={1}>
              <Grid size={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Name"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="album"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Album"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="releaseDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      label="Release Date"
                      value={value}
                      onChange={onChange}
                      name="releaseDate"
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          error: !!error,
                          helperText: error?.message,
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="coverUrl"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Cover URL"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="artistName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Artist Name"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="artistImageUrl"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Artist Image URL"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="lyrics"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Lyrics"
                      multiline={true}
                      rows={15}
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
                      Contributors:
                    </Typography>
                  )}
                </Grid>
                {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <Grid size={6}>
                      <Controller
                        name={`contributors.${index}.artistName`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Contributor Name"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={5}>
                      <Controller
                        name={`contributors.${index}.type`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl error={!!error} sx={{ width: "100%" }}>
                            <InputLabel id={`contributor-type-label-${index}`}>
                              Contributor Type
                            </InputLabel>
                            <Select
                              {...field}
                              labelId={`contributor-type-label-${index}`}
                              label="Contributor Type"
                            >
                              {contributorTypes.map((type) => {
                                return <MenuItem value={type}>{type}</MenuItem>;
                              })}
                            </Select>
                            {!!error && (
                              <FormHelperText>{error?.message}</FormHelperText>
                            )}
                          </FormControl>
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
                  onClick={() => append({ artistName: "", type: "" })}
                >
                  Add Contributor
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

export default SongFormDialog;
