import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Calendar, Activity, Ruler, Info, CheckCircle } from "lucide-react";

import { getToolById, createLoan, getCurrentUserProfile } from "../services/userServices";

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    loanDate: "",
    returnDue: "", 
    medicalCondition: "",
    notes: "",
  });

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  };

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const todayString = getTodayString(); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
          const data = await getToolById(id);
          setTool(data);
      } catch (err) {
          console.error("Gagal mengambil data alat:", err);}
      setLoading(false);
    };
    fetchData();

    const fetchUser = async () => {
      try {
        const userData = await getCurrentUserProfile();
        setUser(userData);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "loanDate") {
        if (formData.returnDue && value > formData.returnDue) {
            setFormData({ ...formData, loanDate: value, returnDue: "" }); 
        } else {
            setFormData({ ...formData, loanDate: value });
        }
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.loanDate || !formData.medicalCondition) {
        showNotification("Mohon lengkapi Tanggal Mulai dan Kondisi Medis.", "error");
        return;
    }

    if (new Date(formData.loanDate) < new Date(todayString)) {
        showNotification("Tanggal mulai tidak boleh di masa lalu.", "error");
        return;
    }
    if (formData.returnDue && new Date(formData.returnDue) < new Date(formData.loanDate)) {
        showNotification("Tanggal kembali tidak boleh lebih awal dari tanggal mulai.", "error");
        return;
    }

    setIsSubmitting(true);
    try {
        await createLoan({
            tool_id: tool.id,
            quantity: 1, 
            loan_date: formData.loanDate,
            return_due: formData.returnDue || formData.loanDate, 
            medical_condition: formData.medicalCondition,
            notes: formData.notes
        });
        
        showNotification("Permintaan berhasil diajukan! Cek status di Riwayat.", "success");
        
        setTimeout(() => {
            navigate("/dashboard"); 
        }, 2000);

    } catch (error) {
        console.error("Gagal mengajukan pinjaman:", error);
        showNotification("Gagal mengajukan pinjaman. Coba lagi.", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  const isVerified = user?.nik && user?.foto_ktp;

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Alat Tidak Ditemukan</h1>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary bg-teal-500 border-none text-white">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 relative">
      
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300 w-full max-w-sm px-4">
            <div className={`px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-white font-medium justify-center ${
                notification.type === 'success' ? 'bg-teal-600' : 'bg-red-500'
            }`}>
                {notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{notification.message}</span>
            </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="btn btn-ghost btn-sm gap-2 text-gray-600 normal-case hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate hidden sm:block">{tool.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 h-80 sm:h-96 flex items-center justify-center overflow-hidden shadow-sm relative group">
                {tool.image_url ? (
                    <img src={tool.image_url} alt={tool.name} className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex flex-col items-center text-gray-300">
                        <span className="text-6xl font-bold">{tool.name.charAt(0)}</span>
                        <span className="text-sm mt-2">Tidak ada gambar</span>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="badge badge-lg bg-black/60 text-white border-none p-4 uppercase tracking-wider font-bold text-xs backdrop-blur-sm">
                        {tool.category}
                    </span>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {tool.type && <span className="badge badge-outline border-blue-200 text-blue-700 bg-blue-50 p-3 font-medium">{tool.type}</span>}
                    {tool.size && <span className="badge badge-outline border-purple-200 text-purple-700 bg-purple-50 p-3 font-medium">{tool.size}</span>}
                 </div>
                 <p className="text-gray-600 leading-relaxed text-base">{tool.description || "Tidak ada deskripsi tersedia."}</p>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Spesifikasi Teknis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                        <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Dimensi</p>
                        <p className="font-semibold text-gray-900">{tool.dimensions || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                        <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Beban Maks</p>
                        <p className="font-semibold text-gray-900">{tool.weight_cap || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                        <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Kondisi</p>
                        <span className={`badge border-none font-bold ${tool.condition === "baik" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {tool.condition ? tool.condition.toUpperCase() : "-"}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-lg sticky top-24">
              
              {!isVerified ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">Verifikasi Diperlukan</p>
                    <p className="mb-2">Lengkapi data KTP Anda untuk mulai meminjam alat.</p>
                    <button onClick={() => navigate("/profile")} className="btn btn-xs btn-outline border-red-300 text-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white">Lengkapi Data Diri</button>
                  </div>
                </div>
              ) : null}
              
              {isVerified && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                      Tanggal Mulai Pinjam
                    </label>

                    <label className="flex items-center gap-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="loanDate"
                        min={todayString}
                        value={formData.loanDate}
                        onChange={handleChange}
                        className="grow outline-none border-none bg-transparent text-sm"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                      Rencana Kembali
                    </label>

                    <label className="flex items-center gap-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="returnDue"
                        min={formData.loanDate || todayString}
                        value={formData.returnDue}
                        onChange={handleChange}
                        className="grow outline-none border-none bg-transparent text-sm"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-red-500" /> Kondisi Medis
                    </label>

                    <div className="flex items-center w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                      <input 
                        type="text"
                        name="medicalCondition"
                        value={formData.medicalCondition}
                        onChange={handleChange}
                        className="grow outline-none border-none bg-transparent text-sm"
                        placeholder="Cth: Patah Tulang, Stroke"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                      Tujuan Penggunaan
                    </label>

                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full outline-none border-none bg-transparent text-sm resize-none"
                        placeholder="Jelaskan kebutuhan Anda..."
                        rows={2}
                      ></textarea>
                    </div>
                  </div>

                  <button 
                      type="submit"
                      disabled={tool.stock === 0 || isSubmitting}
                      className="btn btn-primary w-full bg-teal-600 rounded-lg hover:bg-teal-700 border-none text-white mt-4 shadow-lg shadow-teal-100 disabled:bg-gray-300 disabled:text-gray-500 transition-all hover:translate-y-px"
                  >
                    {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : "Ajukan Permintaan"}
                  </button>
                </form>
              )}

              <div className="mt-4 bg-blue-50 p-3 rounded-lg flex gap-3 items-start border border-blue-100">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-snug">
                      Peminjaman bersifat sukarela. Admin akan memverifikasi data Anda.
                  </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}