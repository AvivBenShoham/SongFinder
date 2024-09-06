import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function MediaControlCard() {
  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto", minWidth: 150 }}>
          <Typography component="div" variant="h5">
            Song Name
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            Artist
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Album
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Release Year
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 120 }}
        image="https://picsum.photos/120"
        alt="album cover"
      />
    </Card>
  );
}
