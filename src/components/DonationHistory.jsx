import React, { useEffect, useState } from "react";
import { getUserDonations } from "../services/userServices";
import { 
    Package, 
    Calendar, 
    Clock, 
    CheckCircle, 
    MapPin,
    Loader2,
    ClipboardCheck
} from "lucide-react";

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserDonations();
                setDonations(data);
            } catch (error) {
                console.error("Gagal ambil riwayat:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-teal-600" /> Riwayat Kebaikan Anda
            </h2>

            {donations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Belum ada donasi yang tercatat.</p>
                    <p className="text-sm text-gray-400">Yuk, mulai berdonasi sekarang!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {donations.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row"
                        >
                            <div className="sm:w-48 h-48 sm:h-auto bg-gray-100 shrink-0">
                                <img 
                                    src={item.image_url} 
                                    alt={item.tool_name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-5 flex flex-col justify-between w-full">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wide">
                                                {item.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 mt-1">{item.tool_name}</h3>
                                        </div>
                                        
                                        {item.status === "approved" ? (
                                            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-emerald-200">
                                                <CheckCircle className="w-3 h-3" /> Selesai
                                            </span>
                                        ) : item.status === "received" ? (
                                            <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-blue-200">
                                                <ClipboardCheck className="w-3 h-3" /> Dalam Proses QC
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-amber-200">
                                                <Clock className="w-3 h-3" /> Menunggu Review
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4 mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-teal-500" />
                                        Diajukan: <span className="font-medium text-gray-700">{formatDate(item.created_at)}</span>
                                    </div>
                                    
                                    {item.pickup_date && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                            Jemput: <span className="font-medium text-gray-700">{formatDate(item.pickup_date)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="ml-auto font-bold text-gray-400">
                                        QTY: <span className="text-gray-800 text-sm">{item.quantity} Unit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationHistory;