import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import httpClient from "../httpClient";
import { useQuery } from "@tanstack/react-query";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import CreatePhraseDialog from "./CreatePhraseDialog";

export interface PhrasesCardProps {
  songId: number;
  setHoveredMatch: (match: any) => void;
}

export default function PhrasesCard({
  songId,
  setHoveredMatch,
}: PhrasesCardProps) {
  const { data: phrases } = useQuery({
    queryKey: ["songs", "phrases", songId],
    queryFn: async () => (await httpClient.get(`phrases/${songId}`)).data,
    initialData: [],
  });

  return (
    <Card
      sx={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h5">Phrases</Typography>
        <CreatePhraseDialog songId={songId} />
      </Stack>
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Stack>
          {phrases.map(({ phrase, matches }) => {
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography variant="h6">
                    {" "}
                    {`${phrase} (${matches.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={0.5}>
                    {matches.map(
                      (
                        match: { stanza: number; line: number; col: number }[],
                        index: number
                      ) => {
                        return (
                          <React.Fragment key={index}>
                            <Typography
                              sx={{
                                p: 1,
                                fontSize: "0.9rem",
                                cursor: "pointer",
                                fontWeight: 300,
                                "&:hover": {
                                  bgcolor: "primary.light",
                                  fontWeight: 500,
                                },
                              }}
                              onMouseEnter={() => setHoveredMatch(match)}
                              onMouseLeave={() => setHoveredMatch(null)}
                            >
                              stanza: {match[0].stanza}, line: {match[0].line},
                              col: {match[0].col}
                            </Typography>
                            <Divider variant="middle" />
                          </React.Fragment>
                        );
                      }
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
