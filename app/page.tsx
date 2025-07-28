
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center text-white">
      <div className="text-center max-w-4xl px-6">
        <h1 className="text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Feynman Project
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Akses koleksi buku diktat kami melalui sistem pemesanan khusus
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/order"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg shadow-lg hover:shadow-purple-500/25 whitespace-nowrap"
          >
            <i className="ri-shopping-cart-line mr-2"></i>
            Beli Sekarang
          </Link>
          
          <a
            href="https://feynmanproject.vercel.app"
            className="inline-flex items-center px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all font-semibold text-lg whitespace-nowrap"
          >
            <i className="ri-external-link-line mr-2"></i>
            Kunjungi Situs Utama
          </a>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-gray-400 text-sm">
          Secure ordering system powered by modern technology
        </p>
      </div>
    </div>
  );
}
