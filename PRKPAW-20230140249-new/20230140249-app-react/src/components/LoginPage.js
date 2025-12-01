import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

const API_URL = 'http://localhost:3001/api/auth/login';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        email: email,
        password: password
      });

      const token = response.data.token;
      // Simpan token ke localStorage
      localStorage.setItem('token', token);

      // Arahkan ke dashboard
      navigate('/dashboard');

    } catch (err) {
      // Tangani error dan tampilkan di UI
      setError(err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 font-serif"
        style={{
            backgroundColor: "#e8dec0", // Warna dasar kertas usang
            backgroundImage: "radial-gradient(#d4c5a3 2px, transparent 2px)", // Pola titik halus
            backgroundSize: "30px 30px"
        }}
    >
      {/* Container Card Login (Efek Kartu Identitas Kuno) */}
      <div 
        className="p-8 w-full max-w-md relative shadow-2xl transition-transform transform hover:scale-[1.01]"
        style={{
            backgroundColor: "#fcf5e5",
            border: "1px solid #d7ccc8",
            boxShadow: "12px 12px 0px rgba(93, 64, 55, 0.2)", // Shadow kasar
        }}
      >
        {/* Hiasan Sudut (Corner accents) */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#5d4037]"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#5d4037]"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#5d4037]"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#5d4037]"></div>

        <div className="text-center mb-8 border-b-2 border-[#5d4037] pb-4 border-dotted">
            <h2 className="text-3xl font-bold text-[#3e2723] uppercase tracking-widest" style={{ textShadow: "1px 1px 0px #a1887f" }}>
            🔐 Portal Masuk
            </h2>
            <p className="text-[#795548] text-xs font-mono mt-2 italic">Silakan tunjukkan kredensial Anda.</p>
        </div>
        
        {/* Pesan Error ala Stempel */}
        {error && (
          <div className="bg-[#d7ccc8] border border-[#bf360c] text-[#bf360c] p-4 mb-5 font-mono text-sm shadow-inner" role="alert">
            <p className="font-bold border-b border-[#bf360c] inline-block mb-1">[PENOLAKAN AKSES]</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-mono">
          
          {/* INPUT EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[#5d4037] mb-1 uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@domain.com"
              className="mt-1 w-full px-4 py-3 bg-[#efebe9] border-2 border-[#a1887f] text-[#3e2723] placeholder-[#a1887f] focus:outline-none focus:border-[#5d4037] focus:bg-[#fff3e0] transition-colors rounded-sm"
            />
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-[#5d4037] mb-1 uppercase tracking-wide"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
              className="mt-1 w-full px-4 py-3 bg-[#efebe9] border-2 border-[#a1887f] text-[#3e2723] placeholder-[#a1887f] focus:outline-none focus:border-[#5d4037] focus:bg-[#fff3e0] transition-colors rounded-sm"
            />
          </div>

          {/* TOMBOL LOGIN */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#5d4037] text-[#efebe9] font-bold shadow border-b-4 border-[#3e2723] hover:bg-[#4e342e] active:border-0 active:mt-1 transition-all uppercase tracking-widest rounded-sm"
          >
            Masuk Sekarang
          </button>
        </form>

        {/* Tombol/Link Register */}
        <div className="mt-8 pt-6 border-t border-[#a1887f] border-dashed text-center">
          <p className="text-sm text-[#5d4037] mb-3 font-mono">
            Belum terdaftar ?
          </p>
          <Link 
            to="/register" 
            className="inline-block py-2 px-8 bg-[#556b2f] text-[#efebe9] font-bold shadow border-b-4 border-[#33691e] hover:bg-[#33691e] active:border-0 active:mt-1 transition-all uppercase tracking-wider text-sm rounded-sm"
          >
            Lakukan Pendaftaran
          </Link>
        </div>
        
      </div>
      
      <footer className="mt-8 text-[#5d4037] text-xs font-mono opacity-60">
        Laporan Presensi Est. 2025
      </footer>

    </div>
  );
}

export default LoginPage;