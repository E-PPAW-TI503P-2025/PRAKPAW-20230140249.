import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const showMessage = (msg, type = 'error') => {
    if (type === 'success') {
      setSuccess(msg);
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(msg);
      setSuccess(null);
      setTimeout(() => setError(null), 5000);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama, 
        email: email,
        password: password,
        role: role,
      });

      showMessage(response.data.message || 'Registrasi Berhasil! Anda akan diarahkan ke halaman Login.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
      
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Registrasi gagal. Coba lagi nanti.';
      showMessage(errorMessage, 'error');
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
      {/* Container Card Register (Efek Kertas Arsip) */}
      <div 
        className="p-8 w-full max-w-md relative shadow-2xl transition-transform transform hover:scale-[1.005]"
        style={{
            backgroundColor: "#fcf5e5",
            border: "1px solid #d7ccc8",
            boxShadow: "12px 12px 0px rgba(93, 64, 55, 0.2)",
        }}
      >
        {/* Hiasan Sudut (Corner accents) */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#5d4037]"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#5d4037]"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#5d4037]"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#5d4037]"></div>

        <div className="text-center mb-6 border-b-2 border-[#5d4037] pb-4 border-double">
            <h2 className="text-2xl font-bold text-[#3e2723] uppercase tracking-widest" style={{ textShadow: "1px 1px 0px #a1887f" }}>
            📝 Formulir Pendaftaran
            </h2>
            <p className="text-[#795548] text-xs font-mono mt-2 italic">Lengkapi data untuk melakukan Registrasi.</p>
        </div>

        {/* Pesan Sukses ala Telegram */}
        {success && (
          <div className="bg-[#e0e8d3] border border-[#33691e] text-[#33691e] p-3 mb-4 font-mono text-sm shadow-inner" role="alert">
            <p className="font-bold border-b border-[#33691e] inline-block mb-1">[DITERIMA]:</p>
            <p>{success}</p>
          </div>
        )}

        {/* Pesan Error ala Stempel Penolakan */}
        {error && (
          <div className="bg-[#ffccbc] border border-[#bf360c] text-[#bf360c] p-3 mb-4 font-mono text-sm shadow-inner" role="alert">
             <p className="font-bold border-b border-[#bf360c] inline-block mb-1">[GAGAL]:</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          
          {/* Input Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-bold text-[#5d4037] mb-1 uppercase">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Ketik nama lengkap..."
              className="w-full px-4 py-2 bg-[#efebe9] border-2 border-[#a1887f] text-[#3e2723] placeholder-[#a1887f] focus:outline-none focus:border-[#5d4037] focus:bg-[#fff3e0] transition-colors rounded-sm"
            />
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#5d4037] mb-1 uppercase">Alamat Surel (Email)</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@domain.com"
              className="w-full px-4 py-2 bg-[#efebe9] border-2 border-[#a1887f] text-[#3e2723] placeholder-[#a1887f] focus:outline-none focus:border-[#5d4037] focus:bg-[#fff3e0] transition-colors rounded-sm"
            />
          </div>

          {/* Input Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#5d4037] mb-1 uppercase">Kata Sandi</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 6 karakter"
              className="w-full px-4 py-2 bg-[#efebe9] border-2 border-[#a1887f] text-[#3e2723] placeholder-[#a1887f] focus:outline-none focus:border-[#5d4037] focus:bg-[#fff3e0] transition-colors rounded-sm"
            />
          </div>

          {/* Input Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-bold text-[#5d4037] mb-1 uppercase">Posisi / Peran:</label>
            <div className="relative">
                <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-[#efebe9] border-2 border-[#a1887f] text-[#3e2723] focus:outline-none focus:border-[#5d4037] focus:bg-[#fff3e0] appearance-none rounded-sm cursor-pointer"
                >
                <option value="mahasiswa">Mahasiswa (Anggota)</option>
                <option value="admin">Administrator (Pengurus)</option>
                </select>
                {/* Custom Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5d4037]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          <div className="pt-4">
            <button
                type="submit"
                className="w-full py-3 px-4 bg-[#556b2f] text-[#efebe9] font-bold uppercase tracking-widest shadow border-b-4 border-[#33691e] hover:bg-[#33691e] active:border-0 active:mt-1 transition-all rounded-sm text-sm"
            >
                🚀 Register
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center border-t border-[#a1887f] border-dashed pt-4">
          <p className="text-xs text-[#5d4037]">
            Sudah memiliki Ada Akun? 
            <Link to="/login" className="text-[#3e2723] font-bold underline hover:text-[#556b2f] ml-1 transition duration-150 uppercase tracking-wide">
              Masuk Disini
            </Link>
          </p>
        </div>

      </div>

      <footer className="mt-8 text-[#5d4037] text-xs font-mono opacity-60">
       Laporan Est. 2025
      </footer>
    </div>
  );
}

export default RegisterPage;