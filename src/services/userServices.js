import api from './api';
import { jwtDecode } from "jwt-decode";

export const getCurrentUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    const userId = decoded.user_id;

    if (!userId) return null;

    const response = await api.get(`/users/${userId}`);
    return response.data;

  } catch (error) {
    console.error("Gagal ambil profil user:", error);
    return null;
  }
};

export const updateProfile = async (formData) => {
    const response = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getPublicTools = async () => {
  try {
    const response = await api.get('/tools');

    return response.data.map(tool => ({
      id: tool.id,
      name: tool.name,
      category: tool.category_id,
      type: tool.type,
      size: tool.size,
      dimensions: tool.dimensions,
      weight_cap: tool.weight_cap,
      description: tool.description,
      stock: tool.stock,
      condition: tool.condition,
      image_url: tool.image_url,
    }));
  } catch (error) {
    console.error("Gagal ambil alat:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Gagal ambil kategori:", error);
    return [
      { id: 'mobilitas', name: 'Mobilitas' },
      { id: 'rehabilitasi', name: 'Rehabilitasi' },
      { id: 'pernapasan', name: 'Pernapasan' },
    ];
  }
};

export const getToolById = async (id) => {
  try {
    const response = await api.get(`/tools/${id}`);
    const tool = response.data;

    return {
      id: tool.id,
      name: tool.name,
      category: tool.category_id,
      type: tool.type,
      size: tool.size,
      dimensions: tool.dimensions,
      weight_cap: tool.weight_cap,
      description: tool.description,
      stock: tool.stock,
      condition: tool.condition,
      image_url: tool.image_url,
      reviews: []
    };
  } catch (error) {
    console.error("Gagal ambil detail alat:", error);
    return null;
  }
};

export const createLoan = async (loanData) => {
  try {
    const response = await api.post('/loans', loanData);
    return response.data;
  } catch (error) {
    console.error("Gagal mengajukan pinjaman:", error);
    throw error;
  }
};

export const getMyLoans = async () => {
  try {
    const response = await api.get('/loans/my');

    return response.data.map(loan => ({
      id: loan._id,

      toolName: loan.tool_detail ? loan.tool_detail.name : "Alat Tidak Dikenal",
      toolImage: loan.tool_detail ? loan.tool_detail.image_url : null,

      quantity: loan.quantity,
      loanDate: loan.loan_date,
      returnDue: loan.return_due,
      status: loan.status,

      medicalCondition: loan.medical_condition,
      notes: loan.notes
    }));
  } catch (error) {
    console.error("Gagal ambil riwayat pinjaman:", error);
    return [];
  }
};

export const getAds = async () => {
  try {
    const response = await api.get('/adds');
    return response.data;
  } catch (error) {
    console.error("Gagal ambil iklan:", error);
    return [
        {
            id: 1,
            title: "Promo Kursi Roda",
            description: "Diskon 50% untuk penyewaan bulan pertama!",
            image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
            link: "/login"
        },
        {
            id: 2,
            title: "Layanan Antar Jemput",
            description: "Gratis ongkir untuk wilayah Jakarta Selatan.",
            image_url: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80",
            link: "/tools"
        }
    ];
  }
};

export const getMyNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error("Gagal ambil notifikasi:", error);
    return [];
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    await api.put(`/notifications/${id}/read`);
    return true;
  } catch (error) {
    console.error("Gagal update status notif:", error);
    return false;
  }
};

export const getPublicNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error("Gagal ambil berita:", error);
    return [];
  }
};

export const createDonation = async (donationData) => {
    const response = await api.post("/donations", donationData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getUserDonations = async () => {
    const response = await api.get("/donations/history");
    return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const verifyOTP = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/auth/reset-password', { 
    email, 
    otp, 
    new_password: newPassword 
  });
  return response.data;
};

export const getNewsById = async (id) => {
  try {
    const response = await api.get(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    throw error;
  }
};
