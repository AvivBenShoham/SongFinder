import * as React from "react";
import Typography from "@mui/material/Typography";
import { Stack, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useParams, useSearchParams } from "react-router-dom";
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
  artist: { name: string };
}

export default function SongLyrics() {
  const params = useParams();
  const [hoveredMatch, setHoveredMatch] = React.useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: songData } = useQuery({
    queryKey: ["songs", params.songId],
    queryFn: async () =>
      (await httpClient.get(`songs/${params.songId}`)).data as SongData,
    initialData: {} as SongData,
  });

  const handleSearchParamsChange = (key: string, value: any) => {
    setSearchParams((prev) => {
      prev.set(key, value);

      return prev;
    });
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
      <Stack
        direction={"row"}
        paddingY={2}
        justifyContent={"space-between"}
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Typography variant="h4">
          {songData.name} by {songData?.artist?.name}
        </Typography>
        <TextField
          label="Search Word"
          value={searchParams.get("word")}
          onChange={(event) =>
            handleSearchParamsChange("word", event.target.value)
          }
        />
      </Stack>
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
