import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; 

import api from '../services/api'; 

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        
        localStorage.setItem('token', token);

        try {
            const decoded = jwtDecode(token);
            
            if (decoded.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (e) {
            console.error("Gagal decode token:", e);
            navigate('/dashboard', { replace: true });
        }

      } else {
        setError('Login berhasil tapi tidak menerima token.');
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Login gagal. Periksa email dan password Anda.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2 group mb-4">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-teal-200 shadow-lg">
            M
          </div>
        </Link>
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk ke akun MedisLink untuk melanjutkan
          </p>
        </div>

        <form className="space-y-5 w-full flex flex-col items-center" onSubmit={handleSubmit}>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center w-full">
              {error}
            </div>
          )}

          <div className="relative w-full flex justify-center">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full pl-5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative w-full flex justify-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered border-gray-300 rounded-lg w-full pl-5 bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex justify-end w-full">
            <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline">
              Lupa password?
            </Link>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="btn btn-primary w-full bg-teal-500 rounded-lg hover:bg-teal-600 border-none text-white font-semibold text-base h-12"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-teal-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;