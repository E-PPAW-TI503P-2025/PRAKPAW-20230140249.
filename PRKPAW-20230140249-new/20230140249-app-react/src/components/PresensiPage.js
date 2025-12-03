import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Webcam from 'react-webcam'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// --- LEAFLET ICON SETUP ---
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// URL API
const API_URL_CHECKIN = 'http://localhost:3001/api/presensi/checkin';
const API_URL_CHECKOUT = 'http://localhost:3001/api/presensi/checkout';

function PresensiPage() {
  // State Data
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null); 
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('');
  
  // State UI
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Helper: Get Token
  const getToken = () => localStorage.getItem('token');

  // --- LOGIC: LOGOUT & AUTH ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = getToken();
    if (!token) return handleLogout();

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.nama || 'Pengguna');
      setUserRole(decoded.role || 'mahasiswa');
      if (decoded.exp * 1000 < Date.now()) handleLogout();
    } catch (err) {
      handleLogout();
    }
  }, [handleLogout]);

  // --- LOGIC: LOKASI ---
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          setError('Gagal mendapatkan lokasi: ' + err.message);
          setCoords(null);
        }
      );
    } else {
      setError('Geolocation tidak didukung browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // --- LOGIC: WEBCAM ---
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // --- LOGIC: SUBMIT ---
  const handleSubmit = async (type) => {
    setError(null);
    setMessage('');

    if (!coords) {
      setError('Lokasi belum ditemukan. Tunggu sebentar...');
      return;
    }
    if (!image) {
      setError('Harap ambil foto selfie terlebih dahulu!');
      return;
    }

    setIsLoading(true);

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg');

      const url = type === 'in' ? API_URL_CHECKIN : API_URL_CHECKOUT;
      const actionText = type === 'in' ? 'Check-in' : 'Check-out';

      await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMessage(`${actionText} berhasil pada pukul ${timeNow} WIB`);
      
      // PERUBAHAN DI SINI:
      // setImage(null);  <-- Baris ini dihapus/dikomentari.
      // Tujuannya agar foto tetap ada di layar setelah Check-In, 
      // jadi user bisa langsung tekan Check-Out tanpa foto ulang.

    } catch (err) {
      console.error(err);
      const serverMsg = err.response ? err.response.data.message : 'Terjadi kesalahan pada server';
      setError(`Gagal: ${serverMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPresensi = () => navigate('/laporan');

  // --- RENDER SECTION ---
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 font-serif"
      style={{
        backgroundColor: "#e8dec0",
        backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)",
        backgroundSize: "30px 30px"
      }}
    >
      {/* Header */}
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

      {/* Main Card */}
      <div 
        className="p-8 w-full max-w-xl space-y-6 relative shadow-xl"
        style={{
          backgroundColor: "#fcf5e5",
          border: "1px solid #d7ccc8",
          boxShadow: "10px 10px 0px rgba(93, 64, 55, 0.2)",
        }}
      >
        {/* Hiasan Sudut */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8d6e63]"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8d6e63]"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8d6e63]"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8d6e63]"></div>

        <div className="pb-4 border-b border-[#a1887f] border-dashed">
          <h2 className="text-2xl font-bold text-[#4e342e]">Selamat Datang, {userName}.</h2>
          <p className="text-sm text-[#795548] italic mt-1 font-mono">Status Pengguna: {userRole}</p>
        </div>

        {/* --- AREA NOTIFIKASI --- */}
        {message && (
          <div className="bg-[#e0e8d3] border border-[#556b2f] text-[#33691e] p-4 shadow-inner font-mono text-sm">
            <p><strong>[SUKSES]:</strong> {message}</p>
          </div>
        )}
        {error && (
          <div className="bg-[#ffccbc] border border-[#d32f2f] text-[#b71c1c] p-4 shadow-inner font-mono text-sm">
            <p><strong>[ERROR]:</strong> {error}</p>
          </div>
        )}

        {/* --- BAGIAN 1: PETA (DI ATAS) --- */}
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
              <div className="overflow-hidden h-[200px] w-full" style={{ filter: "sepia(70%) contrast(110%)" }}>
                <MapContainer
                  key={`${coords.lat}-${coords.lng}`}
                  center={[coords.lat, coords.lng]}
                  zoom={16}
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

        {/* --- BAGIAN 2: KAMERA (DI BAWAH PETA) --- */}
        <div className="space-y-2 pt-4 border-t border-[#a1887f] border-dashed">
            <h3 className="text-lg font-bold text-[#3e2723] flex items-center border-l-4 border-[#8d6e63] pl-2">
                📸 Ambil Foto
            </h3>
            <div className="border-4 border-[#3e2723] bg-black rounded overflow-hidden shadow-lg relative" style={{ minHeight: '250px' }}>
                {image ? (
                    <img src={image} alt="Selfie Preview" className="w-full h-auto" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-auto"
                        videoConstraints={{ facingMode: "user" }}
                    />
                )}
            </div>
            {/* Tombol Kamera */}
            <div className="flex gap-2">
                {!image ? (
                    <button onClick={capture} className="w-full py-2 bg-[#4e342e] text-[#efebe9] font-bold border border-[#3e2723] hover:bg-[#3e2723] shadow-sm uppercase text-sm">
                        Jepret Foto
                    </button>
                ) : (
                    <button onClick={() => setImage(null)} className="w-full py-2 bg-[#bf360c] text-[#efebe9] font-bold border border-[#3e2723] hover:bg-[#a02f00] shadow-sm uppercase text-sm">
                        Foto Ulang
                    </button>
                )}
            </div>
        </div>

        {/* --- TOMBOL AKSI SUBMIT --- */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#a1887f] border-dashed">
          <button
            onClick={() => handleSubmit('in')}
            disabled={isLoading || !coords || !image}
            className={`py-3 px-4 text-[#efebe9] font-bold shadow uppercase tracking-widest transition-all ${
              !isLoading && coords && image
                ? 'bg-[#556b2f] hover:bg-[#33691e] border-b-4 border-[#1b5e20] active:border-0 active:mt-1' 
                : 'bg-[#a1887f] cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? 'Loading...' : 'Check (In)'}
          </button>

          <button
            onClick={() => handleSubmit('out')}
            disabled={isLoading || !coords || !image}
            className={`py-3 px-4 text-[#efebe9] font-bold shadow uppercase tracking-widest transition-all ${
              !isLoading && coords && image
                ? 'bg-[#8d6e63] hover:bg-[#5d4037] border-b-4 border-[#3e2723] active:border-0 active:mt-1' 
                : 'bg-[#a1887f] cursor-not-allowed opacity-50'
            }`}
          >
             {isLoading ? 'Loading...' : 'Check (Out)'}
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