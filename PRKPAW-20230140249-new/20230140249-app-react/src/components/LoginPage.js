import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token); 

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center font-sans">
      <div className="bg-white border-4 border-gray-800 p-10 rounded-none shadow-xl w-full max-w-sm">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-wider">
          SYSTEM LOGIN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-bold text-gray-700 uppercase mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border-2 border-gray-800 bg-gray-200 text-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-bold text-gray-700 uppercase mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border-2 border-gray-800 bg-gray-200 text-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-600 text-white font-extrabold uppercase rounded-none shadow-lg transform active:translate-y-0.5 border-b-4 border-red-800 hover:bg-red-700 transition duration-150"
          >
            LOGIN
          </button>
        </form>
        {error && (
          <p className="text-red-700 text-sm mt-6 text-center bg-red-100 p-2 border-2 border-red-700 font-medium">
            ERROR: {error}
          </p>
        )}
        
        {/* Tambahan: Link Registrasi */}
        <p className="text-center mt-6 text-sm text-gray-700 uppercase">
          Belum memiliki akun?{" "}
          <a 
            href="/register" 
            className="text-blue-700 font-bold hover:underline"
          >
            DAFTAR DI SINI
          </a>
        </p>

      </div>
    </div>
  );
}
export default LoginPage;