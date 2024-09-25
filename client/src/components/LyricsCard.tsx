import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Menu, MenuItem, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import httpClient from "../httpClient";
import { useMutation } from "@tanstack/react-query";

export interface SongCardProps {
  lyrics: string[][];
  songId: number;
}

export default function LyricsCard({
  lyrics = [] as string[][],
  songId,
}: SongCardProps) {
  const [textSelection, setTextSelection] = React.useState("");
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (songPhrase: { phrase: string; songId: number }) => {
      return httpClient.post("/phrases", songPhrase);
    },
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );

    setTextSelection((window?.getSelection() || "").toString());
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCreatePhrase = async () => {
    await mutation.mutateAsync({ phrase: textSelection, songId });

    handleClose();
    setTextSelection("");
  };

  return (
    <Card
      sx={{
        display: "flex",
        flex: "1",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          p: 1,
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          {lyrics.length > 0 ? (
            <>
              <Stack direction={"row"}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    width: "60px",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Stanza
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    width: "48px",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Line
                </Typography>
              </Stack>
              {lyrics.map((stanza, stanzaIndex) => {
                return (
                  <>
                    {stanza.map((line, lineIndex) => {
                      return (
                        <Stack direction={"row"} key={line + lineIndex}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              width: "60px",
                            }}
                          >
                            {lineIndex === 0 && stanzaIndex + 1}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              width: "48px",
                            }}
                          >
                            {lineIndex + 1}
                          </Typography>
                          <Typography
                            variant="body1"
                            onContextMenu={handleContextMenu}
                            sx={{ cursor: "context-menu" }}
                          >
                            {line}
                          </Typography>
                        </Stack>
                      );
                    })}
                    <Box key={stanzaIndex} sx={{ height: "16px" }} />
                  </>
                );
              })}
              <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                  contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
              >
                <MenuItem onClick={handleCreatePhrase}>
                  <AddCircleIcon fontSize="small" sx={{ mr: 1 }} />
                  Create Phrase: {textSelection}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Typography variant="h4">No lyrics found</Typography>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}
