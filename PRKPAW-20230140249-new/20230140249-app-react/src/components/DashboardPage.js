import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Asumsi navigate disediakan sebagai prop

// --------------------------------------------------------------------------
// HELPER: DECODE TOKEN JWT (DIINTEGRASIKAN)
// --------------------------------------------------------------------------
const decodeToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// --------------------------------------------------------------------------
// KOMPONEN NAVLINK (Dibutuhkan oleh Navbar)
// --------------------------------------------------------------------------
const NavLink = ({ navigate, path, currentPath, children }) => {
    const isActive = currentPath === path;
    return (
        <span 
            onClick={() => typeof navigate === 'function' && navigate(path)}
            className={`px-3 py-2 text-sm font-bold uppercase cursor-pointer transition duration-150 
                ${isActive 
                    ? 'text-yellow-500 border-b-2 border-yellow-500' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
        >
            {children}
        </span>
    );
};

// --------------------------------------------------------------------------
// KOMPONEN NAVBAR (DIINTEGRASIKAN)
// --------------------------------------------------------------------------
function Navbar({ navigate, currentPath, userRole, userName }) {
    const handleLogout = () => {
        localStorage.removeItem('token');
        if (typeof navigate === 'function') navigate('/login');
    };

    return (
        <nav className="bg-gray-900 text-white shadow-xl border-b-4 border-yellow-500 font-sans sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <span className="text-2xl font-extrabold tracking-wider text-yellow-500 uppercase">[SYSTEM]</span>
                    <div className="flex items-center space-x-4">
                        <NavLink navigate={navigate} path="/dashboard" currentPath={currentPath}>Dashboard</NavLink>
                        <NavLink navigate={navigate} path="/presensi" currentPath={currentPath}>Presensi</NavLink>
                        {userRole === 'admin' && (
                            <NavLink navigate={navigate} path="/reports" currentPath={currentPath}>Laporan Admin</NavLink>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-amber-200 hidden md:block">Welcome, {userName}</span>
                        <button onClick={handleLogout} className="py-1 px-3 bg-red-700 hover:bg-red-800 text-white text-sm font-bold uppercase rounded-none border-2 border-red-900 transition duration-150 transform hover:scale-[1.05]">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
// ---------------------------------------------------------------------------------------


function DashboardPage({ navigate, currentPath }) {
  // 1. Mengambil Token dan Payload Pengguna
  const token = localStorage.getItem('token');
  const userPayload = decodeToken(token); 
  
  // 2. Mendapatkan Role dan Nama
  const userRole = userPayload?.role; 
  const userName = userPayload?.nama || 'Pengguna';
  
  const handleNavigation = (path) => {
    // Memastikan fungsi navigate ada sebelum dipanggil
    if (typeof navigate === 'function') {
      navigate(path);
    } else {
      console.error(`Navigation function not available. Cannot navigate to ${path}`);
    }
  };

  // Render Navbar menggunakan komponen yang didefinisikan di atas
  const renderNavbar = <Navbar navigate={navigate} currentPath={currentPath} userRole={userRole} userName={userName} />; 

  return (
    <div className="min-h-screen bg-amber-100 font-sans">
      {renderNavbar}
      <div className="flex items-center justify-center p-8">
        
        {/* Kontainer Utama - Kotak Tegas */}
        <div className="bg-white border-4 border-gray-800 p-10 rounded-none shadow-xl text-center w-full max-w-lg">

          {/* Judul Dashboard */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-wider uppercase">
            [ SYSTEM DASHBOARD ]
          </h1>

          {/* Sapaan Personal Berdasarkan Role */}
          <p className="text-gray-700 mb-8 text-sm font-medium border-t-2 border-b-2 border-gray-400 py-2">
            SELAMAT DATANG, {userName.toUpperCase()} ({userRole ? userRole.toUpperCase() : 'USER'}).
          </p>

          {/* Grid Fitur - Conditional Rendering */}
          <div className="grid grid-cols-2 gap-4 mb-8">

            {/* Item 1: Presensi (Wajib untuk semua role) */}
            <div 
              onClick={() => handleNavigation('/presensi')}
              className="bg-blue-600 text-white p-4 rounded-none shadow-md border-2 border-gray-900 font-bold uppercase cursor-pointer transition duration-150 transform hover:scale-[1.02] active:translate-y-0.5"
            >
              LAKUKAN PRESENSI
            </div>

            {/* Item 2: Laporan/Riwayat (Conditional Rendering) */}
            {userRole === 'admin' ? (
                // Tampilan untuk ADMIN
                <div 
                    onClick={() => handleNavigation('/reports/daily')}
                    className="bg-red-600 text-white p-4 rounded-none shadow-md border-2 border-gray-900 font-bold uppercase cursor-pointer transition duration-150 transform hover:scale-[1.02] active:translate-y-0.5"
                >
                    LIHAT LAPORAN (ADMIN)
                </div>
            ) : (
                // Tampilan untuk MAHASISWA
                <div ></div>
                   
                  
               
            )}

           

     

          </div>
          
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;