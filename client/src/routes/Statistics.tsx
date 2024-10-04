import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import NumberedStatCard from "../components/NumberedStatCard";
import ArtistTable from "../components/ArtistTable";
import WordCloud from "../components/WordCloud";
import AverageStats from "../components/AverageStats";

export default function Statistics() {
  const { data: {counts, wordsWithMostAppearances } } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => (await httpClient.get(`statistics`)).data,
    initialData: { counts: { songs: 0, artists: 0, words: 0 }, wordsWithMostAppearances: [] },
  });

  console.log(counts)

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
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
          Statistics
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        spacing={{ md: 3, sm: 1, xs: 1 }}
        justifyContent={"center"}
      >
        <NumberedStatCard name="Songs" count={counts?.songs} />
        <NumberedStatCard name="Words" count={counts?.words} />
        <NumberedStatCard name="Artists" count={counts?.artists} />
      </Stack>
      <Stack direction="row" justifyContent="space-evenly" paddingTop="1rem">
        <ArtistTable artistCount={counts?.artists}/>
        <WordCloud words={wordsWithMostAppearances} height={400} width={400} />
        <AverageStats />
      </Stack>
    </Stack>
  );
}
