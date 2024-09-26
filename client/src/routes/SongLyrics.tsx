import * as React from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useParams } from "react-router-dom";
import LyricsCard from "../components/LyricsCard";
import PhrasesCard from "../components/PhrasesCard";

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
  const [hoveredMatch, setHoveredMatch] = React.useState(null);

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
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: { sm: "100%", md: "1700px" },
          overflow: "hidden",
        }}
      >
        <LyricsCard
          hoveredMatch={hoveredMatch}
          songId={Number(params.songId)}
        />
        <PhrasesCard
          setHoveredMatch={setHoveredMatch}
          songId={Number(params.songId)}
        />
      </Stack>
    </Stack>
  );
}
