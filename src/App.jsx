import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Hospital dashboard layout */}
      <Route element={<AppLayout />}>
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />

        <Route path="/404" element={<NotFound />} />
        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Route>
    </Routes>
  );
}