import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Calendar, Filter } from 'lucide-react'; // Menggunakan lucide-react untuk ikon

// Hook kustom sederhana untuk menggantikan alert() dengan modal UI
const useModal = () => {
  const [message, setMessage] = useState(null);
  const showModal = (msg) => setMessage(msg);
  const closeModal = () => setMessage(null);
  
  const ModalComponent = () => (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center ${message ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-red-600 mb-4 border-b pb-2">Peringatan!</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={closeModal}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
        >
          Tutup
        </button>
      </div>
    </div>
  );
  return { showModal, ModalComponent };
};

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [nama, setNama] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { showModal, ModalComponent } = useModal();

  // PENTING: Ganti DUMMY_TOKEN dengan cara Anda mengambil token di aplikasi nyata.
  // Untuk tujuan demo ini, kita anggap token adalah konstan.
  const token = "DUMMY_TOKEN"; 

  // Menggunakan useCallback untuk mememoized fungsi, sehingga fetchReports menjadi stabil
  // dan tidak menyebabkan useEffect loop.
  const fetchReports = useCallback(async (query = "") => {
    setIsLoading(true);
    try {
      // Menggunakan query string yang dinamis
      const url = `http://localhost:3001/api/reports/daily${query}`;
      console.log("Fetching URL:", url);

      // Kode fetch API yang sebenarnya:
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data.data);

    } catch (err) {
      console.error("Kesalahan API:", err);
      // Menggunakan modal kustom untuk pesan error
      showModal("Gagal memuat data laporan. Pastikan API server berjalan.");
      setReports([]); // Kosongkan laporan jika gagal
    } finally {
      setIsLoading(false);
    }
  }, [token, showModal]); // Dependensi utama: token dan showModal. setReports dan setIsLoading stabil dari React.

  // Auto load saat halaman dibuka (Daily Report default)
  // fetchReports dimasukkan ke dependency array untuk memuaskan ESLint.
  useEffect(() => {
    fetchReports();
  }, [fetchReports]); // <-- Perbaikan menghilangkan warning ESLint

  const handleSearch = () => {
    // Jika input kosong, reset filter tanggal dan kembali ke daily report
    if (nama.trim() === "") {
      setStartDate("");
      setEndDate("");
      fetchReports();
    } else {
      // Prioritaskan pencarian nama, abaikan filter tanggal saat mencari nama
      setStartDate("");
      setEndDate("");
      fetchReports(`?nama=${nama.trim()}`);
    }
  };

  const handleFilterDate = () => {
    if (!startDate || !endDate) {
      return showModal("Tanggal awal dan tanggal akhir harus diisi lengkap.");
    }
    if (new Date(startDate) > new Date(endDate)) {
        return showModal("Tanggal awal tidak boleh melebihi tanggal akhir.");
    }
    
    // Clear nama search saat memfilter tanggal
    setNama(""); 
    fetchReports(`?start=${startDate}&end=${endDate}`);
  };

  const clearFilter = () => {
      setNama("");
      setStartDate("");
      setEndDate("");
      fetchReports(); // Muat ulang laporan harian default
  };

  // Fungsi utilitas untuk memformat tanggal agar mudah dibaca
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl">
      <ModalComponent />
      
      <h2 className="text-3xl font-extrabold text-indigo-800 border-b-2 pb-2 mb-6">
        <Calendar className="inline-block mr-2 text-indigo-600" size={28} />
        Laporan Presensi Harian Karyawan
      </h2>

      {/* Kontrol Pencarian dan Filter */}
      <div className="flex flex-col gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow">
        
        {/* Search Nama */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="text-sm font-medium text-gray-700 w-full sm:w-24">Cari Nama:</label>
            <input
                type="text"
                placeholder="Masukkan Nama Karyawan..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 w-full"
            />
            <button 
                onClick={handleSearch}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 flex items-center justify-center shadow-md w-full sm:w-24"
                title="Cari berdasarkan Nama"
            >
                <Search size={20} className="mr-1" /> Cari
            </button>
        </div>

        {/* Filter Tanggal */}
        <div className="flex flex-col gap-2 sm:flex-row items-center sm:space-x-4 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 w-full sm:w-24">Rentang Tanggal:</label>
            
            <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 flex-1 w-full"
            />
            
            <span className="text-gray-500 hidden sm:block">sampai</span>

            <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 flex-1 w-full"
            />

            <button 
                onClick={handleFilterDate}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 flex items-center justify-center shadow-md w-full sm:w-28"
                title="Filter berdasarkan Rentang Tanggal"
            >
                <Filter size={20} className="mr-1" /> Filter
            </button>
            
            <button 
                onClick={clearFilter}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 flex items-center justify-center shadow-md w-full sm:w-24"
                title="Hapus semua filter dan tampilkan laporan harian"
            >
                 Reset
            </button>
        </div>
      </div>

      {/* Tabel Laporan */}
      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama Karyawan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Check-In</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Check-Out</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Dibuat Pada</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
                <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-indigo-500 font-bold">
                        Memuat data laporan...
                    </td>
                </tr>
            ) : reports.length > 0 ? (
              reports.map((r) => (
                <tr key={r.id} className="hover:bg-indigo-50 transition duration-150">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{r.nama}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(r.checkIn)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(r.checkOut)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-red-500 font-bold">
                  Tidak ada data laporan yang ditemukan. Coba reset filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsPage;