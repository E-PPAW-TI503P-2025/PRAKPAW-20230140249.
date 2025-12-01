import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import LaporanPage from './components/LaporanPage';

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Navigate  to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/Presensi" element={<PresensiPage />} />
          <Route path="/Laporan" element={<LaporanPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;