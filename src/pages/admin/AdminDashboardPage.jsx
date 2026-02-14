import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

import NewsForm from "../../components/admin/NewsForm";
import NewsList from "../../components/admin/NewsList";
import AddsForm from "../../components/admin/AddsForm";
import AddsList from "../../components/admin/AddsList";
import LoansTable from "../../components/admin/LoansTable";
import InventoryTable from "../../components/admin/InventoryTable";
import AddToolModal from "../../components/admin/AddToolModal";
import DonationsTable from "./DonationTable";

import { 
    getTools, 
    createTool, 
    deleteTool, 
    getAllLoans, 
    updateLoanStatus, 
    getNews, 
    createNews as apiCreateNews,
    getAds,      
    createAd,    
    deleteAd,
    receiveDonation,
    approveDonation,     
    getDonations
} from "../../services/adminServices";

import { getCurrentUserProfile } from "../../services/userServices"; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("inventory"); 
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      type: "warning" 
  });
  
  const [user, setUser] = useState({ name: "Memuat...", role: "" });
  
  const [loans, setLoans] = useState([]); 
  const [tools, setTools] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [donations, setDonations] = useState([]);
  const [ads, setAds] = useState([]);

  const [newAd, setNewAd] = useState({
      title: "",
      description: "",
      image_url: "",
      link: ""
  });

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const showNotification = (message, type = 'success') => {
      setNotification({ message, type });
      setTimeout(() => {
          setNotification(null);
      }, 3000);
  };

  const closeConfirm = () => {
      setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const fetchUserData = async () => {
    try {
        const profile = await getCurrentUserProfile();
        if (profile) {
            setUser({ name: profile.name, role: profile.role });
        }
    } catch (error) {
        console.error("Gagal ambil profil admin:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [toolsData, loansData, newsData, adsData, donationsData] = await Promise.all([
        getTools(),
        getAllLoans(),
        getNews(),
        getAds(),
        getDonations()
      ]);

      setTools(toolsData || []); 
      setLoans(loansData || []);
      setAllNews(newsData || []);
      setAds(adsData || []); 
      setDonations(donationsData || []);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showNotification("Gagal memuat data dashboard.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setConfirmModal({
        isOpen: true,
        title: "Keluar Aplikasi",
        message: "Apakah Anda yakin ingin keluar dari halaman Admin?",
        type: "danger",
        onConfirm: () => {
            localStorage.removeItem("token");
            navigate("/login");
            closeConfirm();
        }
    });
  };

  const handleUpdateStatus = (id, newStatus) => {
    let message = "Lanjutkan aksi ini?";
    if (newStatus === "approved") message = "Setujui peminjaman? Barang akan di-booking.";
    if (newStatus === "rejected") message = "Tolak peminjaman? Stok akan dikembalikan.";
    if (newStatus === "active") message = "Konfirmasi user sudah datang dan barang diserahkan?";
    if (newStatus === "completed") message = "Konfirmasi barang sudah kembali & stok ditambah?";

    setConfirmModal({
        isOpen: true,
        title: "Update Status Peminjaman",
        message: message,
        type: "warning",
        onConfirm: async () => {
            try {
                await updateLoanStatus(id, newStatus);
                fetchData(); 
                showNotification("Status berhasil diperbarui!", "success");
            } catch (error) {
                console.error(error);
                showNotification("Gagal update status.", "error");
            }
            closeConfirm();
        }
    });
  };
  
  const handleAddTool = async (formData) => {
      try {
        await createTool(formData);
        setIsAddToolOpen(false);
        fetchData(); 
        showNotification("Berhasil menambahkan alat baru!", "success");
      } catch (error) {
        console.error("Gagal create tool:", error);
        showNotification("Gagal menambahkan alat.", "error");
      }
  };

  const handleDeleteTool = (id) => {
    setConfirmModal({
        isOpen: true,
        title: "Hapus Alat Medis",
        message: "Tindakan ini permanen. Alat akan dihapus dari inventaris.",
        type: "danger",
        onConfirm: async () => {
            try {
                await deleteTool(id);
                setTools(prev => prev.filter(t => t.id !== id));
                showNotification("Alat berhasil dihapus.", "success");
            } catch (error) {
                console.error("Gagal delete tool:", error);
                showNotification("Gagal menghapus alat.", "error");
            }
            closeConfirm();
        }
    });
  };

  const handleCreateNews = async (formData) => {
    try {
      await apiCreateNews(formData); 
      fetchData(); 
      showNotification("Berita berhasil dipublikasikan!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Gagal membuat berita.", "error");
    }
  };

    const handleCreateAd = async (formData) => {
      try {
        await createAd(formData);
        setNewAd({ title: "", description: "", image_url: "", link: "" }); 
        fetchData();
        showNotification("Iklan berhasil ditambahkan ke Slider!", "success");
      } catch (error) {
        console.error(error);
        showNotification("Gagal membuat iklan.", "error");
      }
    };

  const handleDeleteAd = (id) => {
      setConfirmModal({
        isOpen: true,
        title: "Hapus Iklan",
        message: "Iklan akan dihapus dari slider homepage.",
        type: "danger",
        onConfirm: async () => {
            try {
                await deleteAd(id);
                fetchData();
                showNotification("Iklan berhasil dihapus.", "success");
            } catch (error) {
                console.error(error);
                showNotification("Gagal menghapus iklan.", "error");
            }
            closeConfirm();
        }
      });
  };

  const handleApproveDonation = async (id, condition) => {
      try {
          await approveDonation(id, condition);
          showNotification("Berhasil! Stok inventaris diperbarui.", "success");
          fetchData(); 
      } catch (error) {
          console.error(error);
          showNotification("Gagal memproses donasi.", "error");
      }
  };

  const handleReceiveDonation = async (id) => {
    try {
      await receiveDonation(id);
      showNotification("Status diubah menjadi 'Barang Diterima'.", "success");
      fetchData();
    } catch (error) {
      console.error(error);
      showNotification("Gagal update status donasi.", "error");
    }
  };

  const pendingLoansCount = loans.filter(l => l.status === 'pending').length;
  const pendingDonationsCount = donations.filter(d => d.status === 'pending').length;

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-5 duration-300">
            <div className={`px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-white font-medium ${
                notification.type === 'success' ? 'bg-teal-600' : 'bg-red-500'
            }`}>
                {notification.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                {notification.message}
            </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border border-gray-100">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    confirmModal.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                }`}>
                    {confirmModal.type === 'danger' ? <AlertCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">{confirmModal.message}</p>
                <div className="flex gap-3">
                    <button 
                        onClick={closeConfirm}
                        className="flex-1 btn btn-ghost text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={confirmModal.onConfirm}
                        className={`flex-1 btn border-none text-white rounded-xl ${
                            confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                    >
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
      )}

      <header className="fixed top-0 w-full bg-white z-40 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-teal-100 text-lg">M</div>
            <span className="font-bold text-lg tracking-tight text-gray-800">MedisLink Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm hidden sm:block">
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-teal-600 font-bold uppercase tracking-wide bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-0.5">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-10">
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "loans", label: `Peminjaman (${pendingLoansCount})` }, 
            { id: "inventory", label: "Inventaris" },
            { id: "news", label: "Berita" },
            { id: "ads", label: "Manajemen Iklan" }, 
            { id: "donations", label: `Donasi (${pendingDonationsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap px-1 ${
                activeTab === tab.id 
                  ? "border-teal-500 text-teal-700 font-bold" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "loans" && (
          <LoansTable loans={loans} onUpdateStatus={handleUpdateStatus} />
        )}

        {activeTab === "inventory" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex justify-end mb-6">
                <button 
                    onClick={() => setIsAddToolOpen(true)}
                    className="btn btn-primary bg-teal-600 hover:bg-teal-700 rounded-xl text-white gap-2 normal-case font-bold px-6 shadow-lg shadow-teal-100 border-none"
                >
                    <Plus className="w-5 h-5" /> Tambah Alat
                </button>
             </div>
             <InventoryTable tools={tools} onDelete={handleDeleteTool} />
             <AddToolModal isOpen={isAddToolOpen} onClose={() => setIsAddToolOpen(false)} onSubmit={handleAddTool} />
          </div>
        )}

        {activeTab === "news" && (
           <div className="mt-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-10">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Buat Berita Baru</h3>
              <NewsForm onSubmit={handleCreateNews} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-4 pl-1">Daftar Berita</h3>
            <NewsList news={allNews} />
          </div>
        )}

        {activeTab === "ads" && (
            <div className="mt-6 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                    <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-teal-600" /> Pasang Iklan Baru (Slider)
                    </h3>
                    <AddsForm newAd={newAd} setNewAd={setNewAd} onSubmit={handleCreateAd} />
                </div>
                <AddsList ads={ads} onDelete={handleDeleteAd} />
            </div>
        )}

        {activeTab === "donations" && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DonationsTable donations={donations} onReceive={handleReceiveDonation} onApprove={handleApproveDonation} />
            </div>
        )}

      </main>
    </div>
  );
}