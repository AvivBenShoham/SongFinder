import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DefaultAlbumCover from "../assets/music-note.jpg";
import { ArtistDto } from "./ArtistTable";



export default function ArtistCard({
    artist,
}: { artist: ArtistDto }) {
    console.log(artist)
  return (
    <Card
      sx={{
        display: "flex",
        maxHeight: 160,
        cursor: "default",
        "&:hover": {
          bgcolor: "primary.light",
          "*": {
            color: "primary.contrastText",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center" }}>
        <CardContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column", flex: "1 0 auto", width: 300 }}>
            <Typography component="div" variant="h5" align="center" textAlign="center">
            {artist.artistName}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
                textAlign: "center",
            }}
          >
            <Box sx={{ padding: "10px" }}>
                {`Total Songs: ${artist?.count}`}
            </Box>
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80 }}
        src={artist?.artistImageUrl || DefaultAlbumCover}
        alt="artist image"
      />
    </Card>
  );
}
