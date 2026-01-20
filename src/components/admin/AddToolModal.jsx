import React, { useState, useEffect } from "react";
import { X, Info, Image as ImageIcon } from "lucide-react";

const TOOL_PRESETS = {
  MOBILITAS: {
    types: ["Kursi Roda", "Kruk Ketiak", "Tongkat Jalan", "Walker"],
    specs: {
      "Kursi Roda": { sizeLabel: "Ukuran (Inch)", capLabel: "Beban Max (kg)", typeLabel: "Varian (Travel/Standard)" },
      "Kruk Ketiak": { sizeLabel: "Size (S/M/L)", capLabel: "Tinggi Badan (cm)", typeLabel: "Jenis" },
      "Tongkat Jalan": { sizeLabel: "Tapak (Kaki 1/3/4)", capLabel: "-", typeLabel: "Tipe" },
      "Walker": { sizeLabel: "-", capLabel: "-", typeLabel: "Mode (Fixed/Reciprocal)" },
    }
  },
  PERNAPASAN: {
    types: ["Nebulizer", "Tabung Oksigen", "Oxygen Concentrator", "Masker Oksigen", "Pulse Oximeter"],
    specs: {
      "Tabung Oksigen": { sizeLabel: "Volume (m3)", capLabel: "Tinggi (cm)", typeLabel: "Tipe" },
      "Oxygen Concentrator": { sizeLabel: "Flow (LPM)", capLabel: "-", typeLabel: "Kapasitas" },
    }
  },
  REHABILITASI: {
    types: ["Hospital Bed", "Kasur Anti-Decubitus", "Commode Chair"],
    specs: {
      "Hospital Bed": { sizeLabel: "-", capLabel: "-", typeLabel: "Jumlah Crank" },
      "Kasur Anti-Decubitus": { sizeLabel: "Tipe (Bubble/Tubular)", capLabel: "Beban Max", typeLabel: "Model" },
    }
  },
  GENERAL: {
    types: ["Tensimeter Digital", "Glucometer", "Popok Dewasa", "Foley Catheter"],
    specs: {
      "Popok Dewasa": { sizeLabel: "Size (M/L/XL)", capLabel: "Lingkar Pinggang (cm)", typeLabel: "Tipe" },
      "Foley Catheter": { sizeLabel: "Ukuran (Fr)", capLabel: "Penggunaan", typeLabel: "Tipe" },
    }
  }
};

const AddToolModal = ({ isOpen, onClose, onSubmit }) => {
  const [category, setCategory] = useState("MOBILITAS");
  
  const [selectedTool, setSelectedTool] = useState(""); 
  const [customName, setCustomName] = useState("");     
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "", size: "", dimensions: "", weight_cap: "", 
    stock: "", condition: "baik", description: "",
    image_url: "", 
    raw_image: null, 
  });

  useEffect(() => {
    if(!isOpen) {
       setCategory("MOBILITAS");
       setSelectedTool("");
       setCustomName("");
       setFormData({
         type: "", size: "", dimensions: "", weight_cap: "", 
         stock: "", condition: "baik", description: "", 
         image_url: "", raw_image: null
       });
       setIsSubmitting(false);
    }
  }, [isOpen]);

  const getLabels = () => {
    const catData = TOOL_PRESETS[category];
    if (catData && catData.specs[selectedTool]) return catData.specs[selectedTool];
    return { sizeLabel: "Ukuran", capLabel: "Kapasitas/Beban", typeLabel: "Tipe/Varian" };
  };
  const labels = getLabels();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Maks 2MB"); return; }
      
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ 
          ...formData, 
          image_url: reader.result, 
          raw_image: file          
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalName = selectedTool === "Lainnya" ? customName : selectedTool;

    if (!finalName || !formData.stock) {
        alert("Nama alat dan stok harus diisi!");
        return;
    }

    if (!formData.raw_image) {
        alert("Mohon upload foto alat!");
        return;
    }

    setIsSubmitting(true); 

    try {
        const dataToSend = new FormData();
        
        dataToSend.append("name", finalName);
        dataToSend.append("category_id", category.toLowerCase());
        dataToSend.append("type", formData.type);
        dataToSend.append("size", formData.size);
        dataToSend.append("dimensions", formData.dimensions);
        dataToSend.append("weight_cap", formData.weight_cap);
        dataToSend.append("description", formData.description);
        dataToSend.append("condition", formData.condition);
        dataToSend.append("stock", formData.stock);
        
        dataToSend.append("image", formData.raw_image); 

        await onSubmit(dataToSend);
        
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tambah Alat Medis</h3>
              <p className="text-sm text-gray-500 mt-1">Lengkapi data inventaris baru</p>
            </div>
            <button onClick={onClose} disabled={isSubmitting} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="form-control">
                    <label className="label-text text-sm font-semibold text-teal-800 mb-2 block">Kategori Alat</label>
                    <select 
                        value={category} 
                        onChange={(e) => { setCategory(e.target.value); setSelectedTool(""); setCustomName(""); }} 
                        className="select select-bordered w-full bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 border-gray-300"
                    >
                        {Object.keys(TOOL_PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
                
                <div className="form-control">
                    <label className="label-text text-sm font-semibold text-teal-800 mb-2 block">Nama Alat</label>
                    <select 
                        value={selectedTool} 
                        onChange={(e) => setSelectedTool(e.target.value)} 
                        className="select select-bordered w-full bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 border-gray-300"
                    >
                        <option value="">-- Pilih Alat --</option>
                        {TOOL_PRESETS[category].types.map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="Lainnya">Lainnya (Input Manual)</option>
                    </select>

                    {selectedTool === "Lainnya" && (
                        <input 
                            type="text" 
                            className="input input-bordered w-full mt-3 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 border-gray-300 placeholder:text-gray-400" 
                            placeholder="Ketik nama alat..." 
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            required
                        />
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Info className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-700">Spesifikasi Teknis</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="form-control">
                        <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">{labels.typeLabel}</label>
                        <input 
                            type="text" 
                            value={formData.type} 
                            onChange={(e) => setFormData({...formData, type: e.target.value})} 
                            className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 border-gray-300 transition-all" 
                            required 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">{labels.sizeLabel}</label>
                        <input 
                            type="text" 
                            value={formData.size} 
                            onChange={(e) => setFormData({...formData, size: e.target.value})} 
                            className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 border-gray-300 transition-all" 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">{labels.capLabel}</label>
                        <input 
                            type="text" 
                            value={formData.weight_cap} 
                            onChange={(e) => setFormData({...formData, weight_cap: e.target.value})} 
                            className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 border-gray-300 transition-all" 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-sm font-medium mb-1.5 block text-teal-700">Stok Awal (Unit)</label>
                        <input 
                            type="number" 
                            value={formData.stock} 
                            onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                            className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 border-teal-200 transition-all font-semibold text-gray-900" 
                            required 
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Deskripsi / Dimensi</label>
                    <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 border-gray-300 transition-all" 
                        rows={2}
                    ></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                 <div className="form-control">
                    <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Kondisi Saat Ini</label>
                    <select 
                        value={formData.condition} 
                        onChange={(e) => setFormData({...formData, condition: e.target.value})} 
                        className="select select-bordered w-full bg-gray-50 focus:bg-white focus:border-teal-500 border-gray-300"
                    >
                        <option value="baik">Baik (Layak Pakai)</option>
                        <option value="rusak ringan">Rusak Ringan</option>
                        <option value="baru">Baru</option>
                    </select>
                </div>

                <div className="form-control">
                    <label className="label-text text-sm font-medium text-gray-600 mb-1.5 block">Foto Alat</label>
                    <div className="flex items-center gap-3">
                        <input 
                            type="file" 
                            className="file-input file-input-bordered file-input-sm w-full bg-white focus:border-teal-500 text-gray-500" 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                        />
                        {formData.image_url ? (
                            <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 flex-shrink-0">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onClose} 
                    disabled={isSubmitting} 
                    className="btn btn-ghost hover:bg-gray-100 text-gray-600 font-medium px-6"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="btn btn-primary bg-teal-500 hover:bg-teal-600 border-none text-white font-semibold px-8 shadow-md shadow-teal-100"
                >
                    {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Simpan Data"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddToolModal;