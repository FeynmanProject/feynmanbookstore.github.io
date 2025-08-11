
'use client';

import { useState } from 'react';
import Link from 'next/link';

const books = [
  { id: 'bukuA', name: 'Kalkulus 1 (Jilid 1)', price: 39500 },
  { id: 'bukuB', name: 'Kalkulus 3 (SEMESTER 3)', price: 60000 },
  { id: 'bukuC', name: 'ALE (SEMESTER 1)', price: 32000 },
  { id: 'bukuD', name: 'PDB (Jilid 1)', price: 45000 },
  { id: 'bukuE', name: 'LDH (SEMESTER 1)', price: 45000 },
  { id: 'bukuF', name: 'ALPROG (SEMESTER 1)', price: 25000 },
  { id: 'bukuG', name: 'Matdas (SEMESTER 1)', price: 35000 },

  // Tambahan 13 buku
  { id: 'bukuH',  name: 'Kalkulus 1 (Jilid 2)', price: 39500 },
  { id: 'bukuI',  name: 'PDB (Jilid 2)', price: 45000 },
  { id: 'bukuJ',  name: 'Pack Maba Matek', price: 169000 },
  { id: 'bukuK',  name: 'Bundle PDB (Jilid 1 + 2)', price: 80000 },
  { id: 'bukuL',  name: 'Bundle Kalk 3 + PDB', price: 130000 },
  { id: 'bukuM',  name: 'Belum Ada', price: 100 },
  { id: 'bukuN',  name: 'Belum Ada', price: 100 },
  { id: 'bukuO',  name: 'Belum Ada', price: 100 },
  { id: 'bukuP',  name: 'Belum Ada', price: 100 },
  { id: 'bukuQ',  name: 'Belum Ada', price: 100 },
  { id: 'bukuR',  name: 'Belum Ada', price: 100 },
  { id: 'bukuS',  name: 'Belum Ada', price: 100 },
  { id: 'bukuT',  name: 'Belum Ada', price: 100 }
];

const SOURCES = ['Sosial media','Website','Teman','Dosen/asdos','Poster kampus','Lainnya'];

const formatRupiah = (amount: number): string => {
  return 'Rp' + amount.toLocaleString('id-ID');
};

export default function OrderPage() {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', address: '',
    quantities: {} as Record<string, number>,
    proofFile: null as File | null,
    source: '',          // ← baru
    sourceOther: ''      // ← baru
  });


  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleQuantityChange = (bookId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [bookId]: Math.max(0, quantity)
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFormData(prev => ({ ...prev, proofFile: file }));

    // Tampilkan preview hanya untuk file gambar
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      // revoke url lama agar tidak leak
      setPreviewSrc(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {

      // jika PDF atau non-image, sembunyikan preview
      setPreviewSrc(null);
    }
  };
    

  const calculateTotal = () => {
    return books.reduce((total, book) => {
      const quantity = formData.quantities[book.id] || 0;
      return total + (book.price * quantity);
    }, 0);
  };

  const getTotalBooks = () => {
    return Object.values(formData.quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nama Diperlukan';
    if (!formData.email.trim()) newErrors.email = 'Email Diperlukan';
    if (!formData.address.trim()) newErrors.address = 'Alamat Diperlukan';
    if (getTotalBooks() === 0) newErrors.books = 'Setidaknya Ada 1 Pembelian';
    if (!formData.proofFile) newErrors.proof = 'Bukti Pembayaran';

    // ✅ validasi sumber
    if (!formData.source) newErrors.source = 'Pilih sumber';
    if (formData.source === 'Lainnya' && !formData.sourceOther.trim()) {
      newErrors.sourceOther = 'Sebutkan sumbernya';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // 🔒 Batas ukuran file: max 150 KB
    if (formData.proofFile && formData.proofFile.size > 150000) {
      alert("Ukuran file terlalu besar. Maksimal 150 KB.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const base64File = await convertToBase64(formData.proofFile!);
      
      const orderData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        books: books.map(book => ({
          name: book.name,
          quantity: formData.quantities[book.id] || 0,
          price: book.price,
          subtotal: (formData.quantities[book.id] || 0) * book.price
        })).filter(book => book.quantity > 0),
        totalPrice: calculateTotal(),
        proofFile: base64File,
        fileName: formData.proofFile!.name
      };
      
const response = await fetch('/api/submit-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nama: formData.name,
    email: formData.email,
    alamat: formData.address,
    sumber: formData.source === 'Lainnya' ? formData.sourceOther : formData.source,
    bukuA: formData.quantities.bukuA || 0,
    bukuB: formData.quantities.bukuB || 0,
    bukuC: formData.quantities.bukuC || 0,
    bukuD: formData.quantities.bukuD || 0,
    bukuE: formData.quantities.bukuE || 0,
    bukuF: formData.quantities.bukuF || 0,
    bukuG: formData.quantities.bukuG || 0,

    // Tambahan 13 buku
    bukuH: formData.quantities.bukuH || 0,
    bukuI: formData.quantities.bukuI || 0,
    bukuJ: formData.quantities.bukuJ || 0,
    bukuK: formData.quantities.bukuK || 0,
    bukuL: formData.quantities.bukuL || 0,
    bukuM: formData.quantities.bukuM || 0,
    bukuN: formData.quantities.bukuN || 0,
    bukuO: formData.quantities.bukuO || 0,
    bukuP: formData.quantities.bukuP || 0,
    bukuQ: formData.quantities.bukuQ || 0,
    bukuR: formData.quantities.bukuR || 0,
    bukuS: formData.quantities.bukuS || 0,
    bukuT: formData.quantities.bukuT || 0,
    
    totalHarga: calculateTotal(),
    file: base64File,
    fileName: formData.proofFile!.name
  }),
});



      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          address: '',
          quantities: {},
          proofFile: null,
          source: '',
          sourceOther: ''
        });
        setErrors({}); // bersihkan error setelah sukses
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="https://feynmanproject.vercel.app/books/" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Book Section
          </Link>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Pesan Buku Diktat Anda (MASIH COMING SOON)
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Untuk Pengambilan Buku di Wilayah Universitas Indonesia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
      
{/* ================== Informasi Pembeli (refined) ================== */}
<section className="bg-gray-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
      Informasi Pembeli
    </h2>
    <span className="text-xs text-gray-500">*Wajib diisi</span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm text-gray-300 mb-2">Nama Lengkap*</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
        placeholder="Contoh: Abdul Wahhab"
        autoComplete="name"
      />
      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">Email*</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
        placeholder="email@ui.ac.id"
        autoComplete="email"
      />
      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
    </div>
  </div>

  <div className="mt-6">
    <label className="block text-sm text-gray-300 mb-2">Nomor WhatsApp*</label>
    <input
      type="tel"
      value={formData.address}
      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
      placeholder="0857XXXXXXXX"
      inputMode="numeric"
      autoComplete="tel"
    />
    <p className="text-xs text-gray-500 mt-2">
      Gunakan nomor aktif yang terhubung ke WhatsApp.
    </p>
    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
  </div>

  {/* Sumber informasi */}
  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Anda mengetahui buku ini dari mana?*
      </label>
      <select
        value={formData.source}
        onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
      >
        <option value="">Pilih salah satu</option>
        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {errors.source && <p className="text-red-400 text-sm mt-1">{errors.source}</p>}
    </div>

    {formData.source === 'Lainnya' && (
      <div>
        <label className="block text-sm text-gray-300 mb-2">Sebutkan sumbernya*</label>
        <input
          type="text"
          value={formData.sourceOther}
          onChange={(e) => setFormData(prev => ({ ...prev, sourceOther: e.target.value }))}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
          placeholder="Contoh: teman kelas, grup line, dsb."
        />
        {errors.sourceOther && <p className="text-red-400 text-sm mt-1">{errors.sourceOther}</p>}
      </div>
    )}
  </div>
</section>


          
{/* ===== Catalog + Summary (improved UI) ===== */}
<section className="bg-gray-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
    Pemilihan Buku Diktat
  </h2>

  {/* Grid: katalog (2 kolom) + summary (1 kolom) di desktop */}
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Katalog */}
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {books.map((book) => {
          const qty = formData.quantities[book.id] || 0;
          const subtotal = qty * book.price;

          return (
            <div
              key={book.id}
              className="group rounded-2xl border border-gray-800 bg-gray-800/40 hover:bg-gray-800/60 transition shadow-sm hover:shadow-purple-500/10"
            >
              {/* Header kartu */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug">
                    {book.name}
                  </h3>
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300">
                    {formatRupiah(book.price)}
                  </span>
                </div>
              </div>

              {/* Stepper kuantitas */}
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Jumlah</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(book.id, Math.max(0, qty - 1))
                      }
                      className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 grid place-items-center transition"
                      aria-label={`Kurangi ${book.name}`}
                    >
                      <i className="ri-subtract-line"></i>
                    </button>

                    <input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) =>
                        handleQuantityChange(
                          book.id,
                          Number.isNaN(parseInt(e.target.value))
                            ? 0
                            : parseInt(e.target.value)
                        )
                      }
                      className="w-14 text-center px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(book.id, qty + 1)}
                      className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 grid place-items-center transition"
                      aria-label={`Tambah ${book.name}`}
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>

                {/* Subtotal per kartu (muncul jika qty>0) */}
                {qty > 0 && (
                  <div className="mt-3 text-sm flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-semibold text-purple-300">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errors.books && (
        <p className="text-red-400 text-sm mt-4">{errors.books}</p>
      )}
    </div>

    {/* Ringkasan (sticky) */}
    <aside className="lg:sticky lg:top-6 h-max">
      <div className="rounded-2xl border border-gray-800 bg-gray-800/40 p-6">
        <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>

        <div className="space-y-2 max-h-[280px] overflow-auto pr-1">
          {books.map((book) => {
            const q = formData.quantities[book.id] || 0;
            if (q === 0) return null;
            return (
              <div key={book.id} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {book.name} <span className="text-gray-500">× {q}</span>
                </span>
                <span className="font-medium">
                  {formatRupiah(book.price * q)}
                </span>
              </div>
            );
          })}

          {/* kosong */}
          {getTotalBooks() === 0 && (
            <div className="text-sm text-gray-400">
              Belum ada item. Pilih buku di kiri.
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 mt-4 pt-4">
          <div className="flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-purple-400">
              {formatRupiah(calculateTotal())}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            *Harga sudah termasuk subsidi cetak internal.
          </p>
        </div>
      </div>
    </aside>
  </div>
</section>


{/* ================== Bukti Pembayaran (refined + preview) ================== */}
<section className="bg-gray-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
    Bukti Pembayaran
  </h2>

  <div className="rounded-xl border border-gray-800 bg-gray-800/40 p-4 md:p-5">
    <div className="text-sm text-gray-300">
      Transfer ke <span className="font-semibold">Bank Syariah Indonesia (BSI)</span><br />
      a.n. <span className="font-semibold">Abdul Wahhab</span> — No. Rek: <span className="font-mono">7305463242</span>
    </div>

    <div className="mt-4 border-2 border-dashed border-gray-700 rounded-xl p-6 md:p-8 grid md:grid-cols-[1fr,auto] gap-6 items-center">
      {/* Kiri: preview */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg bg-gray-900/60 border border-gray-700 overflow-hidden grid place-items-center">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Preview bukti pembayaran"
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="ri-image-line text-3xl text-gray-600" />
          )}
        </div>

        <div className="text-sm">
          <p className="text-gray-300">Unggah bukti pembayaran (gambar/PNG/JPG atau PDF).</p>
          <p className="text-xs text-gray-500 mt-1">Maksimal 150 KB.</p>

          {formData.proofFile && (
            <p className="mt-2 text-xs text-gray-400">
              <i className="ri-file-line mr-1"></i>
              {formData.proofFile.name} — {(formData.proofFile.size/1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </div>

      {/* Kanan: tombol */}
      <div className="flex md:flex-col gap-3">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="proof-upload"
        />
        <label
          htmlFor="proof-upload"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition cursor-pointer whitespace-nowrap"
        >
          <i className="ri-folder-open-line mr-2"></i>
          Pilih File
        </label>

        {formData.proofFile && (
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, proofFile: null }));
              if (previewSrc) {
                URL.revokeObjectURL(previewSrc);
                setPreviewSrc(null);
              }
            }}
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            <i className="ri-close-line mr-2"></i>
            Hapus
          </button>
        )}
      </div>
    </div>

    {errors.proof && <p className="text-red-400 text-sm mt-3">{errors.proof}</p>}
  </div>
</section>


          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-line animate-spin mr-2"></i>
                  Processing Order...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Submit Pemesanan Anda
                </span>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="text-center p-6 bg-green-900/20 border border-green-500/20 rounded-xl">
              <i className="ri-check-line text-4xl text-green-400 mb-2"></i>
              <p className="text-green-400 font-semibold">Order anda sudah diterima!</p>
              <p className="text-gray-300 mt-2">Anda akan menerima kabar di WhatsApp dari Kami Secepatnya.</p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-center p-6 bg-red-900/20 border border-red-500/20 rounded-xl">
              <i className="ri-error-warning-line text-4xl text-red-400 mb-2"></i>
              <p className="text-red-400 font-semibold">Error submitting order</p>
              <p className="text-gray-300 mt-2">Please try again or contact support.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
