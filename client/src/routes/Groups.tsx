import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "../httpClient";
import CreateGroupDialog from "../components/CreateGroupDialog";
import { Delete, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from ".";

export default function Groups() {
  const navigate = useNavigate();
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => (await httpClient.get(`groups`)).data,
    initialData: [],
  });

  const queryClient = useQueryClient();

  const removeWordMutation = useMutation({
    mutationFn: async (group: { groupName: string; word: string }) => {
      await httpClient.delete("/groups/word", { data: group });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleRemoveGroupWord = async (groupName: string, word: string) => {
    await removeWordMutation.mutateAsync({ groupName, word });
  };

  const removeGroupMutation = useMutation({
    mutationFn: async (group: { groupName: string }) => {
      await httpClient.delete("/groups", { data: group });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleRemoveGroup = async (
    event: React.MouseEvent,
    groupName: string
  ) => {
    event.stopPropagation();
    await removeGroupMutation.mutateAsync({ groupName });
  };

  const handleGroupSearch = (event: React.MouseEvent, groupName: string) => {
    event.stopPropagation();

    navigate(`/${AppRoutes.Words.path}?groups=${groupName}`);
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
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
          Groups
        </Typography>
        <CreateGroupDialog />
      </Stack>
      <Stack marginY={2}>
        {groups.map(({ groupName, words }) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <IconButton>
                    <Delete
                      onClick={(event) => handleRemoveGroup(event, groupName)}
                    />
                  </IconButton>
                  <Typography variant="h6">
                    {`${groupName} (${words?.length} words)`}
                  </Typography>
                  <IconButton>
                    <Search
                      onClick={(event) => handleGroupSearch(event, groupName)}
                    />
                  </IconButton>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5} direction={"row"}>
                  {words?.map((word: string, wordIndex: number) => (
                    <Chip
                      key={wordIndex}
                      label={word}
                      sx={{ margin: 0.5 }}
                      size="medium"
                      onDelete={() => handleRemoveGroupWord(groupName, word)}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Stack>
  );
}
