import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// --- LEAFLET IMPORTS (Untuk Peta Visual Saja) ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix Icon Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function DashboardPage() {
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('');
  const [coords, setCoords] = useState(null); // Hanya untuk visualisasi peta
  
  const navigate = useNavigate();

  // 1. LOGOUT
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // 2. NAVIGASI (Tombol-tombol)
  const goToPresensi = () => navigate('/presensi');
  const goToLaporan = () => navigate('/laporan');

  // 3. AMBIL LOKASI (Hanya untuk visualisasi peta di dashboard)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return handleLogout();

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.nama || 'User');
      setUserRole(decoded.role || 'user');
      if (decoded.exp * 1000 < Date.now()) handleLogout();
    } catch (err) {
      handleLogout();
    }

    // Ambil lokasi sekedar untuk menampilkan peta "Lokasi Anda Sekarang"
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, [handleLogout]);

  // --- TAMPILAN DASHBOARD ---
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 font-serif"
      style={{
        backgroundColor: "#e8dec0",
        backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)",
        backgroundSize: "30px 30px"
      }}
    >
      {/* HEADER */}
      <header className="w-full max-w-xl flex justify-between items-center py-5 px-2 mb-4 border-b-2 border-[#5d4037] border-double">
        <h1 className="text-2xl font-bold text-[#3e2723] uppercase tracking-wider">
          🏠 DASHBOARD
        </h1>
        <button
          onClick={handleLogout}
          className="py-1 px-4 text-xs font-bold bg-[#5d4037] text-[#efebe9] border border-[#3e2723] hover:bg-[#3e2723] transition shadow-sm"
        >
          KELUAR
        </button>
      </header>

      {/* KARTU UTAMA */}
      <div 
        className="p-6 w-full max-w-xl space-y-6 relative shadow-xl"
        style={{
          backgroundColor: "#fcf5e5",
          border: "1px solid #d7ccc8",
          boxShadow: "8px 8px 0px rgba(93, 64, 55, 0.2)",
        }}
      >
        {/* Info User */}
        <div className="text-center border-b border-[#a1887f] border-dashed pb-4">
          <h2 className="text-xl font-bold text-[#4e342e]">Halo, {userName}</h2>
          <p className="text-xs text-[#795548] italic font-mono uppercase tracking-widest mt-1">
            {userRole}
          </p>
        </div>

    

        {/* --- MENU TOMBOL --- */}
        <div className="grid gap-4 pt-2">
            
            {/* TOMBOL 1: KE HALAMAN ABSEN (KAMERA) */}
            <button
                onClick={goToPresensi}
                className="w-full py-4 bg-[#3e2723] text-[#efebe9] text-lg font-bold uppercase tracking-widest shadow-lg hover:bg-[#281a17] hover:scale-[1.02] transition-transform border border-[#5d4037] flex items-center justify-center gap-3"
            >
                PRESENSI
            </button>

            {/* TOMBOL 2: KE HALAMAN LAPORAN */}
            <button
                onClick={goToLaporan}
                className="w-full py-3 bg-[#ffecb3] text-[#5d4037] font-bold uppercase tracking-wider border-2 border-[#5d4037] hover:bg-[#ffe082] transition shadow-sm flex items-center justify-center gap-3"
            >
                📂 Lihat Riwayat
            </button>

        </div>
      </div>

      <footer className="mt-8 text-[#5d4037] text-xs font-mono opacity-60">
        Sistem Absensi © 2025
      </footer>
    </div>
  );
}

export default DashboardPage;