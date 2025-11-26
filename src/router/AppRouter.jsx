import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Candidates from "../pages/Candidates";
import Interviews from "../pages/InterviewsPage";
import Settings from "../pages/Settings";
import UpcomingInterviews from "../pages/UpcomingInterview";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/upcoming-interviews" element={<UpcomingInterviews />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
