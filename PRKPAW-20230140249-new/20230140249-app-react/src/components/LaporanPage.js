import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3001/api/presensi';

// 1. GANTI BASE URL JADI ROOT SERVER SAJA (HAPUS 'uploads/' DI SINI)
const SERVER_URL = 'http://localhost:3001/'; 

function LaporanPage() {
    const [laporan, setLaporan] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    };

    // --- 2. FUNGSI PINTAR UNTUK URL GAMBAR ---
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // Bersihkan backslash (\) jadi slash (/) untuk kompatibilitas Windows
        let cleanPath = imagePath.replace(/\\/g, '/');

        // Hapus slash di depan jika ada (misal: /uploads/... jadi uploads/...)
        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        // LOGIKA UTAMA: Cek apakah path sudah mengandung 'uploads/'
        if (cleanPath.startsWith('uploads/')) {
            // Jika SUDAH ADA 'uploads', jangan ditambah lagi. Langsung tempel ke SERVER_URL
            // Hasil: http://localhost:3001/uploads/file.jpg
            return `${SERVER_URL}${cleanPath}`;
        } else {
            // Jika BELUM ADA (cuma nama file), baru kita tambahkan 'uploads/'
            // Hasil: http://localhost:3001/uploads/file.jpg
            return `${SERVER_URL}uploads/${cleanPath}`;
        }
    };

    const renderLocation = (lat, long) => {
        if (!lat || !long) return <span className="text-gray-400">-</span>;
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${long}`;
        return (
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#1a237e] hover:underline font-mono text-[10px]">
                <span>{parseFloat(lat).toFixed(5)}, {parseFloat(long).toFixed(5)}</span>
            </a>
        );
    };

    const fetchLaporan = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token'); 
            if (!token) { navigate('/login'); return; }

            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.presensi || response.data.data || [];
            setLaporan(data); 
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Gagal mengambil data');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => { fetchLaporan(); }, []); 

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-4 font-serif"
            style={{ backgroundColor: "#e8dec0", backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)", backgroundSize: "30px 30px" }}>
            
            <header className="w-full max-w-7xl flex justify-between items-center mb-6 border-b-2 border-[#5d4037] pb-4 border-double">
                <h2 className="text-3xl font-bold text-[#3e2723] uppercase">📂 Laporan Presensi</h2>
                <Link to="/dashboard" className="py-2 px-4 bg-[#5d4037] text-[#efebe9] font-semibold border border-[#3e2723] rounded-sm hover:bg-[#3e2723] text-xs">← Dashboard</Link>
            </header>

            <div className="w-full max-w-7xl mb-6">
                <button onClick={fetchLaporan} disabled={isLoading} className="px-6 py-2 bg-[#556b2f] text-[#efebe9] font-bold rounded-sm shadow hover:bg-[#33691e]">
                    {isLoading ? '⏳ Loading...' : '🔄 Refresh Data'}
                </button>
            </div>

            <div className="w-full max-w-7xl p-8 relative shadow-2xl bg-[#fcf5e5] border border-[#d7ccc8]">
                <div className="overflow-x-auto border border-[#a1887f]">
                    <table className="min-w-full divide-y divide-[#a1887f]">
                        <thead className="bg-[#d7ccc8]">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-[#3e2723]">No</th>
                                <th className="px-4 py-3 text-left font-bold text-[#3e2723]">Nama</th>
                                <th className="px-4 py-3 text-center font-bold text-[#3e2723]">Foto</th>
                                <th className="px-4 py-3 text-left font-bold text-[#3e2723]">Masuk</th>
                                <th className="px-4 py-3 text-left font-bold text-[#3e2723]">Lokasi</th>
                                <th className="px-4 py-3 text-left font-bold text-[#3e2723]">Keluar</th>
                                <th className="px-4 py-3 text-left font-bold text-[#3e2723]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d7ccc8] text-xs text-[#4e342e]">
                            {laporan.map((item, index) => {
                                // 3. PANGGIL FUNGSI DI SINI
                                const finalImageUrl = getImageUrl(item.buktiFoto);

                                return (
                                    <tr key={index} className="hover:bg-[#efebe9]">
                                        <td className="px-4 py-4 border-r border-[#d7ccc8]">{index + 1}.</td>
                                        <td className="px-4 py-4 font-bold border-r border-[#d7ccc8]">{item.User?.nama || 'User'}</td>
                                        
                                        {/* TAMPILKAN FOTO */}
                                        <td className="px-4 py-2 border-r border-[#d7ccc8] text-center">
                                            {finalImageUrl ? (
                                                <a href={finalImageUrl} target="_blank" rel="noreferrer">
                                                    <img 
                                                        src={finalImageUrl} 
                                                        alt="Bukti" 
                                                        className="w-16 h-12 object-cover rounded border-2 border-[#8d6e63] hover:scale-150 transition-transform mx-auto"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50?text=Error"; }} 
                                                    />
                                                </a>
                                            ) : <span className="text-gray-400 italic">No Image</span>}
                                        </td>

                                        <td className="px-4 py-4 border-r border-[#d7ccc8] text-[#33691e]">{formatDate(item.checkIn)}</td>
                                        <td className="px-4 py-4 border-r border-[#d7ccc8]">{renderLocation(item.latitude_in, item.longitude_in)}</td>
                                        <td className="px-4 py-4 border-r border-[#d7ccc8] text-[#bf360c]">{item.checkOut ? formatDate(item.checkOut) : 'Aktif'}</td>
                                        <td className="px-4 py-4 italic">{item.checkOut ? 'Selesai' : 'Berjalan'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LaporanPage;