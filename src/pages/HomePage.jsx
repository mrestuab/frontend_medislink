import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Calendar, User, ArrowRight } from "lucide-react"; 

import { getAds, getPublicNews } from "../services/userServices"; 

export default function HomePage() {
  const [ads, setAds] = useState([]);
  const [news, setNews] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsData, newsData] = await Promise.all([
            getAds(),
            getPublicNews()
        ]);

        if (adsData && adsData.length > 0) {
          setAds(adsData);
        }
        
        if (newsData && newsData.length > 0) {
            setNews(newsData.slice(0, 3));
        }

      } catch (error) {
        console.error("Gagal load data homepage", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % ads.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? ads.length - 1 : prev - 1));

  const displayAds = ads.length > 0 ? ads : [
    {
      id: "default",
      title: "Selamat Datang di MedisLink",
      description: "Platform peminjaman alat medis terpercaya untuk kebutuhan pemulihan keluarga Anda.",
      image_url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80",
      link: "/alat"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      <nav className="navbar fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 transition-all">
        <div className="max-w-7xl mx-auto w-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-teal-200 shadow-lg">
              M
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">MedisLink</span>
          </Link>
          <div className="flex gap-4">
             <Link
                to="/login"
                className="btn btn-primary btn-sm bg-teal-500 h-9 hover:bg-teal-600 border-none text-white font-semibold text-sm px-6 rounded-2xl shadow-md shadow-teal-100"
            >
                Masuk / Daftar
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto relative rounded-2xl overflow-hidden h-[500px] sm:h-[600px] shadow-2xl bg-gray-900 group">
            
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <span className="loading loading-spinner loading-lg text-teal-600"></span>
                </div>
            )}

            {displayAds.map((ad, index) => (
                <div 
                    key={ad.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10"></div>
                    <img 
                        src={ad.image_url || "https://via.placeholder.com/1200x600?text=MedisLink"} 
                        alt={ad.title} 
                        className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear transform scale-105 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
                        <span className="inline-block py-1 px-4 rounded-full bg-teal-500/90 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {ads.length > 0 ? "Featured Offer" : "Welcome"}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                            {ad.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-md leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            {ad.description}
                        </p>
                        
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                            <Link 
                                to={ad.link || "/alat"} 
                                className="btn btn-primary bg-teal-500 hover:bg-teal-600 border-none text-white font-bold px-10 py-3 h-auto rounded-full shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1 transition-all"
                            >
                                {ads.length > 0 ? "Cek Sekarang" : "Jelajahi Alat"}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {displayAds.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10 group-hover:opacity-100 opacity-0">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10 group-hover:opacity-100 opacity-0">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                        {displayAds.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-teal-400 w-8' : 'bg-white/30 w-2 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-gray-900">Mengapa Memilih MedisLink?</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Kami menyediakan solusi kesehatan yang terjangkau, transparan, dan mudah diakses
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Harga Terjangkau</h3>
              <p className="text-gray-600 leading-relaxed">Paket sewa yang fleksibel harian atau bulanan sesuai kebutuhan pemulihan Anda.</p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Kualitas Terjamin</h3>
              <p className="text-gray-600 leading-relaxed">Alat medis selalu disterilisasi dan dicek kondisinya sebelum diserahkan ke Anda.</p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Proses Cepat</h3>
              <p className="text-gray-600 leading-relaxed">Pesan online dalam hitungan menit, konfirmasi cepat dari admin kami.</p>
            </div>
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="py-20 px-6 bg-teal-50/50 border-t border-teal-100/50">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Berita & Artikel</h2>
                        <p className="text-gray-600 max-w-xl">
                            Informasi terbaru seputar kesehatan dan kegiatan sosial MedisLink.
                        </p>
                    </div>
                    <Link to="/news" className="hidden md:flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-colors">
                        Lihat Semua Berita <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <div key={item.id || item._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={item.image_url || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-teal-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                    Berita
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.author || "Admin"}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                    <Link to={`/news/${item.id || item._id}`}>{item.title}</Link>
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                    {item.content}
                                </p>
                                <Link to={`/news/${item.id || item._id}`} className="text-teal-600 text-sm font-bold hover:underline inline-flex items-center gap-1">
                                    Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/news" className="btn btn-outline border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white w-full">
                        Lihat Semua Berita
                    </Link>
                </div>
            </div>
        </section>
      )}

      <section className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-teal-600 skew-y-3 origin-bottom-right transform scale-110"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Mulai Perjalanan Pemulihan Anda</h2>
          <p className="text-teal-100 mb-10 text-lg max-w-2xl mx-auto">Jangan biarkan keterbatasan fisik menghalangi aktivitas. Kami siap membantu menyediakan alat bantu terbaik.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                to="/alat" 
                className="btn btn-lg bg-white text-teal-700 hover:bg-gray-100 border-none font-bold px-10 rounded-full shadow-xl"
            >
                Jelajahi Alat
            </Link>
            <Link
                to="/login"
                className="btn btn-lg btn-outline text-white border-white hover:bg-white/10 font-bold px-10 rounded-full"
            >
                Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
                    <span className="font-bold text-xl text-gray-800">MedisLink</span>
                </div>
                <div className="flex gap-8">
                    <Link to="#" className="text-gray-500 hover:text-teal-600 text-sm font-medium transition-colors">Tentang Kami</Link>
                    <Link to="#" className="text-gray-500 hover:text-teal-600 text-sm font-medium transition-colors">Kebijakan Privasi</Link>
                    <Link to="#" className="text-gray-500 hover:text-teal-600 text-sm font-medium transition-colors">Bantuan</Link>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">© 2025 MedisLink. Semua hak dilindungi.</p>
            </div>
        </div>
      </footer>
    </div>
  )
}