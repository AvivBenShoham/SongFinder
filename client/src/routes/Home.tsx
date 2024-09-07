import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "../components/StatCard";
import SongCard from "../components/SongCard";
import Autocomplete from "../components/Autocomplete";
import { Stack, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import dayjs from "dayjs";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: songs } = useQuery({
    queryKey: ["songs"],
    queryFn: async () =>
      (await httpClient.get(`songs?${searchParams.toString()}`)).data,
    initialData: [],
  });

  const handleSearchParamsChange = (key: string, value: any) => {
    setSearchParams({ ...searchParams, [key]: value });
  };

  const getSearchParamValue = (key: string) => {
    const value = searchParams.get(key);

    return value;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Stack direction="row" spacing={1} marginY={2}>
        <Autocomplete
          label="Filter words"
          freeSolo
          value={searchParams.getAll("words")}
          onChange={(_, newValue) =>
            handleSearchParamsChange("words", newValue)
          }
        />
        <Autocomplete
          label="Filter albums"
          freeSolo
          value={searchParams.getAll("albums")}
          onChange={(_, newValue) =>
            handleSearchParamsChange("albums", newValue)
          }
        />
        <Autocomplete
          label="Filter artists"
          freeSolo
          value={searchParams.getAll("artists")}
          onChange={(_, newValue) =>
            handleSearchParamsChange("artists", newValue)
          }
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filter by date"
            slotProps={{ textField: { size: "small" } }}
            sx={{ minWidth: 200 }}
            value={dayjs(getSearchParamValue("date") || new Date())}
            onChange={(newValue) => handleSearchParamsChange("date", newValue)}
          />
        </LocalizationProvider>{" "}
      </Stack>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {songs.map((song) => (
          <SongCard key={song.songid} {...song} />
        ))}
        {[].map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
