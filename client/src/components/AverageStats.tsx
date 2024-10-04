import { Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";
import NumberedStatCard from "../components/NumberedStatCard";

export default function AverageStats() {
  const { data: { songWordAverage,
    charAveragePerWord,
    charAveragePerLine,
    stanzaAverage }, isFetching } = useQuery({
    queryKey: ["statisticsAvgs"],
    queryFn: async () => (await httpClient.get(`statistics/averages`)).data,
    initialData: { },
  });

  return (
      <Stack
        direction={{ xs: "column" }}
        spacing={{ md: 4, sm: 2, xs: 1 }}
        justifyContent="space-evenly"
      >
          <NumberedStatCard name="Average Words Per Song" count={songWordAverage} isFetching={isFetching} />
          <NumberedStatCard name="Average Stanzas Per Song" count={stanzaAverage} isFetching={isFetching} />
          <NumberedStatCard name="Average Chars Per Line" count={charAveragePerLine} isFetching={isFetching} />
          <NumberedStatCard name="Average Chars Per Word" count={charAveragePerWord} isFetching={isFetching} />
            <Box padding="1rem" />
      </Stack>
  );
}
