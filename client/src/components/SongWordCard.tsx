import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { SongWordResult } from "../routes/Words";
import { Stack } from "@mui/material";

export default function SongWordCard(props: SongWordResult) {
  return (
    <Card
      sx={{
        display: "flex",
        maxHeight: 160,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          flex: "1 0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {props.word}
        </Typography>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ flex: 1, overflow: "auto", mt: 1 }}
        >
          {props.documents
            .sort((a, b) => a.songId - b.songId)
            .map((doc) => {
              return (
                <Stack
                  sx={{
                    minWidth: 200,
                    bgcolor: "#e1e1e129",
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#2e7074b8",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "600",
                      color: "text.primary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Song: {doc.songId}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    row: {doc.row}, column: {doc.col}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    stanza: {doc.stanza}, line: {doc.line}
                  </Typography>
                </Stack>
              );
            })}
        </Stack>
      </CardContent>
    </Card>
  );
}
