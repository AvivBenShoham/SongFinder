import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "../components/StatCard";
import SongCard from "../components/SongCard";
import Autocomplete from "../components/Autocomplete";
import { Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function MainGrid() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Stack direction="row" spacing={1} marginY={2}>
        <Autocomplete label="Filter words" />
        <Autocomplete label="Filter albums" />
        <Autocomplete label="Filter artists" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filter by date"
            slotProps={{ textField: { size: "small" } }}
            sx={{ minWidth: 200 }}
          />
        </LocalizationProvider>{" "}
      </Stack>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        {[].map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
