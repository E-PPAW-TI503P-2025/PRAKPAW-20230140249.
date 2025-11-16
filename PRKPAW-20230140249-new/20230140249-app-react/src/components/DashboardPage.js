import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Hapus token otentikasi
    localStorage.removeItem('token');
    // 2. Arahkan pengguna kembali ke halaman login
    navigate('/login');
  };

  return (
    // Background dan font retro
    <div className="min-h-screen bg-amber-100 flex items-center justify-center p-8 font-sans">
      
      {/* Kontainer Utama - Kotak Tegas */}
      <div className="bg-white border-4 border-gray-800 p-10 rounded-none shadow-xl text-center w-full max-w-lg">

        {/* Judul Dashboard */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-wider uppercase">
          [ SYSTEM DASHBOARD ]
        </h1>

        <p className="text-gray-700 mb-8 text-sm font-medium border-t-2 border-b-2 border-gray-400 py-2">
          USER ACCESS GRANTED. SELAMAT DATANG DI ANTARMUKA PENGGUNA.
        </p>

        {/* Grid Fitur - Menggunakan gaya "tombol" sistem lama */}
        <div className="grid grid-cols-2 gap-4 mb-8">

          {/* Item 1 */}
          <div className="bg-blue-600 text-white p-4 rounded-none shadow-md border-2 border-gray-900 font-bold uppercase cursor-pointer transition duration-150 transform hover:scale-[1.02] active:translate-y-0.5">
            ACCESS FEATURE A
          </div>

          {/* Item 2 */}
          <div className="bg-yellow-600 text-gray-900 p-4 rounded-none shadow-md border-2 border-gray-900 font-bold uppercase cursor-pointer transition duration-150 transform hover:scale-[1.02] active:translate-y-0.5">
            ACCESS FEATURE B
          </div>

          {/* Item 3 */}
          <div className="bg-red-600 text-white p-4 rounded-none shadow-md border-2 border-gray-900 font-bold uppercase cursor-pointer transition duration-150 transform hover:scale-[1.02] active:translate-y-0.5">
            ACCESS FEATURE C
          </div>

          {/* Item 4 */}
          <div className="bg-green-600 text-white p-4 rounded-none shadow-md border-2 border-gray-900 font-bold uppercase cursor-pointer transition duration-150 transform hover:scale-[1.02] active:translate-y-0.5">
            ACCESS FEATURE D
          </div>

        </div>

        {/* Tombol Logout - Gaya tegas 3D */}
        <button
          onClick={handleLogout}
          className="py-3 px-6 bg-red-800 text-white font-extrabold uppercase rounded-none shadow-lg transform active:translate-y-0.5 border-b-4 border-gray-900 hover:bg-red-900 transition duration-150 mt-4"
        >
          LOGOUT SYSTEM
        </button>
        
      </div>
    </div>
  );
}

export default DashboardPage;