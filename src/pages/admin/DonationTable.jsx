import React, { useState } from "react";
import { 
    CheckCircle, 
    Clock, 
    X, 
    MapPin, 
    User, 
    Eye, 
    Box, 
    Package, 
    Calendar,
    Phone,
    AlertCircle,
    Truck,           
    ClipboardCheck,  
    Shield           
} from "lucide-react";

const CONDITIONS = ["Sangat Baik (Seperti Baru)", "Baik (Layak Pakai)", "Cukup (Perlu Perbaikan Kecil)", "Rusak Ringan"];

const DonationsTable = ({ donations, onReceive, onApprove }) => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [adminCondition, setAdminCondition] = useState(CONDITIONS[1]);

  const handleReviewClick = (donation) => {
      setSelectedDonation(donation);
      setAdminCondition(CONDITIONS[1]); 
  };

  const handleCloseModal = () => setSelectedDonation(null);
  
  const handleReceiveItem = async () => {
    if (selectedDonation) {
        if(window.confirm("Konfirmasi barang fisik sudah sampai di tangan Admin? Status user akan berubah.")) {
            if (onReceive) {
                await onReceive(selectedDonation.id || selectedDonation._id);
            }
            handleCloseModal();
        }
    }
  };

  const handleConfirmApproval = async () => {
    if (selectedDonation) {
        if (onApprove) {
            await onApprove(selectedDonation.id || selectedDonation._id, adminCondition);
        }
        handleCloseModal();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  };

  const renderStatusBadge = (status) => {
      if (status === "pending") return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Menunggu Review
          </span>
      );
      if (status === "received") return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
             <Truck className="w-3.5 h-3.5" /> Barang Diterima Admin
          </span>
      );
      return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
             <CheckCircle className="w-3.5 h-3.5" /> Selesai
          </span>
      );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Barang Donasi</th>
                <th className="px-6 py-4">Data Donatur</th>
                <th className="px-6 py-4 text-center">Jadwal & Waktu</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 bg-white">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center gap-2">
                        <Box className="w-10 h-10 text-gray-300" />
                        <p>Belum ada pengajuan donasi baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                donations.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-gray-50/60 transition-colors group">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                            <img src={item.image_url} alt="Foto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{item.tool_name}</div>
                          <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{item.category}</span>
                              <span className="text-xs text-gray-500">• {item.quantity} Unit</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {item.user_detail?.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-800">{item.user_detail?.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" /> {item.user_detail?.phone}
                            </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                        <div className="flex flex-col gap-2 items-center">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(item.created_at)}</span>
                            </div>
                            {item.pickup_date && (
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold">
                                    <Clock className="w-3 h-3" />
                                    <span>Jemput: {formatDate(item.pickup_date)}</span>
                                </div>
                            )}
                        </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                        {renderStatusBadge(item.status)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {item.status === "pending" ? (
                          <button onClick={() => handleReviewClick(item)} className="btn btn-sm bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 hover:border-teal-300 gap-2 shadow-sm font-medium transition-all p-2 rounded-full">
                              <Eye className="w-4 h-4" /> Review
                          </button>
                      ) : item.status === "received" ? (
                          <button onClick={() => handleReviewClick(item)} className="btn btn-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 gap-2 shadow-sm font-medium transition-all p-2 rounded-full">
                              <ClipboardCheck className="w-4 h-4" /> Proses QC
                          </button>
                      ) : (
                          <button disabled className="btn btn-sm btn-disabled bg-gray-50 border-none text-gray-400 gap-2 opacity-60">
                              <CheckCircle className="w-4 h-4" /> Selesai
                          </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {selectedDonation.status === "received" ? (
                                <><ClipboardCheck className="w-5 h-5 text-blue-600" /> Quality Control (QC)</>
                            ) : (
                                <><Box className="w-5 h-5 text-teal-600" /> Review Penjemputan</>
                            )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">ID: {selectedDonation.id || selectedDonation._id}</p>
                    </div>
                    <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-0 overflow-y-auto">
                    <div className="relative w-full h-56 bg-gray-100">
                        <img src={selectedDonation.image_url} alt="Detail" className="w-full h-full object-contain bg-gray-50"/>
                        <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 bg-black/70 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                                {selectedDonation.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nama Alat</label>
                                <p className="font-bold text-gray-900 text-lg leading-tight">{selectedDonation.tool_name}</p>
                            </div>
                            <div className="text-right">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Jumlah</label>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-200 shadow-sm float-right">
                                    <Package className="w-4 h-4 text-teal-600" />
                                    <span className="font-bold text-gray-900 text-lg">{selectedDonation.quantity} Unit</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Deskripsi User</label>
                            <p className="text-sm text-gray-700 italic">"{selectedDonation.description}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> Logistik
                                </h4>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 h-full space-y-2">
                                    <p className="text-sm text-gray-900 font-medium">{selectedDonation.pickup_address}</p>
                                    <div className="flex items-center gap-2 text-orange-800 font-bold text-sm border-t border-orange-200 pt-2 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        {selectedDonation.pickup_date ? formatDate(selectedDonation.pickup_date) : "-"}
                                    </div>
                                </div>
                             </div>
                             <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" /> Donatur
                                </h4>
                                <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100 h-full">
                                    <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                                        {selectedDonation.user_detail?.name?.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-900 truncate">{selectedDonation.user_detail?.name}</p>
                                        <p className="text-xs text-indigo-600 truncate">{selectedDonation.user_detail?.phone}</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {(selectedDonation.status === "received" || selectedDonation.status === "pending") && (
                            <div className="flex items-center gap-4 my-8">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Area Kerja Admin
                                </span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>
                        )}
                        
                        {selectedDonation.status === "received" && (
                            <div className="bg-teal-50 p-5 rounded-xl border border-teal-100 ring-1 ring-teal-200/50 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
                                <h4 className="text-sm font-bold text-teal-800 mb-4 flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-teal-600" /> 
                                    Formulir Quality Control (QC)
                                </h4>
                                
                                <div className="form-control w-full">
                                    <label className="label-text text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wide">
                                        Hasil Cek Fisik Barang:
                                    </label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-4 py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium text-gray-800 appearance-none shadow-sm cursor-pointer"
                                            value={adminCondition}
                                            onChange={(e) => setAdminCondition(e.target.value)}
                                        >
                                            {CONDITIONS.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-teal-600">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2 items-start bg-teal-100/50 p-3 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-teal-700 leading-snug">
                                            <strong>Catatan Sistem:</strong> Barang akan masuk inventaris dengan kondisi di atas. Jika stok dengan kondisi yang sama sudah ada, jumlah akan ditambahkan. Jika belum, item baru akan dibuat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedDonation.status === "pending" && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-800">Menunggu Kedatangan Barang</h4>
                                    <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                                        Pastikan barang fisik sudah diterima dari donatur sebelum melanjutkan ke tahap Quality Control (QC). <br/>
                                        Klik tombol <strong>"Terima Barang"</strong> di bawah jika barang sudah sampai.
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                    <button 
                        onClick={handleCloseModal} 
                        className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                        Batal
                    </button>

                    {selectedDonation.status === "pending" ? (
                        <button 
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 text-sm"
                            onClick={handleReceiveItem} 
                        >
                            <Truck className="w-4 h-4" /> 
                            Terima Barang (Fisik)
                        </button>
                    ) : (
                        <button 
                            onClick={handleConfirmApproval} 
                            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-200 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" /> 
                            Validasi QC & Masuk Stok
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default DonationsTable;