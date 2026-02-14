import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { getNewsById } from "../services/userServices";

export default function NewsDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Berita Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Artikel yang Anda cari mungkin telah dihapus atau URL salah.</p>
        <button onClick={() => navigate("/")} className="btn bg-teal-600 hover:bg-teal-700 border-none text-white rounded-full px-6">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const formattedDate = new Date(news.created_at || news.CreatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-medium group"
            >
                <div className="p-1.5 rounded-full group-hover:bg-teal-50 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> 
                </div>
                Kembali
            </button>
            <Link to="/" className="font-bold text-lg text-teal-600 tracking-tight">MedisLink</Link>
        </div>
      </nav>

      <main className="pt-28 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <article className="max-w-3xl mx-auto">
            
            <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-5 border border-teal-100">
                    Berita & Artikel
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    {news.title || news.Title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-gray-500 border-y border-gray-100 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">Admin MedisLink</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-teal-500" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 aspect-video">
                <img 
                    src={news.image_url || news.ImageURL || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80"} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.content || news.Content}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm italic">
                    Semoga informasi ini bermanfaat.
                </p>
                <button className="btn btn-ghost btn-sm gap-2 text-gray-500 hover:text-teal-600 rounded-full">
                    <Share2 className="w-4 h-4" /> Bagikan Artikel
                </button>
            </div>

        </article>
      </main>

      <section className="max-w-3xl mx-auto px-4 mt-16 mb-10">
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 text-center border border-teal-100 shadow-sm">
            <h3 className="text-xl font-bold text-teal-900 mb-2">Tertarik dengan layanan kami?</h3>
            <p className="text-teal-700/80 mb-6">Kami menyediakan peminjaman alat medis gratis untuk yang membutuhkan.</p>
            <div className="flex justify-center gap-4">
                <Link to="/alat" className="btn bg-teal-600 hover:bg-teal-700 border-none text-white rounded-full px-6">
                    Lihat Alat
                </Link>
                <Link to="/" className="btn btn-outline border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 rounded-full px-6">
                    Beranda
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
}