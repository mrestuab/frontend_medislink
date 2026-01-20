import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdateStatus = async (id, newStatus) => {
    let message = "Lanjutkan aksi ini?";
    if (newStatus === "approved") message = "Setujui peminjaman? Barang akan di-booking.";
    if (newStatus === "rejected") message = "Tolak peminjaman? Stok akan dikembalikan.";
    if (newStatus === "active") message = "Konfirmasi user sudah datang dan barang diserahkan?";
    if (newStatus === "completed") message = "Konfirmasi barang sudah kembali & stok ditambah?";

    if (!window.confirm(message)) return;

    try {
      await updateLoanStatus(id, newStatus);
      fetchData(); 
      alert("Status berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal update status.");
    }
  };
  
  const handleAddTool = async (formData) => {
      try {
        await createTool(formData);
        setIsAddToolOpen(false);
        fetchData(); 
        alert("Berhasil menambahkan alat baru!");
      } catch (error) {
        console.error("Gagal create tool:", error);
        alert("Gagal menambahkan alat.");
      }
  };

  const handleDeleteTool = async (id) => {
    if (window.confirm("Yakin ingin menghapus alat ini?")) {
        try {
            await deleteTool(id);
            setTools(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Gagal delete tool:", error);
            alert("Gagal menghapus alat.");
        }
    }
  };

  const handleCreateNews = async (formData) => {
    try {
      await apiCreateNews(formData); 
      
      fetchData(); 
      alert("Berita berhasil dipublikasikan!");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat berita.");
    }
  };

    const handleCreateAd = async (formData) => {
      try {
        await createAd(formData);
        setNewAd({ title: "", description: "", image_url: "", link: "" }); 
        fetchData();
        alert("Iklan berhasil ditambahkan ke Slider Homepage!");
      } catch (error) {
        console.error(error);
        alert("Gagal membuat iklan.");
      }
    };

  const handleDeleteAd = async (id) => {
      if (!window.confirm("Hapus iklan ini dari slider?")) return;
      try {
          await deleteAd(id);
          fetchData();
      } catch (error) {
          console.error(error);
          alert("Gagal menghapus iklan.");
      }
  };
  const handleApproveDonation = async (id, condition) => {
      try {
          await approveDonation(id, condition);
          alert("Berhasil! Stok inventaris telah diperbarui sesuai kondisi barang.");
          fetchData(); 
      } catch (error) {
          console.error(error);
          alert("Gagal memproses donasi.");
      }
  };

  const handleReceiveDonation = async (id) => {
    try {
      await receiveDonation(id);
      alert("Status barang berhasil diubah menjadi 'Barang Diterima Admin'.");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal update status donasi.");
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="fixed top-0 w-full bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center font-bold shadow-sm">M</div>
            <span className="font-bold text-lg tracking-tight text-gray-800">MedisLink Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm hidden sm:block">
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-10">
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: "loans", label: `Peminjaman (${loans.length})` },
            { id: "inventory", label: "Inventaris" },
            { id: "news", label: "Berita" },
            { id: "ads", label: "Manajemen Iklan" }, 
            { id: "donations", label: `Donasi (${donations.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
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
          <div>
             <div className="flex justify-end mb-6">
                <button 
                    onClick={() => setIsAddToolOpen(true)}
                    className="btn btn-primary bg-teal-500 hover:bg-teal-600 rounded-xl text-white gap-2 normal-case font-medium px-6"
                >
                    <Plus className="w-5 h-5" /> Tambah Alat
                </button>
             </div>
             <InventoryTable tools={tools} onDelete={handleDeleteTool} />
             <AddToolModal isOpen={isAddToolOpen} onClose={() => setIsAddToolOpen(false)} onSubmit={handleAddTool} />
          </div>
        )}

        {activeTab === "news" && (
           <div className="mt-6 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-10">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Buat Berita Baru</h3>
              <NewsForm onSubmit={handleCreateNews} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-4">Daftar Berita</h3>
            <NewsList news={allNews} />
          </div>
        )}

        {activeTab === "ads" && (
            <div className="mt-6 max-w-6xl mx-auto space-y-10">
                
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
            <div className="mt-6">
                <DonationsTable donations={donations} onReceive={handleReceiveDonation} onApprove={handleApproveDonation} />
            </div>
        )}

      </main>
    </div>
  );
}