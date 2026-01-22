import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    User, Phone, LogOut, Edit2, Save, MapPin, 
    CreditCard, FileText, AlertCircle, CheckCircle, UploadCloud, Shield, X 
} from "lucide-react";
import { getCurrentUserProfile, updateProfile } from "../services/userServices";

const ProfilePage = () => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const [backupFormData, setBackupFormData] = useState(null);
    const [backupPreviewProfile, setBackupPreviewProfile] = useState("");
    const [backupPreviewKTP, setBackupPreviewKTP] = useState("");

    const [notification, setNotification] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        nik: "",
    });

    const [fileProfile, setFileProfile] = useState(null);
    const [fileKTP, setFileKTP] = useState(null);
    const [previewProfile, setPreviewProfile] = useState("");
    const [previewKTP, setPreviewKTP] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const fetchProfile = async () => {
        try {
            const data = await getCurrentUserProfile();
            setUser(data);
            setFormData({ 
                name: data.name || "", 
                phone: data.phone || "",
                address: data.address || "",
                nik: data.nik || "" 
            });
            setPreviewProfile(data.foto_profile || "");
            setPreviewKTP(data.foto_ktp || "");
        } catch (error) {
            console.error("Gagal load profile", error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showNotification("Ukuran file maksimal 2MB!", "error");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "profile") {
                    setFileProfile(file);
                    setPreviewProfile(reader.result);
                } else {
                    setFileKTP(file);
                    setPreviewKTP(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!formData.nik) {
            showNotification("NIK wajib diisi untuk verifikasi akun!", "error");
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        dataToSend.append("phone", formData.phone);
        dataToSend.append("address", formData.address);
        dataToSend.append("nik", formData.nik);
        
        if (fileProfile) dataToSend.append("foto_profile", fileProfile);
        if (fileKTP) dataToSend.append("foto_ktp", fileKTP);

        try {
            await updateProfile(dataToSend);
            
            showNotification("Data diri berhasil diperbarui!", "success");
            
            setIsEditing(false);
            fetchProfile(); 
        } catch (error) {
            console.error(error);
            showNotification("Gagal memperbarui profil. Coba lagi.", "error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading || editLoading) {
        return (
            <div className="flex justify-center py-20 min-h-screen bg-gray-50">
                <span className="loading loading-spinner loading-lg text-teal-600"></span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto font-sans pb-10 relative">
            
            {notification && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className={`px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-white font-medium ${
                        notification.type === 'success' ? 'bg-teal-600' : 'bg-red-500'
                    }`}>
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                        {notification.message}
                    </div>
                </div>
            )}

            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Keluar Aplikasi?</h3>
                        <p className="text-gray-500 mb-6 text-sm">Anda harus login kembali untuk mengakses akun Anda.</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 btn btn-ghost text-gray-600 hover:bg-gray-100 rounded-xl"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="flex-1 btn bg-red-500 hover:bg-red-600 text-white border-none rounded-xl"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-8 pb-2 px-2 flex justify-between items-center">
                <button
                    type="button"
                    onClick={() => navigate(user?.role === "admin" ? "/admin" : "/dashboard")}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-semibold text-sm px-4 py-2 rounded-lg border border-teal-100 bg-white shadow-sm hover:bg-teal-50 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Kembali ke Dashboard
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">                
                <div className="h-40 bg-teal-600 w-full relative">
                    <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-20"></div>
                </div>

                <div className="px-8 pb-8 relative">
                    
                    <div className="flex flex-col items-center -mt-16 mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white p-2 rounded-full shadow-lg overflow-hidden">
                                {previewProfile ? (
                                    <img src={previewProfile} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-teal-50 rounded-full flex items-center justify-center text-teal-600 text-4xl font-bold border border-teal-100">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            <div className="absolute bottom-1 right-0 bg-teal-700 text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1 z-10">
                                <Shield className="w-3 h-3" />
                                {user?.role === "admin" ? "Admin" : "Member"}
                            </div>
                        </div>

                        <div className="text-center mt-3">
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            
                            <div className="mt-2 flex justify-center">
                                {!user?.nik || !user?.foto_ktp ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                                        <AlertCircle className="w-3.5 h-3.5" /> Data Belum Lengkap
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {!isEditing ? (
                        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Phone className="w-4 h-4 text-teal-600" />
                                        <span className="text-xs font-bold text-gray-400 uppercase">WhatsApp</span>
                                    </div>
                                    <p className="font-semibold text-gray-800 pl-6">{user?.phone || "-"}</p>
                                </div>
                                
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CreditCard className="w-4 h-4 text-teal-600" />
                                        <span className="text-xs font-bold text-gray-400 uppercase">NIK</span>
                                    </div>
                                    <p className="font-semibold text-gray-800 pl-6">{user?.nik || "-"}</p>
                                </div>

                                <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-teal-600" />
                                        <span className="text-xs font-bold text-gray-400 uppercase">Alamat Domisili</span>
                                    </div>
                                    <p className="font-semibold text-gray-800 pl-6">{user?.address || "-"}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={async () => {
                                        setEditLoading(true);
                                        setBackupFormData(formData);
                                        setBackupPreviewProfile(previewProfile);
                                        setBackupPreviewKTP(previewKTP);
                                        try {
                                            const data = await getCurrentUserProfile();
                                            setFormData({
                                                name: data.name || "",
                                                phone: data.phone || "",
                                                address: data.address || "",
                                                nik: data.nik || ""
                                            });
                                            setPreviewProfile(data.foto_profile || "");
                                            setPreviewKTP(data.foto_ktp || "");
                                        } catch (error) {
                                            console.error("Gagal load profile", error);
                                        }
                                        setEditLoading(false);
                                        setIsEditing(true);
                                    }}
                                    className="flex-1 btn bg-teal-600 hover:bg-teal-700 text-white border-none rounded-xl font-bold shadow-md flex gap-2 transition-all hover:-translate-y-1"
                                >
                                    <Edit2 className="w-4 h-4" /> Lengkapi Data Diri
                                </button>
                                <button 
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="btn btn-outline border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl font-bold flex gap-2 transition-all"
                                >
                                    <LogOut className="w-4 h-4" /> Keluar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="max-w-2xl mx-auto space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                            
                            <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 border-2 border-white shrink-0">
                                    {previewProfile ? (
                                        <img src={previewProfile} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <User className="w-full h-full p-3 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-900 mb-1">Ganti Foto Profil</label>
                                    <input 
                                        type="file" 
                                        onChange={(e) => handleFileChange(e, "profile")} 
                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg bg-gray-50 focus:bg-white pl-3 border border-teal-600 focus:border-teal-600 outline-none py-2 transition-all" placeholder="Nama Sesuai KTP" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold text-gray-500 uppercase">No. WhatsApp</label>
                                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-lg bg-gray-50 focus:bg-white pl-3 border border-teal-600 focus:border-teal-600 outline-none py-2 transition-all" placeholder="08..." />
                                </div>
                                <div className="form-control md:col-span-2">
                                    <label className="label text-xs font-bold text-gray-500 uppercase">Alamat Domisili</label>
                                    <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full rounded-lg bg-gray-50 focus:bg-white resize-none pl-3 border border-teal-600 focus:border-teal-600 outline-none py-2 transition-all" rows={2} placeholder="Alamat lengkap..." />
                                </div>
                            </div>

                            <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 mt-2">
                                <h4 className="text-xs font-bold text-orange-800 mb-4 flex items-center gap-2 border-b border-orange-200 pb-2">
                                    <Shield className="w-4 h-4" /> Data Wajib Verifikasi
                                </h4>
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label text-xs font-bold text-orange-900/70 uppercase">NIK (16 Digit)</label>
                                        <input type="number" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} className="w-full rounded-lg font-semibold pl-3 border border-teal-600 focus:border-teal-600 outline-none py-2 transition-all" placeholder="NIK" required disabled={!!user?.nik} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-xs font-bold text-orange-900/70 uppercase">Upload Foto KTP</label>
                                        <div className="border-2 border-dashed border-orange-300 rounded-xl p-3 bg-white hover:bg-orange-50 transition-colors relative cursor-pointer text-center group">
                                            <input type="file" onChange={(e) => handleFileChange(e, "ktp")} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" disabled={!!user?.foto_ktp} />
                                            {previewKTP ? (
                                                <div className="h-32 w-full relative">
                                                    <img src={previewKTP} className="w-full h-full object-contain rounded-lg" alt="KTP" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold rounded-lg transition-opacity">
                                                        <UploadCloud className="w-4 h-4 mr-1" /> Ganti
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-6 text-orange-400 flex flex-col items-center">
                                                    <FileText className="w-8 h-8 mb-2" />
                                                    <span className="text-sm font-medium text-gray-500">Klik untuk upload KTP</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => {
                                        setFormData(backupFormData || formData);
                                        setPreviewProfile(backupPreviewProfile || previewProfile);
                                        setPreviewKTP(backupPreviewKTP || previewKTP);
                                        setIsEditing(false);
                                    }} className="flex-1 btn btn-ghost border-gray-300 rounded-xl text-gray-500 hover:bg-gray-100">Batal</button>
                                <button type="submit" className="flex-1 btn bg-teal-600 hover:bg-teal-700 text-white border-none rounded-xl shadow-lg transition-all hover:translate-y-px">
                                    <Save className="w-4 h-4" /> Simpan Data
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            
            <p className="text-center text-gray-400 text-xs mt-6">
                &copy; MedisLink. Data Anda aman dan terenkripsi.
            </p>
        </div>
    );
};

export default ProfilePage;