import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Menu, MenuItem, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import httpClient from "../httpClient";
import { useQuery } from "@tanstack/react-query";
import { SongLyrics } from "../routes/SongLyrics";
import { useCreatePhraseMutation } from "../hooks";
import { useSearchParams } from "react-router-dom";
import { formatText } from "../utils";

export interface SongCardProps {
  songId: number;
  hoveredMatch:
    | { row: number; col: number; stanza: number; line: number }[]
    | null;
}

export default function LyricsCard({ songId, hoveredMatch }: SongCardProps) {
  const {
    data: { lyrics },
  } = useQuery({
    queryKey: ["songs", "lyrics", songId],
    queryFn: async () =>
      (await httpClient.get(`lyrics/${songId}`)).data as SongLyrics,
    initialData: { lyrics: [] } as SongLyrics,
  });

  const [textSelection, setTextSelection] = React.useState("");
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const mutation = useCreatePhraseMutation({ songId });
  const [searchParams] = useSearchParams();

  console.log(searchParams.get("word"));

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

    const newSelection = (window?.getSelection() || "")
      ?.toString()
      .replace(/\s+/g, " ")
      .trim();

    setTextSelection(newSelection);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCreatePhrase = async () => {
    await mutation.mutateAsync(textSelection);

    handleClose();
    setTextSelection("");
  };

  const isWordInMatch = ({
    stanzaIndex,
    lineIndex,
    col,
  }: {
    stanzaIndex: number;
    lineIndex: number;
    col: number;
  }) =>
    (hoveredMatch || [])?.some(
      (songWord) =>
        songWord.col === col + 1 &&
        songWord.line === lineIndex + 1 &&
        songWord.stanza === stanzaIndex + 1
    );

  const selectedWord = searchParams.get("word");

  return (
    <Card
      sx={{
        display: "flex",
        flex: "1",
        overflowY: "auto",
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
                        <Stack direction={"row"} spacing={0.5}>
                          {line.split(" ").map((word, col) => {
                            return (
                              <Typography
                                variant="body1"
                                onContextMenu={handleContextMenu}
                                sx={{
                                  cursor: "context-menu",
                                  ...(isWordInMatch({
                                    stanzaIndex,
                                    lineIndex,
                                    col,
                                  }) && {
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    fontWeight: 600,
                                  }),
                                  ...(selectedWord &&
                                    formatText(word) ===
                                      formatText(selectedWord as string) && {
                                      fontWeight: 700,
                                      textDecoration: "underline",
                                    }),
                                }}
                              >
                                {word}
                              </Typography>
                            );
                          })}
                        </Stack>
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
    </Card>
  );
}
