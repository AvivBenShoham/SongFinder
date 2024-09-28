import * as React from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";

export default function Statistics() {
  const navigate = useNavigate();
  const { data: groups } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => (await httpClient.get(`statistics`)).data,
    initialData: [],
  });

  const queryClient = useQueryClient();

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
      <Stack marginY={2}></Stack>
    </Stack>
  );
}
