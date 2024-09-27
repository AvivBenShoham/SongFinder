import * as React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Autocomplete from "../components/Autocomplete";
import { Pagination, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import SongWordCard from "../components/SongWordCard";
import { useDebounce } from "@uidotdev/usehooks";
import Search from "../components/Search";

export interface SongWordResult {
  word: string;
  documents: {
    stanza: number;
    line: number;
    row: number;
    col: number;
    songId: number;
    songName: string;
    songArtist: string;
  }[];
}

export default function Words() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const navigate = useNavigate();

  const queryString = useDebounce(searchParams.toString(), 300);

  const { data: wordsCount } = useQuery({
    queryKey: ["words", "count", queryString],
    queryFn: async () =>
      (await httpClient.get(`lyrics/count?${queryString}`)).data,
    initialData: 0,
  });

  const { data: words } = useQuery({
    queryKey: ["words", queryString, page, rowsPerPage],
    queryFn: async () =>
      (
        await httpClient.get(
          `lyrics?page=${page}&pageSize=${rowsPerPage}&${queryString}`
        )
      ).data as SongWordResult[],
    initialData: [],
  });

  const { data: groupsNames } = useQuery({
    queryKey: ["groups"],
    queryFn: async () =>
      (await httpClient.get(`groups/names`)).data.map(
        ({ groupName }: { groupName: string }) => groupName
      ) as string[],
    initialData: [],
  });

  const { data: songs } = useQuery({
    queryKey: ["songs"],
    queryFn: async () =>
      (await httpClient.get(`songs/names`)).data as {
        name: string;
        id: number;
      }[],
    initialData: [],
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
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Stack direction="row" spacing={1} marginY={2}>
        <Search
          sx={{ minWidth: 240 }}
          placeholder="Search by word..."
          value={searchParams.get("word")}
          onChange={(event) => {
            handleSearchParamsChange("word", event.target.value);
          }}
        />
        <Autocomplete
          label="Filter songs"
          options={songs.map(({ name }) => name)}
          value={searchParams
            .getAll("songs")
            .map(
              (songId) =>
                (songs || []).find((song) => song.id === Number(songId))?.name
            )}
          onChange={(_, newValue) => {
            const newSongIds = newValue.map(
              (songName: string) =>
                songs.find((song) => song.name === songName)?.id
            );

            handleSearchParamsChange("songs", newSongIds);
          }}
        />
        <Autocomplete
          label="Filter groups"
          value={searchParams.getAll("groups")}
          options={groupsNames}
          onChange={(_, newValue) =>
            handleSearchParamsChange("groups", newValue)
          }
        />
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
        {words.map((songWord) => (
          <SongWordCard
            key={songWord.word}
            {...songWord}
            onClick={(wordDoc) => {
              navigate(`/lyrics/${wordDoc.songId}`);
            }}
          />
        ))}
      </Grid>
      <Pagination
        page={page}
        count={Math.ceil(wordsCount / rowsPerPage)}
        color="primary"
        onChange={handleChangePage}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
