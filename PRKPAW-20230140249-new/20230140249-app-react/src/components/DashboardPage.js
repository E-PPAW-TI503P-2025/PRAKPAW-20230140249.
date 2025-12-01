// Updated React component styled with "Vintage Brown/Sepia" theme
// NOTE: Functional logic remains unchanged.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// --- LEAFLET ICON SETUP (UNCHANGED) ---
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = 'http://localhost:3001/api/presensi';

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // --- LOGIC SECTION (UNCHANGED) ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const getLocation = () => {
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) setError('Akses lokasi ditolak.');
          else if (error.code === error.POSITION_UNAVAILABLE) setError('Informasi lokasi tidak tersedia.');
          else setError('Gagal mendapatkan lokasi: ' + error.message);
          setCoords(null);
        }
      );
    } else {
      setError('Geolocation tidak didukung browser.');
      setCoords(null);
    }
  };

  const showTempMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } else {
      setMessage(msg);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!coords) return showTempMessage('Lokasi belum didapatkan.', true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/checkin`,
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTempMessage(response.data.message || 'Check-in Berhasil!');
    } catch (err) {
      showTempMessage(err.response ? err.response.data.message : 'Check-in gagal.', true);
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!coords) return showTempMessage('Lokasi belum didapatkan.', true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/checkout`,
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTempMessage(response.data.message || 'Check-out Berhasil!');
    } catch (err) {
      showTempMessage(err.response ? err.response.data.message : 'Check-out gagal.', true);
    }
  };

  const handleViewPresensi = () => navigate('/laporan');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return handleLogout();

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.nama || 'Pengguna');
      setUserRole(decoded.role || 'mahasiswa');
      if (decoded.exp * 1000 < Date.now()) handleLogout();
    } catch (err) {
      handleLogout();
    }

    getLocation();
  }, [handleLogout]);

  // --- RENDER SECTION (VINTAGE BROWN STYLE) ---
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 font-serif"
      style={{
        backgroundColor: "#e8dec0", // Warna dasar kertas usang
        backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)", // Pola titik halus
        backgroundSize: "30px 30px"
      }}
    >
      {/* Header Vintage */}
      <header className="w-full max-w-xl flex justify-between items-center py-5 px-2 mb-4 border-b-2 border-[#5d4037] border-double">
        <h1 className="text-3xl font-bold text-[#3e2723] tracking-wider uppercase" style={{ textShadow: "1px 1px 0px #a1887f" }}>
          📜 Absensi 
        </h1>
        <button
          onClick={handleLogout}
          className="py-1 px-4 text-sm bg-[#5d4037] text-[#efebe9] font-semibold border border-[#3e2723] shadow-md hover:bg-[#3e2723] transition rounded-sm"
        >
          Keluar
        </button>
      </header>

      {/* Kartu Utama: Efek Kertas */}
      <div 
        className="p-8 w-full max-w-xl space-y-6 relative shadow-xl"
        style={{
          backgroundColor: "#fcf5e5",
          border: "1px solid #d7ccc8",
          boxShadow: "10px 10px 0px rgba(93, 64, 55, 0.2)", // Shadow kasar ala retro
        }}
      >
        {/* Hiasan Sudut (Corner accents) */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8d6e63]"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8d6e63]"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8d6e63]"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8d6e63]"></div>

        <div className="pb-4 border-b border-[#a1887f] border-dashed">
          <h2 className="text-2xl font-bold text-[#4e342e]">Selamat Datang, {userName}.</h2>
          <p className="text-sm text-[#795548] italic mt-1 font-mono">Status Pengguna: {userRole}</p>
        </div>

        {/* Notifikasi ala Mesin Ketik */}
        {message && (
          <div className="bg-[#e0e8d3] border border-[#556b2f] text-[#33691e] p-3 shadow-inner font-mono text-sm">
            <p><strong>[SUKSES]:</strong> {message}</p>
          </div>
        )}
        {error && (
          <div className="bg-[#efebe9] border border-[#8d6e63] text-[#bf360c] p-3 shadow-inner font-mono text-sm">
            <p><strong>[ERROR]:</strong> {error}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#3e2723] flex items-center border-l-4 border-[#8d6e63] pl-2">
            📍 Koordinat Lokasi
            <button onClick={getLocation} className="ml-3 text-sm text-[#5d4037] underline hover:text-[#3e2723] italic font-normal">
              (Perbarui Peta)
            </button>
          </h3>

          {coords ? (
            <p className="text-sm text-[#33691e] font-mono bg-[#dce775] bg-opacity-20 p-2 inline-block border border-[#cddc39]">
              Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-sm text-[#bf360c] font-mono bg-[#ffccbc] bg-opacity-20 p-2 inline-block border border-[#ffab91]">
              Menunggu sinyal lokasi...
            </p>
          )}

          {coords && (
            <div
              className="p-2 shadow-inner bg-[#d7ccc8]"
              style={{ border: "2px solid #5d4037" }}
            >
              {/* Filter Sepia pada Map agar terlihat kuno */}
              <div className="overflow-hidden h-[200px] w-full" style={{ filter: "sepia(70%) contrast(110%)" }}>
                <MapContainer
                  key={`${coords.lat}-${coords.lng}`}
                  center={[coords.lat, coords.lng]}
                  zoom={17}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>Lokasi Anda</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Aksi Klasik */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#a1887f] border-dashed">
          <button
            onClick={handleCheckIn}
            disabled={!coords}
            className={`py-3 px-4 text-[#efebe9] font-bold shadow uppercase tracking-widest transition-all ${
              coords 
                ? 'bg-[#556b2f] hover:bg-[#33691e] border-b-4 border-[#1b5e20] active:border-0 active:mt-1' 
                : 'bg-[#a1887f] cursor-not-allowed opacity-50'
            }`}
          >
            Check (In)
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!coords}
            className={`py-3 px-4 text-[#efebe9] font-bold shadow uppercase tracking-widest transition-all ${
              coords 
                ? 'bg-[#8d6e63] hover:bg-[#5d4037] border-b-4 border-[#3e2723] active:border-0 active:mt-1' 
                : 'bg-[#a1887f] cursor-not-allowed opacity-50'
            }`}
          >
            Check (Out)
          </button>
        </div>

        {userRole === 'admin' && (
          <div className="pt-2">
            <button
              onClick={handleViewPresensi}
              className="w-full py-2 px-4 bg-[#ffecb3] text-[#5d4037] font-bold border-2 border-[#5d4037] hover:bg-[#ffe082] transition shadow-sm uppercase text-sm"
            >
              📂 Laporan
            </button>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-[#5d4037] text-xs font-mono opacity-60">
        Sistem Absensi Est. 2025
      </footer>
    </div>
  );
}

export default PresensiPage;