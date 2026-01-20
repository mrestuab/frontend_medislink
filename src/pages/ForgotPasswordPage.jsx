import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        email: email.trim(),
      });

      if (response.data) {
        navigate('/verify-otp', { 
          state: { email: email.trim() },
          replace: true 
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Gagal mengirim kode OTP. Silakan coba lagi.');
      }
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50">
        <Link to="/" className="flex items-center gap-2 group mb-4 justify-center">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-teal-200 shadow-lg">
            M
          </div>
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Lupa Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan email Anda dan kami akan mengirimkan kode OTP untuk reset password
          </p>
        </div>

        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="relative w-full">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full pl-5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-teal-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full bg-teal-500 rounded-lg hover:bg-teal-600 border-none text-white font-semibold text-base h-12 disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Mengirim...
              </span>
            ) : (
              'Kirim Kode OTP'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
