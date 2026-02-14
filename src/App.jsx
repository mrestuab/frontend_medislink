import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyOTPPage from './pages/VerifyOTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UserDashboardPage from './pages/UserDashboardPage'
import AdminDashboard from './pages/admin/AdminDashboardPage'

import UserLayout from './layouts/UserLayout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ToolDetailPage from './pages/ToolDetailPage'
import ToolPage from './pages/ToolPage'
import DonationPage from './pages/DonationPage'
import ProfilePage from './pages/ProfilePage'
import NewsDetailPage from './pages/NewsDetailPage'


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/alat" element={<ToolPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/donasi" element={<DonationPage />} />
            <Route path="/alat/:id" element={<ToolDetailPage />} />
          </Route>
          
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </div>
  )
}

export default App