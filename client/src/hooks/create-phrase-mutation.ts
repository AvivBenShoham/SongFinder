import { useMutation, useQueryClient } from "@tanstack/react-query";
import httpClient from "../httpClient";

interface CreatePhraseMutationProps {
  songId: number;
}

export const useCreatePhraseMutation = ({
  songId,
}: CreatePhraseMutationProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (phrase: string) => {
      return httpClient.post("/phrases", { phrase, songId });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["songs", "phrases", songId],
      });
    },
  });

  return mutation;
};
