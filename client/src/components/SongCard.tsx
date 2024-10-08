import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DefaultAlbumCover from "../assets/music-note.jpg";

interface SongCardProps {
  name: string;
  album: string;
  releaseDate: string;
  coverUrl?: string;
  artist?: { name: string };
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export default function SongCard({
  name = "",
  album = "",
  releaseDate = "",
  artist = { name: "" },
  ...props
}: SongCardProps) {
  return (
    <Card
      onClick={props?.onClick}
      sx={{
        display: "flex",
        maxHeight: 160,
        cursor: "pointer",
        "&:hover": {
          bgcolor: "primary.light",
          "*": {
            color: "primary.contrastText",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto", width: 300 }}>
          <Typography component="div" variant="h5">
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {artist.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {album}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {releaseDate}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120 }}
        src={props.coverUrl || DefaultAlbumCover}
        alt="album cover"
      />
    </Card>
  );
}
