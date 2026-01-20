import React, { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";

const NewsForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
        alert("Judul dan Konten wajib diisi!");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    
    if (imageFile) {
        formData.append("image", imageFile); 
    }

    onSubmit(formData);

    setTitle("");
    setContent("");
    clearImage();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="form-control">
        <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
          Judul Berita
        </label>
        <div className="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
          <input
            type="text"
            placeholder="Contoh: Kegiatan Donor Darah 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full outline-none border-none bg-transparent text-sm"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
          Gambar Utama (Opsional)
        </label>
        
        {!previewUrl ? (
            <div className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Klik untuk upload gambar</span>
            </div>
        ) : (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>

      <div className="form-control">
        <label className="label-text text-xs font-bold text-gray-500 mb-1 block">
          Konten Berita
        </label>
        <div className="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:border-teal-500 bg-white">
          <textarea
            rows={5}
            placeholder="Tulis isi berita di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full outline-none border-none bg-transparent text-sm resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-lg shadow-teal-100 mt-2 border-none normal-case"
      >
        Publikasikan Berita
      </button>
    </form>
  );
};

export default NewsForm;