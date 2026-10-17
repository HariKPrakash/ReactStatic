import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import NewComplaintPage from "./pages/NewComplaintPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import TechnicianPage from "./pages/TechnicianPage";

export default function App() {
  // Routes that require no authentication live publicly; the technician
  // queue is served behind a login once the backend is available.
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="new-complaint" element={<NewComplaintPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="technician" element={<TechnicianPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
