import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage"; // твоя перша сторінка/герой
import TripsPage from "./pages/TripsPages";
import CalendarPage from "./pages/CalendarPage";
import MapsPage from "./pages/MapsPage";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/trips" element={<TripsPage/>} />
        <Route path="/calendar" element={<CalendarPage/>} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/maps" element={<MapsPage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}