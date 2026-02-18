import React, { useState, useEffect } from "react";
import { X, AlertCircle, Save, Info, Image, Package } from "lucide-react";

const EditToolModal = ({ isOpen, onClose, onSubmit, tool }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    type: "",
    size: "",
    dimensions: "",
    weight_cap: "",
    description: "",
    stock: "",
    condition: "baik",
    status: "tersedia",
  });

  useEffect(() => {
    if (isOpen && tool) {
      setFormData({
        name: tool.name || "",
        category_id: tool.category || "",
        type: tool.type || "",
        size: tool.size || "",
        dimensions: tool.dimensions || "",
        weight_cap: tool.weight_cap || "",
        description: tool.description || "",
        stock: tool.stock || "",
        condition: tool.condition || "baik",
        status: tool.status || "tersedia",
      });
    }
  }, [isOpen, tool]);

  useEffect(() => {
    if (!isOpen) {
      setNotification(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.stock) {
      showNotification("Nama alat dan stok wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(tool.id, formData);
    } catch (error) {
      console.error(error);
      showNotification("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] animate-in zoom-in duration-200">
        
        {notification && (
          <div className="absolute top-4 left-0 right-0 z-[60] flex justify-center px-4 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="bg-red-500 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {notification}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Save className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Edit Data Alat Medis</h3>
            </div>
            <p className="text-sm text-gray-500 ml-10">Perbarui informasi inventaris alat kesehatan</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Preview Image Tool */}
          {tool?.image_url && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                  <img src={tool.image_url} alt={tool.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-teal-600" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sedang Mengedit</p>
                  </div>
                  <p className="font-bold text-gray-900">{tool.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="inline-block bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {tool.category}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informasi Dasar */}
          <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-teal-200">
              <Info className="w-4 h-4 text-teal-600" />
              <h4 className="text-sm font-bold text-teal-800">Informasi Dasar</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label-text text-sm font-semibold text-gray-700 mb-2 block">
                  Nama Alat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input input-bordered w-full bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 border-gray-300 transition-all"
                  placeholder="Contoh: Kursi Roda"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label-text text-sm font-semibold text-gray-700 mb-2 block">Kategori</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="select select-bordered w-full bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 border-gray-300 transition-all"
                >
                  <option value="mobilitas">MOBILITAS</option>
                  <option value="pernapasan">PERNAPASAN</option>
                  <option value="rehabilitasi">REHABILITASI</option>
                  <option value="general">GENERAL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Spesifikasi Teknis */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <Info className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-bold text-gray-700">Spesifikasi Teknis</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Tipe / Varian</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-200 border-gray-300 transition-all"
                  placeholder="Contoh: Standard, Travel, dll"
                />
              </div>

              <div className="form-control">
                <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Ukuran</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-200 border-gray-300 transition-all"
                  placeholder="Contoh: 18 inch, M/L/XL"
                />
              </div>

              <div className="form-control">
                <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Kapasitas / Beban Maksimal</label>
                <input
                  type="text"
                  value={formData.weight_cap}
                  onChange={(e) => setFormData({ ...formData, weight_cap: e.target.value })}
                  className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-200 border-gray-300 transition-all"
                  placeholder="Contoh: 120 kg, 150 cm"
                />
              </div>

              <div className="form-control">
                <label className="label-text text-sm font-semibold mb-1.5 block text-teal-700">
                  Stok Tersedia <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input input-bordered w-full bg-white focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 border-teal-300 transition-all font-semibold text-gray-900 pr-4"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Deskripsi / Keterangan Dimensi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-200 border-gray-300 transition-all resize-none"
                rows={2}
                placeholder="Informasi tambahan atau dimensi detail alat..."
              ></textarea>
            </div>
          </div>

          {/* Status & Kondisi */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-300">
              <h4 className="text-sm font-bold text-gray-700">Status & Kondisi</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label-text text-sm font-semibold text-gray-700 mb-1.5 block">Kondisi Alat</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="select select-bordered w-full bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 border-gray-300 transition-all"
                >
                  <option value="baik">Baik (Layak Pakai)</option>
                  <option value="rusak ringan">Rusak Ringan</option>
                  <option value="baru">Baru</option>
                  <option value="rusak">Rusak</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label-text text-sm font-semibold text-gray-700 mb-1.5 block">Status Ketersediaan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="select select-bordered w-full bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 border-gray-300 transition-all"
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="dipinjam">Sedang Dipinjam</option>
                  <option value="rusak">Rusak / Tidak Tersedia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-ghost hover:bg-gray-100 text-gray-600 font-medium px-6 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary bg-teal-600 hover:bg-teal-700 border-none text-white font-semibold px-8 shadow-lg shadow-teal-200 rounded-lg flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditToolModal;
