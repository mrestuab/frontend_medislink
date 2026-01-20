import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Calendar, Activity, Ruler, Weight, Info, Heart } from "lucide-react";

import { getToolById, createLoan, getCurrentUserProfile } from "../services/userServices";

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [formData, setFormData] = useState({
    loanDate: "",
    returnDue: "", 
    medicalCondition: "",
    notes: "",
  });

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
      const data = await getToolById(id);
      setTool(data);
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
        alert("Mohon lengkapi Tanggal Mulai dan Kondisi Medis.");
        return;
    }

    if (new Date(formData.loanDate) < new Date(todayString)) {
        alert("Tanggal mulai tidak boleh di masa lalu.");
        return;
    }
    if (formData.returnDue && new Date(formData.returnDue) < new Date(formData.loanDate)) {
        alert("Tanggal kembali tidak boleh lebih awal dari tanggal mulai.");
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
        
        alert("Permintaan berhasil diajukan! Cek status di Riwayat.");
        navigate("/dashboard"); 

    } catch (error) {
        console.error("Gagal mengajukan pinjaman:", error);
        alert("Gagal mengajukan pinjaman. Coba lagi.");
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
    <main className="min-h-screen bg-gray-50 pb-20">
      
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="btn btn-ghost btn-sm gap-2 text-gray-600 normal-case">
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
                    {tool.type && <span className="badge badge-outline border-blue-200 text-blue-700 bg-blue-50 p-3">{tool.type}</span>}
                    {tool.size && <span className="badge badge-outline border-purple-200 text-purple-700 bg-purple-50 p-3">{tool.size}</span>}
                 </div>
                 <p className="text-gray-600 leading-relaxed text-base">{tool.description || "Tidak ada deskripsi tersedia."}</p>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Spesifikasi Teknis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Dimensi</p>
                        <p className="font-semibold text-gray-900">{tool.dimensions || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Beban Maks</p>
                        <p className="font-semibold text-gray-900">{tool.weight_cap || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
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
              
              {/* KTP Verification Check */}
              {!isVerified ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  Anda harus melengkapi data KTP di profil sebelum bisa meminjam alat medis.<br />
                  <a href="/profile" className="underline text-teal-600 font-bold">Lengkapi Data Diri</a>
                </div>
              ) : null}
              
              {/* Form hanya muncul jika sudah verifikasi KTP */}
              {isVerified && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                      Tanggal Mulai Pinjam
                    </label>

                    <label className="flex items-center gap-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="loanDate"
                        min={todayString}
                        value={formData.loanDate}
                        onChange={handleChange}
                        className="grow outline-none border-none bg-transparent"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                      Rencana Kembali
                    </label>

                    <label className="flex items-center gap-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="returnDue"
                        min={formData.loanDate || todayString}
                        value={formData.returnDue}
                        onChange={handleChange}
                        className="grow outline-none border-none bg-transparent"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label-text text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-red-500" /> Kondisi Medis
                    </label>

                    <div className="flex items-center w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500">
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

                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500">
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
                      className="btn btn-primary w-full bg-teal-600 rounded-lg hover:bg-teal-700 border-none text-white mt-4 shadow-lg shadow-teal-100 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {isSubmitting ? "Mengirim..." : "Ajukan Permintaan"}
                  </button>
                </form>
              )}

              <div className="mt-4 bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
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