import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { AppRoutes } from "../routes";
import { useLocation, useNavigate } from "react-router-dom";

export default function MenuContent() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {Object.entries(AppRoutes).map(([routeName, route]) => (
          <ListItem
            key={routeName}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => navigate(route.path)}
          >
            <ListItemButton selected={location.pathname.includes(route.path)}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={routeName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
