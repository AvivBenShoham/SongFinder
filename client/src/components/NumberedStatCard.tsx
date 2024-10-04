import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface NumberedStatCard {
  name: string;
  count: number;
  isFetching ?: boolean;
}

export default function NumberedStatCard({
  name = "",
  count = 0,
  isFetching = false,
}: NumberedStatCard) {

  return (
    <Card
      sx={{
        display: "flex",
        maxHeight: 160,
        cursor: "default", // Update cursor property
        "&:hover": {
          bgcolor: "primary.light",
          "*": {
            color: "primary.contrastText",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CardContent sx={{ flex: "1 0 auto", width: 300 }}>
          <Typography component="div" variant="h5" align="center" textAlign="center">
            {`Total ${name}`}
          </Typography>
          <Box sx={{ height: 8 }} /> {/* Add padding */}
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
          </Typography>
          <Box sx={{ height: 8 }} /> {/* Add padding */}
          {
            isFetching ?
            <Typography variant="h3" sx={{ color: "text.secondary", textAlign: "center" }}>
              <LinearProgress /> 
            </Typography>
            :
            <Typography variant="h3" sx={{ color: "text.secondary", textAlign: "center" }}>
              {count}
            </Typography>
          }
        </CardContent>
      </Box>
    </Card>
  );
}
