import React from "react";
import { CheckCircle, XCircle,  Package, ArrowRight } from "lucide-react";

const LoansTable = ({ loans, onUpdateStatus }) => {
  if (!loans || loans.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <p>Tidak ada permintaan pinjaman yang menunggu.</p>
      </div>
    );
  }

  const renderActions = (loan) => {
    switch (loan.status) {
      case "pending":
        return (
          <>
            <button
              onClick={() => onUpdateStatus(loan.id, "approved")}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <CheckCircle className="w-5 h-5" /> Setujui
            </button>
            <button
              onClick={() => onUpdateStatus(loan.id, "rejected")}
              className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <XCircle className="w-5 h-5" /> Tolak
            </button>
          </>
        );

      case "approved":
        return (
          <button
            onClick={() => onUpdateStatus(loan.id, "active")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Package className="w-5 h-5" /> Serahkan Barang (User Datang)
          </button>
        );

      case "active":
        return (
          <button
            onClick={() => onUpdateStatus(loan.id, "completed")}
            className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ArrowRight className="w-5 h-5" /> Terima Pengembalian (Selesai)
          </button>
        );

      default:
        return (
          <div className="w-full text-center py-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 font-medium text-sm">
            {loan.status === 'completed' ? 'Selesai' : 'Ditolak'}
          </div>
        );
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {loans.map((loan) => {
        const validId = loan.id || loan._id; 

        return (
          <div key={validId} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Data Peminjam</p>
                    <h4 className="font-bold text-gray-900">{loan.borrowerName}</h4>
                    <p className="text-sm text-gray-500">{loan.borrowerPhone}</p>
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Alat</p>
                    <h4 className="font-bold text-gray-900">{loan.toolName}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-bold">Qty: {loan.quantity}</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status Saat Ini</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                        loan.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        loan.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        loan.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                        {loan.status}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
               {renderActions(loan)}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default LoansTable;