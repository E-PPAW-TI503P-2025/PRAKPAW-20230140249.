import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3001/api/presensi';

function LaporanPage() {
    const [laporan, setLaporan] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // Helper: Membuat Link Google Maps dari koordinat
    const renderLocation = (lat, long) => {
        if (!lat || !long) return <span className="text-gray-400">-</span>;
        
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${long}`;
        
        return (
            <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1a237e] hover:underline hover:text-[#0d47a1] flex flex-col"
                title="Lihat di Google Maps"
            >
                <span>Lat: {lat}</span>
                <span>Long: {long}</span>
            </a>
        );
    };

    const fetchLaporan = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token'); 
            
            if (!token) {
                 navigate('/login');
                 return;
            }
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                setError('Akses ditolak. Anda bukan Administrator.');
                setIsLoading(false);
                return;
            }

            const response = await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                } 
            );
            setLaporan(response.data.presensi); 
            setError(null);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Gagal mengambil laporan presensi');
            setLaporan([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchLaporan();
        } else {
            navigate('/login');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div 
            className="min-h-screen flex flex-col items-center py-10 px-4 font-serif"
            style={{
                backgroundColor: "#e8dec0", 
                backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)", 
                backgroundSize: "30px 30px"
            }}
        >
            
            {/* Header dan Navigasi */}
            <header className="w-full max-w-6xl flex justify-between items-center mb-6 border-b-2 border-[#5d4037] pb-4 border-double">
                <h2 className="text-3xl font-bold text-[#3e2723] uppercase tracking-widest" style={{ textShadow: "1px 1px 0px #a1887f" }}>
                    📂 Laporan Presensi
                </h2>
                <Link 
                    to="/dashboard"
                    className="py-2 px-4 bg-[#5d4037] text-[#efebe9] font-semibold border border-[#3e2723] rounded-sm shadow-md hover:bg-[#3e2723] transition uppercase text-xs tracking-wider"
                >
                    &larr; Dashboard
                </Link>
            </header>

            {/* Kontrol Aksi dan Feedback */}
            <div className="w-full max-w-6xl mb-6 flex justify-between items-center">
                <button 
                    onClick={fetchLaporan} 
                    disabled={isLoading}
                    className={`px-6 py-2 font-bold text-[#efebe9] rounded-sm shadow border-b-4 transition uppercase tracking-wider text-sm ${
                        isLoading 
                            ? 'bg-[#a1887f] border-[#8d6e63] cursor-wait' 
                            : 'bg-[#556b2f] border-[#1b5e20] hover:bg-[#33691e] active:border-0 active:mt-1'
                    }`}
                >
                    {isLoading ? '⏳ Loading...' : '🔄 Refresh Data'}
                </button>
                {error && (
                    <div className="bg-[#efebe9] border border-[#8d6e63] text-[#bf360c] p-3 shadow-inner font-mono text-sm" role="alert">
                        <p className="font-bold">[ALERT]: {error}</p>
                    </div>
                )}
            </div>

            {/* Container Tabel Laporan */}
            <div 
                className="w-full max-w-6xl p-8 relative shadow-2xl"
                style={{
                    backgroundColor: "#fcf5e5",
                    border: "1px solid #d7ccc8",
                    boxShadow: "8px 8px 0px rgba(93, 64, 55, 0.2)",
                }}
            >
                {/* Hiasan Sudut */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#8d6e63]"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#8d6e63]"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#8d6e63]"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#8d6e63]"></div>

                <div className="overflow-x-auto border border-[#a1887f]">
                    {laporan.length === 0 && !isLoading && !error ? (
                        <p className="text-center text-[#795548] py-10 font-mono italic">-- Data Kosong / Belum Ada Absensi --</p>
                    ) : (
                        <table className="min-w-full divide-y divide-[#a1887f]">
                            {/* Header Tabel */}
                            <thead className="bg-[#d7ccc8]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest border-r border-[#a1887f]">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest border-r border-[#a1887f]">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest border-r border-[#a1887f]">Waktu Masuk</th>
                                    {/* Kolom Baru: Lokasi Masuk */}
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest border-r border-[#a1887f]">Lokasi Masuk</th>
                                    
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest border-r border-[#a1887f]">Waktu Keluar</th>
                                    {/* Kolom Baru: Lokasi Keluar */}
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest border-r border-[#a1887f]">Lokasi Keluar</th>
                                    
                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#3e2723] uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            
                            {/* Isi Tabel */}
                            <tbody className="bg-[#fcf5e5] divide-y divide-[#d7ccc8] font-mono text-xs">
                                {laporan.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-[#efebe9] transition duration-100 text-[#4e342e]">
                                        <td className="px-4 py-4 whitespace-nowrap border-r border-[#d7ccc8]">{index + 1}.</td>
                                        <td className="px-4 py-4 whitespace-nowrap font-bold border-r border-[#d7ccc8]">
                                            {item.User ? item.User.nama : 'Unknown'}
                                        </td>
                                        
                                        {/* Waktu Masuk */}
                                        <td className="px-4 py-4 whitespace-nowrap text-[#33691e] border-r border-[#d7ccc8]">
                                            {formatDate(item.checkIn)}
                                        </td>

                                        {/* DATA LOKASI MASUK */}
                                        <td className="px-4 py-4 whitespace-nowrap border-r border-[#d7ccc8]">
                                            {renderLocation(item.latitude_in, item.longitude_in)}
                                        </td>

                                        {/* Waktu Keluar */}
                                        <td className="px-4 py-4 whitespace-nowrap border-r border-[#d7ccc8]">
                                            {item.checkOut ? (
                                                <span className="text-[#bf360c]">{formatDate(item.checkOut)}</span>
                                            ) : (
                                                <span className="px-2 py-1 inline-flex text-[10px] leading-4 font-bold border border-[#f9a825] text-[#e65100] uppercase tracking-wider bg-[#fff9c4]">
                                                    Aktif
                                                </span>
                                            )}
                                        </td>

                                        {/* DATA LOKASI KELUAR */}
                                        <td className="px-4 py-4 whitespace-nowrap border-r border-[#d7ccc8]">
                                            {renderLocation(item.latitude_out, item.longitude_out)}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap italic text-[#5d4037]">
                                            {item.checkOut ? 'Selesai' : 'Berjalan'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            <footer className="mt-8 text-[#5d4037] text-xs font-mono opacity-60">
                Sistem Laporan Presensi Geotagging &copy; 2025
            </footer>
        </div>
    );
}

export default LaporanPage;