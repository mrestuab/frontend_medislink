import React from "react";
import { Image as ImageIcon, X, Link as LinkIcon } from "lucide-react";

const AddsForm = ({ newAd, setNewAd, onSubmit }) => {
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar maksimal 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAd({
                    ...newAd,
                    image_url: reader.result, 
                    raw_image: file 
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setNewAd({ ...newAd, image_url: "", raw_image: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", newAd.title);
        formData.append("description", newAd.description);
        formData.append("link", newAd.link);
        if (newAd.raw_image) {
            formData.append("image", newAd.raw_image); 
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="form-control">
                <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                    Judul Utama
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                    <input
                        type="text"
                        placeholder="Contoh: Diskon Kursi Roda 50%"
                        className="w-full outline-none border-none bg-transparent text-sm"
                        value={newAd.title}
                        onChange={e => setNewAd({ ...newAd, title: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                    Link Tujuan (Opsional)
                </label>
                <div className="flex items-center gap-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="/tools atau /login"
                        className="grow outline-none border-none bg-transparent text-sm"
                        value={newAd.link}
                        onChange={e => setNewAd({ ...newAd, link: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                    Gambar Iklan (Banner)
                </label>
                
                {!newAd.image_url ? (
                    <div className="w-full border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            accept="image/*"
                            required 
                        />
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium">Klik untuk upload banner</span>
                        <span className="text-[10px] text-gray-400 mt-1">Maksimal 2MB</span>
                    </div>
                ) : (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                        <img 
                            src={newAd.image_url} 
                            alt="Preview Banner" 
                            className="w-full h-full object-cover" 
                        />
                        <button 
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="form-control">
                <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
                    Deskripsi Singkat
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
                    <textarea
                        placeholder="Deskripsi yang muncul di bawah judul..."
                        className="w-full outline-none border-none bg-transparent text-sm resize-none"
                        rows={2}
                        value={newAd.description}
                        onChange={e => setNewAd({ ...newAd, description: e.target.value })}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full bg-teal-600 rounded-lg hover:bg-teal-700 border-none text-white mt-4 shadow-lg shadow-teal-100 normal-case"
            >
                Upload & Tampilkan di Slider
            </button>
        </form>
    );
};

export default AddsForm;