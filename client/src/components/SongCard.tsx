import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function SongCard({
  name = "",
  album = "",
  releaseDate = "",
  coverUrl = "",
  artist = "",
}) {
  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto", width: 300 }}>
          <Typography component="div" variant="h5">
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {artist || name.split("by").slice(-1)[0].trim()}
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
        image={coverUrl}
        alt="album cover"
      />
    </Card>
  );
}
