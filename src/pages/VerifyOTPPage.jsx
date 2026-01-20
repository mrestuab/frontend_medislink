import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '../services/api';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Kode OTP harus 6 digit');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-otp', {
        email: email,
        otp: otpCode,
      });

      if (response.data && response.data.valid) {
        navigate('/reset-password', { 
          state: { email: email, otp: otpCode },
          replace: true 
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Kode OTP tidak valid. Silakan coba lagi.');
      }
      console.error('Verify OTP error:', err);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Gagal mengirim ulang kode OTP');
    } finally {
      setResendLoading(false);
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
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Verifikasi OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan kode 6 digit yang telah dikirim ke
          </p>
          <p className="text-center text-sm font-semibold text-teal-600">
            {email}
          </p>
        </div>

        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white transition-all disabled:bg-gray-100"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Kirim ulang kode dalam <span className="font-semibold text-teal-600">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-sm text-teal-600 hover:underline font-medium inline-flex items-center gap-1 disabled:text-gray-400"
              >
                {resendLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Kirim Ulang Kode
                  </>
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="btn btn-primary w-full bg-teal-500 rounded-lg hover:bg-teal-600 border-none text-white font-semibold text-base h-12 disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Memverifikasi...
              </span>
            ) : (
              'Verifikasi OTP'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/forgot-password" 
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Ganti Email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
