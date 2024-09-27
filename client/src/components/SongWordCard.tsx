import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { SongWordResult } from "../routes/Words";
import { Paper, Stack } from "@mui/material";
import { Link } from "react-router-dom";

interface SongWordCardProps extends SongWordResult {
  onClick?: (wordDoc: any) => void;
}

export default function SongWordCard(props: SongWordCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        maxHeight: 180,
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
          spacing={2}
          direction={"row"}
          sx={{ flex: 1, overflow: "auto", mt: 1, p: 1 }}
        >
          {props.documents
            .sort((a, b) => a.songId - b.songId)
            .map((doc) => {
              return (
                <Paper
                  onClick={
                    props?.onClick ? () => props?.onClick(doc) : () => {}
                  }
                  elevation={1}
                  sx={{
                    minWidth: 260,
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "primary.main",
                      "*": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {doc.songName}
                    </Typography>
                    <Typography variant="body1">
                      By: {doc.songArtist}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      stanza: {doc.stanza} | line: {doc.line} | row: {doc.row} |
                      column: {doc.col}
                    </Typography>
                  </Stack>
                </Paper>
              );
            })}
        </Stack>
      </CardContent>
    </Card>
  );
}
