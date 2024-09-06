import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Root from "./Root";
import MainGrid from "../components/MainGrid";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="home" element={<MainGrid />} />
        <Route path="" element={<Navigate to="home" />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
