import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setSuccess(''); 

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return; 
    }
    const payload = {
      name: name,
      email: email,
      phone: phone,
      password: password,
    };

    try {
      await api.post('/auth/register', payload);

      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman Login...');
      
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registrasi gagal. Silakan coba lagi.');
      }
      console.error('Register error:', err); 
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2 group mb-4 self-center">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-teal-200 shadow-lg">
            M
          </div>
        </Link>
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Register
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Daftar untuk mulai meminjam alat medis.
          </p>
        </div>

        <form className="space-y-5 w-full flex flex-col items-center" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center w-full">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm text-center w-full">
              {success}
            </div>
          )}

          <div className="relative w-full flex justify-center">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="input w-full pl-5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative w-full flex justify-center">
            <input
              type="email"
              placeholder="Email"
              className="input w-full pl-5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative w-full flex justify-center">
            <input
              type="number"
              placeholder="Phone Number"
              className="input w-full pl-5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="relative w-full flex justify-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input border-gray-300 rounded-lg w-full pl-5 bg-gray-50 focus:bg-white focus:border-teal-500"
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

          <div className="relative w-full flex justify-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className="input border-gray-300 rounded-lg w-full pl-5 bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="pt-2 w-full flex justify-center">
            <button
              type="submit"
              className="btn btn-primary w-full bg-teal-500 rounded-lg hover:bg-teal-600 border-none text-white font-semibold text-base h-12"
            >
              Daftar
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 w-full">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;