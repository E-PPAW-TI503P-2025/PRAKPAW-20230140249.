import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        role,
        email,
        password,
      });

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Registrasi gagal. Coba lagi."
      );
    }
  };

  return (
    // Background dan font retro (mirip dengan Login Page)
    <div className="min-h-screen bg-amber-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white border-4 border-gray-800 p-10 rounded-none shadow-xl w-full max-w-md">

        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-wider">
          USER REGISTER
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAMA */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              // Gaya input retro: border tebal, bg abu-abu
              className="mt-1 w-full px-4 py-3 border-2 border-gray-800 bg-gray-200 text-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Role Akun
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              // Gaya select box retro
              className="mt-1 w-full px-4 py-3 border-2 border-gray-800 bg-gray-200 text-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600 appearance-none"
            >
              <option value="mahasiswa">MAHASISWA</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border-2 border-gray-800 bg-gray-200 text-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border-2 border-gray-800 bg-gray-200 text-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            // Gaya tombol hijau/biru retro
            className="w-full py-3 px-4 bg-green-600 text-white font-extrabold uppercase rounded-none shadow-lg transform active:translate-y-0.5 border-b-4 border-green-800 hover:bg-green-700 transition duration-150"
          >
            CREATE ACCOUNT
          </button>
        </form>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-700 text-sm mt-6 text-center bg-red-100 p-2 border-2 border-red-700 font-medium">
            ERROR: {error}
          </p>
        )}

        {/* LINK LOGIN */}
        <p className="text-center mt-6 text-sm text-gray-700 uppercase">
          Sudah punya akun?{" "}
          <a 
            href="/login" 
            className="text-blue-700 font-bold hover:underline"
          >
            LOGIN
          </a>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;