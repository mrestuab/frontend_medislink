import React, { useState } from "react";
import { Image as ImageIcon, X, AlertCircle } from "lucide-react";

const NewsForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        showNotification("Ukuran gambar maksimal 2MB!");
        e.target.value = null;
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
        showNotification("Judul dan Konten berita wajib diisi!");
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
    <form onSubmit={submit} className="space-y-4 relative">
      
      {notification && (
        <div className="absolute -top-12 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
                <AlertCircle className="w-4 h-4" />
                {notification}
            </div>
        </div>
      )}

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
            <div className={`w-full border border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${notification ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                <ImageIcon className={`w-6 h-6 mb-2 ${notification ? 'text-red-400' : 'text-gray-400'}`} />
                <span className={`text-xs ${notification ? 'text-red-500 font-medium' : 'text-gray-500'}`}>Klik untuk upload gambar</span>
                <span className="text-[10px] text-gray-400 mt-1">Maksimal 2MB (JPG/PNG)</span>
            </div>
        ) : (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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
            placeholder="Tulis detail berita lengkap di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full outline-none border-none bg-transparent text-sm resize-none leading-relaxed"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-lg shadow-teal-100 mt-2 border-none normal-case transition-all hover:shadow-teal-200"
      >
        Publikasikan Berita
      </button>
    </form>
  );
};

export default NewsForm;