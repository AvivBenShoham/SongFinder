import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Root from "./Root";
import Home from "./Home";
import Words from "./Words";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import FontDownloadRoundedIcon from "@mui/icons-material/FontDownloadRounded";
import SongLyrics from "./SongLyrics";

export const AppRoutes = {
  Home: {
    path: "home",
    icon: <HomeRoundedIcon />,
    element: <Home />,
  },
  Words: {
    path: "words",
    icon: <FontDownloadRoundedIcon />,
    element: <Words />,
  },
  Groups: {
    path: "groups",
    icon: <LayersOutlinedIcon />,
    element: <Home />,
  },
  Statistics: {
    path: "statistics",
    icon: <AnalyticsRoundedIcon />,
    element: <Home />,
  },
};

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root />}>
        {Object.values(AppRoutes).map((route) => (
          <Route path={route.path} element={route.element} />
        ))}
        <Route path={"lyrics/:songId"} element={<SongLyrics />} />
        <Route path="" element={<Navigate to="home" />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
