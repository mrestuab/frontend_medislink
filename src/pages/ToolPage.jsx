import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image, Ruler, Weight, Search } from "lucide-react";

import { getPublicTools, getCategories } from "../services/userServices";

export default function ToolPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toolsData, catData] = await Promise.all([
          getPublicTools(),
          getCategories()
        ]);
        setTools(toolsData);
        setCategories(catData);
      } catch (error) {
        console.error("Gagal load data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchCat = selectedCategory === "all" || tool.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      <nav className="navbar fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto w-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-teal-200 shadow-lg">M</div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">MedisLink</span>
          </Link>
          <Link to="/login" className="btn btn-primary btn-sm bg-teal-500 hover:bg-teal-600 border-none text-white font-semibold text-sm px-6 rounded-2xl shadow-md shadow-teal-100">
            Masuk
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Katalog Alat Medis</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Temukan alat bantu kesehatan yang Anda butuhkan dengan kualitas terbaik dan harga terjangkau.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-4">Kategori</h3>
                    <ul className="space-y-1">
                        <li>
                            <button 
                                onClick={() => setSelectedCategory('all')} 
                                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Semua Alat
                            </button>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat.id || cat.name}>
                                <button 
                                    onClick={() => setSelectedCategory(cat.name)} 
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-3">
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Cari nama alat" 
                        className="input w-full pl-10 bg-white focus:border-teal-500 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {loading ? (
                    <div className="text-center py-20 text-gray-400"><span className="loading loading-spinner loading-lg"></span></div>
                ) : filteredTools.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Alat tidak ditemukan.</p>
                        <button onClick={() => {setSearchTerm(""); setSelectedCategory("all")}} className="btn btn-link text-teal-600">Reset Filter</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool) => (
                            <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                <div className="relative h-52 w-full bg-white rounded-lg overflow-hidden mb-4 border border-gray-100 flex items-center justify-center p-4">
                                    {tool.image_url ? (
                                        <img 
                                            src={tool.image_url} 
                                            alt={tool.name} 
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <Image className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs font-medium">No Image</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-3 left-3 bg-gray-900/80 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm uppercase font-bold tracking-wider shadow-sm">
                                        {tool.category}
                                    </div>

                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm ${tool.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {tool.stock > 0 ? 'Tersedia' : 'Habis'}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors">
                                            {tool.name}
                                        </h3>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tool.type && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200 font-medium">
                                                    {tool.type}
                                                </span>
                                            )}
                                            {tool.size && (
                                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100 font-medium flex items-center gap-1">
                                                    <Ruler className="w-3 h-3" /> {tool.size}
                                                </span>
                                            )}
                                            {tool.weight_cap && (
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100 font-medium flex items-center gap-1">
                                                    <Weight className="w-3 h-3" /> Max {tool.weight_cap}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 pt-4 border-t border-gray-100">
                                        <button 
                                            onClick={() => navigate("/login")} 
                                            disabled={tool.stock === 0}
                                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                                                tool.stock > 0 
                                                ? 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-teal-200 hover:shadow-lg hover:-translate-y-0.5' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {tool.stock > 0 ? 'Login untuk Pinjam' : 'Stok Habis'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}