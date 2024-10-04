import * as React from "react";
import ArtistCard from "./ArtistCard";
import { Box, Pagination, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import httpClient from "../httpClient";

export interface ArtistDto {
    artistName: string;
    artistImageUrl: string;
    count: number; // songs count
}

export interface ArtistTableProps {
    artistCount: number;
}

export default function ArtistTable({ artistCount }: ArtistTableProps) {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(4);
    const [previousData, setPreviousData] = React.useState([]); // State to store previous data

    const { data: artists, isFetching } = useQuery({
        queryKey: ["aritstsStatistics", page, pageSize],
        queryFn: async () => (await httpClient.get(`statistics/artistWithMostSongs?page=${page}&pageSize=${pageSize}`)).data,
        initialData: previousData,
    });

    const handleChangePage = (
        event: React.ChangeEvent<unknown>,
        page: number
      ) => {
        setPage(page);
      };

      // Calculate how many cards can fit
      React.useEffect(() => {
        const handleResize = () => {
          const cardHeight = 200;
          const cardCount = Math.floor(window.innerHeight / cardHeight);
          setPageSize(cardCount);
        };
    
        handleResize();

        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);


      React.useEffect(() => {
        if (!isFetching && artists) {
          setPreviousData(artists); // Update previous data when new data is fetched
        }
      }, [artists, isFetching]);

    return (
        <Box sx={{ p: 2, border: '1px solid', borderColor: `${localStorage.getItem("themeMode") === "dark" ? "hsl(220, 20%, 35%)" : "hsl(220deg 71.57% 86.67%)"}`, borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
         }}>
            <div style={{ marginBottom: "0.5rem" }} />
            <Typography variant="h5" textAlign="center">Top Artists By Song Count</Typography>
            {artists?.map((artist: ArtistDto) => (
                <React.Fragment key={artist.artistName}>
                    <div style={{ marginBottom: "0.5rem" }} />
                    <ArtistCard artist={artist} />
                </React.Fragment>
            ))}
            <div style={{ marginBottom: "0.5rem" }} />
            <Pagination
                    page={page}
                    count={(artists?.length && artistCount) ? Math.ceil(artistCount / artists?.length) : 1}
                    color="primary"
                    onChange={handleChangePage}
                    showFirstButton
                    showLastButton
            />
        </Box>
    );
}
