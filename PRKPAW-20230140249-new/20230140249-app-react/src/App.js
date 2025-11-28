import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";

function Wrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Routes>

      {/* ➤➤ TAMBAHKAN ROUTE INI DI SINI */}
      <Route path="/" element={<LoginPage />} />
      {/* ➤➤ SELESAI */}

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={<DashboardPage navigate={navigate} currentPath={location.pathname} />}
      />

      <Route
        path="/presensi"
        element={<PresensiPage navigate={navigate} />}
      />

      <Route
        path="/reports"
        element={<ReportPage navigate={navigate} />}
      />

      {/* ➤➤ OPTIONAL: SUPAYA SEMUA ROUTE YANG TIDAK TERDAFTAR MASUK KE LOGIN */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Wrapper />
    </BrowserRouter>
  );
}
