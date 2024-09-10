import * as React from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useParams, useSearchParams } from "react-router-dom";
import LyricsCard from "../components/LyricsCard";

export interface SongLyrics {
  lyrics: string[][];
}

export interface SongData {
  id: number;
  name: string;
  album: string;
  releaseDate: string;
  createdAt: string;
  coverUrl: string;
}

export default function SongLyrics() {
  const params = useParams();

  const { data: songLyrics } = useQuery({
    queryKey: ["songs", "lyrics", params.songId],
    queryFn: async () =>
      (await httpClient.get(`lyrics/${params.songId}`)).data as SongLyrics,
    initialData: { lyrics: [] } as SongLyrics,
  });

  const { data: songData } = useQuery({
    queryKey: ["songs", params.songId],
    queryFn: async () =>
      (await httpClient.get(`songs/${params.songId}`)).data as SongData,
    initialData: {} as SongData,
  });

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
        {songData.name}
      </Typography>
      <LyricsCard lyrics={songLyrics.lyrics} />
    </Stack>
  );
}
