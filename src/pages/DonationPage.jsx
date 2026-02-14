import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, X, UploadCloud, MapPin, Package, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { createDonation } from "../services/userServices";

const TOOL_CATEGORIES = [
    "Mobilitas (Kursi Roda, Tongkat, dll)",
    "Pernapasan (Tabung Oksigen, Nebulizer)",
    "Rehabilitasi (Kasur Decubitus, dll)",
    "P3K & Medis Dasar",
    "Lainnya"
];

const DonationPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        tool_name: "",
        category: TOOL_CATEGORIES[0],
        quantity: 1,
        description: "",
        pickup_address: "",
        pickup_date: "", 
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showNotification("Ukuran foto maksimal 2MB!", "error");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewUrl("");
    };

    const getToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            showNotification("Mohon sertakan foto alat medis untuk verifikasi.", "error");
            return;
        }

        if (formData.pickup_date < getToday()) {
            showNotification("Tanggal penjemputan tidak boleh lampau.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const dataToSend = new FormData();
            dataToSend.append("tool_name", formData.tool_name);
            dataToSend.append("category", formData.category);
            dataToSend.append("quantity", formData.quantity);
            dataToSend.append("description", formData.description);
            dataToSend.append("pickup_address", formData.pickup_address);
            dataToSend.append("pickup_date", formData.pickup_date);
            dataToSend.append("image", imageFile); 

            await createDonation(dataToSend);

            showNotification("Donasi berhasil dikirim! Menunggu verifikasi.", "success");
            
            setFormData({
                tool_name: "", category: TOOL_CATEGORIES[0], quantity: 1,
                description: "", pickup_address: "", pickup_date: "",
            });
            setImageFile(null);
            setPreviewUrl("");

            setTimeout(() => {
                navigate("/dashboard"); 
            }, 2000);

        } catch (error) {
            console.error("Gagal donasi:", error);
            showNotification("Terjadi kesalahan sistem. Coba lagi nanti.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            
            {notification && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className={`px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-white font-medium ${
                        notification.type === 'success' ? 'bg-teal-600' : 'bg-red-500'
                    }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        {notification.message}
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
                <div className="bg-teal-600 px-8 py-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Package className="w-32 h-32 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 relative z-10">
                        <Package className="w-6 h-6" /> Form Donasi Alat Medis
                    </h2>
                    <p className="text-teal-100 mt-1 text-sm relative z-10">
                        Bantuan Anda sangat berarti bagi mereka yang membutuhkan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label-text text-sm font-bold text-gray-700 mb-2 block">
                                Nama Alat Medis
                            </label>
                            <input
                                type="text"
                                name="tool_name"
                                value={formData.tool_name}
                                onChange={handleChange}
                                placeholder="Contoh: Kursi Roda Bekas"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label-text text-sm font-bold text-gray-700 mb-2 block">
                                Kategori
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white transition-all"
                            >
                                {TOOL_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 form-control">
                            <label className="label-text text-sm font-bold text-gray-700 mb-2 block">
                                Deskripsi Kondisi & Spesifikasi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none transition-all"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label-text text-sm font-bold text-gray-700 mb-2 block">
                                Jumlah (Unit)
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none font-bold text-center transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label-text text-sm font-bold text-gray-700 mb-2 block">
                            Foto Alat (Wajib)
                        </label>
                        {!previewUrl ? (
                            <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 transition-all cursor-pointer relative group ${notification?.type === 'error' && !imageFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className={`w-6 h-6 ${notification?.type === 'error' && !imageFile ? 'text-red-500' : 'text-teal-600'}`} />
                                </div>
                                <p className={`text-sm font-medium ${notification?.type === 'error' && !imageFile ? 'text-red-500' : 'text-gray-500'}`}>Klik untuk upload atau drag & drop</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label-text text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-teal-600" /> Rencana Tanggal Penjemputan
                            </label>
                            <input 
                                type="date"
                                name="pickup_date"
                                value={formData.pickup_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                required
                                min={getToday()}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label-text text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-teal-600" /> Lokasi Barang
                            </label>
                            <textarea
                                name="pickup_address"
                                value={formData.pickup_address}
                                onChange={handleChange}
                                rows={1}
                                placeholder="Alamat lengkap..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none h-[42px] transition-all" 
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:translate-y-px"
                        >
                            {isSubmitting ? "Mengirim..." : "Kirim Donasi"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default DonationPage;