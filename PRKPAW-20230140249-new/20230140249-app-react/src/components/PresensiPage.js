// Updated App.js with Vintage Brown Theme
// Functionality remains exactly the same.

import React, { useState, useEffect } from 'react';

const MOCK_USER_DATA = {
    nama: 'Budi Santoso (Mock)',
    role: 'mahasiswa',
    isLoggedIn: true,
};

// Asumsi pengguna selalu masuk, karena tidak ada logic login
const getMockUser = () => MOCK_USER_DATA;

function App() {
    const [coords, setCoords] = useState(null);
    const [userName, setUserName] = useState('Pengguna');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [isViewReport, setIsViewReport] = useState(false); 

    // Menggantikan logic auth/token
    useEffect(() => {
        const user = getMockUser();
        if (user.isLoggedIn) {
            setUserName(user.nama);
            setUserRole(user.role);
            getLocation(); 
        } else {
            setUserName('Tamu');
            setUserRole('');
        }
    }, []);

    const getLocation = () => {
        setError(null);
        setMessage('Mencari koordinat area...');
        
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true, 
                timeout: 5000, 
                maximumAge: 0 
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy 
                    });
                    setMessage(`Titik ditemukan! Presisi: ±${position.coords.accuracy.toFixed(2)} meter.`);
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setError("Izin akses peta ditolak.");
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        setError("Informasi peta tidak tersedia.");
                    } else if (error.code === error.TIMEOUT) {
                        setError("Waktu habis saat mencari sinyal.");
                    } else {
                        setError("Gagal mendapatkan lokasi: " + error.message);
                    }
                    setCoords(null);
                    setMessage(null);
                },
                options 
            );
        } else {
            setError("Perangkat tidak mendukung Geolocation.");
            setCoords(null);
            setMessage(null);
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

    const handleCheckIn = (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        
        if (!coords) {
            showTempMessage("Peta belum siap. Harap muat ulang.", true);
            return;
        }

        setTimeout(() => {
            showTempMessage(`[SUKSES] Kehadiran dicatat pada ${new Date().toLocaleTimeString()}!`);
        }, 800);
    };

    const handleCheckOut = (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        
        setTimeout(() => {
            showTempMessage(`[SUKSES] Kepulangan dicatat pada ${new Date().toLocaleTimeString()}!`);
        }, 800);
    };

    const handleViewPresensi = (e) => {
        e.preventDefault();
        setIsViewReport(true); 
    };

    const handleLogout = () => {
        setUserName('Tamu');
        setUserRole('');
        setIsViewReport(false);
        console.log("Logout berhasil (simulasi).");
    }
    
    // --- TAMPILAN HALAMAN LAPORAN (VINTAGE STYLE) ---
    if (isViewReport) {
        return (
            <div 
                className="min-h-screen flex flex-col items-center justify-center p-4 font-serif"
                style={{
                    backgroundColor: "#e8dec0",
                    backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)",
                    backgroundSize: "30px 30px"
                }}
            >
                <div 
                    className="max-w-xl w-full p-8 relative shadow-2xl"
                    style={{
                        backgroundColor: "#fcf5e5",
                        border: "1px solid #d7ccc8",
                        boxShadow: "10px 10px 0px rgba(93, 64, 55, 0.2)",
                    }}
                >
                    {/* Hiasan Sudut */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#5d4037]"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#5d4037]"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#5d4037]"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#5d4037]"></div>

                    <h1 className="text-3xl font-bold text-[#3e2723] mb-4 border-b-2 border-[#5d4037] pb-2 text-center uppercase tracking-widest">
                        Arsip Laporan
                    </h1>
                    
                    <p className="text-[#795548] italic mb-6 text-center font-mono text-sm">
                        Catatan harian personil (Mode Admin)
                    </p>

                    <div className="border-2 border-[#a1887f] p-4 bg-[#efebe9] space-y-2 mb-6 shadow-inner">
                        <h4 className="font-bold text-[#3e2723] uppercase text-sm underline decoration-dotted">Jurnal Hari Ini:</h4>
                        <ul className="text-sm space-y-2 font-mono text-[#4e342e]">
                            <li className="border-b border-[#d7ccc8] pb-1">User A: Masuk 07:45 | Keluar -</li>
                            <li className="border-b border-[#d7ccc8] pb-1">User B: Masuk 08:05 | Keluar 16:30</li>
                            <li>User C: Masuk 07:58 | Keluar 17:01</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setIsViewReport(false)}
                        className="w-full py-3 px-4 bg-[#5d4037] text-[#efebe9] font-bold uppercase tracking-wider shadow border-b-4 border-[#3e2723] hover:bg-[#4e342e] active:border-0 active:mt-1 transition-all rounded-sm"
                    >
                        &larr; Tutup 
                    </button>
                </div>
            </div>
        );
    }

    // --- TAMPILAN UTAMA (VINTAGE STYLE) ---
    return (    
        <div 
            className="min-h-screen flex flex-col items-center p-4 font-serif"
            style={{
                backgroundColor: "#e8dec0", // Warna kertas tua
                backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)", // Pola noise
                backgroundSize: "30px 30px"
            }}
        >
            <style>
                {`
                .vintage-map-frame { 
                    height: 400px; 
                    width: 100%;
                    border: none;
                    /* Efek Sepia untuk membuat Google Maps terlihat tua */
                    filter: sepia(80%) contrast(110%) hue-rotate(-10deg);
                    opacity: 0.9;
                }
                `}
            </style>
            
            {/* Header */}
            <header className="w-full max-w-xl flex justify-between items-center py-5 px-2 mb-4 border-b-2 border-[#5d4037] border-double">
                <h1 className="text-2xl font-bold text-[#3e2723] uppercase tracking-widest" style={{ textShadow: "1px 1px 0px #a1887f" }}>
                    🕰️ Absensi
                </h1>
                <button
                    onClick={handleLogout}
                    className="py-1 px-4 text-xs bg-[#8d6e63] text-white font-bold uppercase tracking-wider border border-[#3e2723] hover:bg-[#5d4037] transition shadow-md"
                >
                    Keluar
                </button>
            </header>
            
            {/* Main Card */}
            <div 
                className="p-6 w-full max-w-xl space-y-6 relative shadow-2xl"
                style={{
                    backgroundColor: "#fcf5e5",
                    border: "1px solid #d7ccc8",
                    boxShadow: "12px 12px 0px rgba(93, 64, 55, 0.2)", // Hard shadow
                }}
            >
                {/* Dekorasi Pojok Foto Kuno */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#5d4037]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#5d4037]"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5d4037]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5d4037]"></div>

                {/* Info Pengguna */}
                <div className="border-b-2 border-dotted border-[#a1887f] pb-4 text-center">
                    <h2 className="text-2xl font-bold text-[#3e2723] mb-1">Salam, {userName}.</h2>
                    <p className="text-sm text-[#795548] font-mono italic bg-[#efebe9] inline-block px-2">Role: {userRole}</p>
                </div>

                {/* Status Messages (Telegram Style) */}
                {message && (
                    <div className="bg-[#e0e8d3] border-2 border-[#556b2f] text-[#33691e] p-3 font-mono text-sm shadow-sm">
                        <p><strong>[TELEGRAM]:</strong> {message}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-[#ffccbc] border-2 border-[#bf360c] text-[#bf360c] p-3 font-mono text-sm shadow-sm">
                        <p><strong>[PERINGATAN]:</strong> {error}</p>
                    </div>
                )}

                {/* Bagian Peta */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-[#a1887f] pb-1">
                        <h3 className="text-lg font-bold text-[#5d4037] uppercase">
                            📍 Koordinat 
                        </h3>
                        <button 
                            onClick={getLocation} 
                            className="text-xs text-[#3e2723] font-bold hover:underline cursor-pointer font-mono"
                        >
                            {message && message.includes('Mencari') ? 'MENCARI SINYAL...' : '[PERBARUI POSISI]'}
                        </button>
                    </div>
                    
                    {coords ? (
                        <>
                            <div className="bg-[#efebe9] p-2 border border-[#d7ccc8] font-mono text-xs text-[#5d4037] mb-2">
                                <p>Garis Lintang : {coords.lat.toFixed(6)}</p>
                                <p>Garis Bujur   : {coords.lng.toFixed(6)}</p>
                                {coords.accuracy && <p className="italic text-[#8d6e63] mt-1">Akurasi Perkiraan: ±{coords.accuracy.toFixed(2)} m</p>}
                            </div>

                            {/* Peta dengan Bingkai & Efek Sepia */}
                            <div className="p-2 bg-[#d7ccc8] border-2 border-[#5d4037] shadow-inner">
                                <div className="overflow-hidden border border-[#8d6e63]">
                                    <iframe
                                        className="vintage-map-frame"
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=17&output=embed`}
                                        title="Peta Lokasi"
                                    ></iframe>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-[#efebe9] p-6 text-center border-2 border-dashed border-[#a1887f]">
                            <p className="text-[#8d6e63] font-mono">Peta belum digelar. Silakan perbarui posisi.</p>
                        </div>
                    )}
                </div>

                {/* Tombol Aksi */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-dotted border-[#a1887f]">
                    <button
                        onClick={handleCheckIn}
                        disabled={!coords || message.includes('Mencari')} 
                        className={`py-3 px-2 text-[#efebe9] font-bold uppercase tracking-wider border-b-4 transition-all active:border-0 active:mt-1 rounded-sm shadow-md ${
                            (coords && !message.includes('Mencari')) 
                            ? 'bg-[#556b2f] border-[#33691e] hover:bg-[#33691e]' 
                            : 'bg-[#a1887f] border-[#8d6e63] cursor-not-allowed opacity-70'
                        }`}
                    >
                        Check (In)
                    </button>
                    <button
                        onClick={handleCheckOut}
                        disabled={!coords || message.includes('Mencari')}
                        className={`py-3 px-2 text-[#efebe9] font-bold uppercase tracking-wider border-b-4 transition-all active:border-0 active:mt-1 rounded-sm shadow-md ${
                            (coords && !message.includes('Mencari')) 
                            ? 'bg-[#bf360c] border-[#870000] hover:bg-[#a31515]' 
                            : 'bg-[#a1887f] border-[#8d6e63] cursor-not-allowed opacity-70'
                        }`}
                    >
                        Check (Out)
                    </button>
                </div>
                
                {/* Tombol Admin */}
                {userRole === 'admin' && (
                    <div className="pt-2">
                        <button
                            onClick={handleViewPresensi}
                            className="w-full py-3 px-4 bg-[#ffecb3] text-[#5d4037] font-bold uppercase tracking-wider border-2 border-[#5d4037] hover:bg-[#ffe082] transition shadow-sm rounded-sm text-sm"
                        >
                            📂 Buka Laporan (Admin)
                        </button>
                    </div> 
                )}
            </div>
            
            <footer className="mt-8 text-[#5d4037] text-xs font-mono opacity-60">
                Sistem Pencatatan & Geolokasi Est. 2025
            </footer>
        </div>
    );
}

export default App;