import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, Tag, Ruler, Weight, Clock, CheckCircle, XCircle, Calendar, Activity, Package } from 'lucide-react'; 

import { getPublicTools, getCategories, getMyLoans } from '../services/userServices';
import DonationPage from './DonationPage';
import DonationHistory from '../components/DonationHistory';

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('jelajahi');
  
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [toolsData, categoriesData, loansData] = await Promise.all([
          getPublicTools(),
          getCategories(),
          getMyLoans() 
        ]);
        
        setTools(toolsData);
        setCategories(categoriesData);
        setLoans(loansData);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category?.toLowerCase() === selectedCategory.toLowerCase());

  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("id-ID", {
          day: 'numeric', month: 'short', year: 'numeric'
      });
  };

  return (
    <>
      <div className="flex gap-8 border-b border-gray-200 mb-8 mt-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("jelajahi")}
          className={`pb-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "jelajahi" ? "border-teal-500 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Jelajahi Alat
        </button>

        <button
          onClick={() => setActiveTab("riwayat")}
          className={`pb-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "riwayat" ? "border-teal-500 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Riwayat Pinjaman
        </button>

        <button
          onClick={() => setActiveTab("donasi")}
          className={`pb-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "donasi" ? "border-teal-500 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Donasi Alat
        </button>

        <button
          onClick={() => setActiveTab("donationHistory")}
          className={`pb-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "donationHistory" ? "border-teal-500 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Riwayat Donasi
        </button>
      </div>

      {activeTab === 'jelajahi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {selectedCategory !== 'all' && (
                <div className="flex justify-between items-center bg-teal-50 px-4 py-2 rounded-lg border border-teal-100">
                    <span className="text-sm text-teal-800 capitalize">Kategori: <strong>{selectedCategory}</strong></span>
                    <button onClick={() => setSelectedCategory('all')} className="text-xs text-teal-600 hover:underline font-bold">Lihat Semua</button>
                </div>
            )}

            {isLoading ? (
              <div className="text-center py-12 text-gray-400"><span className="loading loading-spinner loading-md"></span> Memuat data...</div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border rounded-xl bg-white">Tidak ada alat di kategori ini.</div>
            ) : (
              filteredTools.map((tool) => (
                <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                    {tool.image_url ? (
                      <img src={tool.image_url} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400"><Image className="w-8 h-8 mb-2" /><span className="text-[10px]">No Image</span></div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm uppercase font-bold tracking-wider">{tool.category}</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {tool.type && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-medium">{tool.type}</span>}
                                    {tool.size && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium">Size: {tool.size}</span>}
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${tool.condition === 'baik' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{tool.condition}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-3 space-y-1">
                            {tool.weight_cap && <p className="flex items-center gap-1"><Weight className="w-3 h-3 text-teal-500" /> Beban: {tool.weight_cap}</p>}
                            {tool.dimensions && <p className="flex items-center gap-1"><Ruler className="w-3 h-3 text-teal-500" /> Dim: {tool.dimensions}</p>}
                        </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Ketersediaan</p>
                            <p className={`text-sm font-bold ${tool.stock > 0 ? 'text-teal-600' : 'text-red-500'}`}>{tool.stock > 0 ? `${tool.stock} Unit` : 'Habis'}</p>
                        </div>
                        <Link to={tool.stock > 0 ? `/alat/${tool.id}` : '#'} className={`btn btn-sm px-6 rounded-lg font-medium border-none ${tool.stock > 0 ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>{tool.stock > 0 ? 'Pilih Alat' : 'Habis'}</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Kategori</h3>
              {categories.length === 0 ? <p className="text-sm text-gray-400">Memuat...</p> : (
                  <ul className="space-y-1">
                    <li><button onClick={() => setSelectedCategory('all')} className={`block w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${selectedCategory === 'all' ? 'bg-teal-50 text-teal-700 font-bold border border-teal-100' : 'text-gray-600 hover:text-teal-700 hover:bg-gray-50'}`}>Semua Alat</button></li>
                    {categories.map((cat) => (
                      <li key={cat.id || cat.name}><button onClick={() => setSelectedCategory(cat.name)} className={`block w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium capitalize ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'bg-teal-50 text-teal-700 font-bold border border-teal-100' : 'text-gray-600 hover:text-teal-700 hover:bg-gray-50'}`}>{cat.name}</button></li>
                    ))}
                  </ul>
              )}
            </div>
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-6">
              <h4 className="font-bold text-teal-800 mb-2 text-sm">Butuh Bantuan?</h4>
              <p className="text-sm text-teal-700 leading-relaxed">Pilih alat medis yang Anda butuhkan, isi formulir, dan Admin kami akan memprosesnya.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="max-w-4xl mx-auto pb-10">
            {loans.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Belum Ada Riwayat</h3>
                    <p className="text-gray-500 mb-6">Anda belum pernah mengajukan peminjaman alat.</p>
                    <button onClick={() => setActiveTab('jelajahi')} className="btn btn-primary bg-teal-600 hover:bg-teal-700 text-white border-none btn-sm p-4">
                        Pinjam Sekarang
                    </button>
                </div>
            ) : (
                <div className="space-y-5">
                    {loans.map((loan) => (
                        <div key={loan.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start">
                            
                            <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                {loan.toolImage ? (
                                    <img src={loan.toolImage} alt={loan.toolName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Image className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{loan.toolName}</h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> 
                                                {formatDate(loan.loanDate)} - {formatDate(loan.returnDue)}
                                            </p>
                                            <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                Qty: {loan.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-shrink-0">
                                        {loan.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                                                <Clock className="w-3.5 h-3.5" /> Menunggu Konfirmasi
                                            </span>
                                        )}
                                        {loan.status === 'approved' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                <Package className="w-3.5 h-3.5" /> Siap Diambil di Klinik
                                            </span>
                                        )}
                                        {loan.status === 'active' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                                <CheckCircle className="w-3.5 h-3.5" /> Sedang Dipinjam
                                            </span>
                                        )}
                                        {loan.status === 'rejected' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                                                <XCircle className="w-3.5 h-3.5" /> Ditolak
                                            </span>
                                        )}
                                        {(loan.status === 'completed' || loan.status === 'selesai') && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                <CheckCircle className="w-3.5 h-3.5" /> Selesai
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-3 text-sm grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Kondisi Medis
                                        </p>
                                        <p className="text-gray-700 font-medium">{loan.medicalCondition}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Catatan</p>
                                        <p className="text-gray-600 italic truncate">"{loan.notes}"</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {activeTab === 'donasi' && (
        <DonationPage />
      )}

      {activeTab === 'donationHistory' && (
        <DonationHistory />
      )}
    </>
  );
};

export default UserDashboardPage;