import * as React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Autocomplete from "../components/Autocomplete";
import { Pagination, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import SongWordCard from "../components/SongWordCard";

export interface SongWordResult {
  word: string;
  documents: {
    stanza: number;
    line: number;
    row: number;
    col: number;
    songId: number;
  }[];
}

export default function Words() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const navigate = useNavigate();

  const { data: wordsCount } = useQuery({
    queryKey: ["words", "count", searchParams.toString()],
    queryFn: async () =>
      (await httpClient.get(`lyrics/count?${searchParams.toString()}`)).data,
    initialData: 0,
  });

  const { data: words } = useQuery({
    queryKey: ["words", searchParams.toString(), page, rowsPerPage],
    queryFn: async () =>
      (
        await httpClient.get(
          `lyrics?page=${page}&pageSize=${rowsPerPage}&${searchParams.toString()}`
        )
      ).data as SongWordResult[],
    initialData: [],
  });

  const handleSearchParamsChange = (key: string, value: any) => {
    setPage(1);

    setSearchParams((prev) => {
      prev.delete(key);

      if (value?.length >= 0) {
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
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Stack direction="row" spacing={1} marginY={2}>
        <Autocomplete
          label="Filter songs"
          freeSolo
          value={searchParams.getAll("songs")}
          onChange={(_, newValue) =>
            handleSearchParamsChange("songs", newValue)
          }
        />
        <Autocomplete
          label="Filter groups"
          freeSolo
          value={searchParams.getAll("groups")}
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
