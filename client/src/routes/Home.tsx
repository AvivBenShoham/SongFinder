import * as React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SongCard from "../components/SongCard";
import Autocomplete from "../components/Autocomplete";
import { Pagination, Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Search from "../components/Search";
import { useDebounce } from "@uidotdev/usehooks";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const navigate = useNavigate();

  const queryString = useDebounce(searchParams.toString(), 300);

  const {
    data: { songs, totalPages },
  } = useQuery({
    queryKey: ["songs", queryString, page, rowsPerPage],
    queryFn: async () =>
      (
        await httpClient.get(
          `songs?page=${page}&pageSize=${rowsPerPage}&${queryString}`
        )
      ).data,
    initialData: { songs: [], totalPages: 1, total: 0 },
  });

  const handleSearchParamsChange = (key: string, value: any) => {
    setPage(1);

    setSearchParams((prev) => {
      prev.delete(key);

      if (typeof value === "object" && value?.length >= 0) {
        value.forEach((element: string) => {
          prev.append(key, element);
        });
      } else if (value) {
        prev.set(key, value);
      }

      return prev;
    });
  };

  const getSearchParamValue = (key: string) => {
    const value = searchParams.get(key);

    return value;
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPage(page);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        overflow: "hidden",
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
        Overview
      </Typography>
      <Stack direction="row" spacing={1} marginY={2}>
        <Search
          sx={{ minWidth: 240 }}
          placeholder="Search by song name..."
          value={searchParams.get("songName")}
          onChange={(event) => {
            handleSearchParamsChange("songName", event.target.value);
          }}
        />
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
        sx={{
          mb: (theme) => theme.spacing(2),
          flex: 1,
          overflowY: "auto",
        }}
      >
        {songs.map(
          (
            song: JSX.IntrinsicAttributes & {
              name?: string | undefined;
              album?: string | undefined;
              releaseDate?: string | undefined;
              coverUrl?: string | undefined;
              artist?: string | undefined;
            }
          ) => (
            <SongCard
              key={song?.id}
              {...song}
              onClick={() => {
                navigate(`/lyrics/${song?.id}`);
              }}
            />
          )
        )}
      </Grid>
      <Pagination
        page={page}
        count={totalPages}
        color="primary"
        onChange={handleChangePage}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
