
'use client';

import { useState } from 'react';
import Link from 'next/link';

const books = [
  { id: 'bukuA', name: 'Kalkulus 1', price: 50000 },
  { id: 'bukuB', name: 'Kalkulus 3', price: 50000 },
  { id: 'bukuC', name: 'ALE', price: 50000 },
  { id: 'bukuD', name: 'PDB', price: 50000 },
  { id: 'bukuE', name: 'LDH', price: 50000 },
  { id: 'bukuF', name: 'ALPROG', price: 50000 },
  { id: 'bukuG', name: 'Matdas', price: 50000 }
];

const formatRupiah = (amount: number): string => {
  return 'Rp' + amount.toLocaleString('id-ID');
};

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    quantities: {} as Record<string, number>,
    proofFile: null as File | null
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
    if (file) {
      setFormData(prev => ({ ...prev, proofFile: file }));
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbyQR4SAOM-GGQYjcjJ7mfahvsrBQeHH9VfMEfGAI07gLR6zLpgRez31QM9hwVyvd0M/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          bukuA: (formData.quantities.bookA || 0).toString(),
          bukuB: (formData.quantities.bookB || 0).toString(),
          bukuC: (formData.quantities.bookC || 0).toString(),
          bukuD: (formData.quantities.bookD || 0).toString(),
          bukuE: (formData.quantities.bookE || 0).toString(),
          bukuF: (formData.quantities.bookF || 0).toString(),
          bukuG: (formData.quantities.bookG || 0).toString(),
          totalPrice: calculateTotal().toString(),
          proofFile: base64File,
          fileName: formData.proofFile!.name
        })
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          address: '',
          quantities: {},
          proofFile: null
        });
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
            href="https://feynmanproject.vercel.app" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </Link>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Pesan Buku Diktat Anda
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Selesaikan pemesanan untuk koleksi buku Feynman Project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Personal Information */}
          <section className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Informasi Pembeli
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Masukkan Nama Lengkap Anda"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Anda</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Masukkan alamat email anda"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Alamat Pengantaran</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                rows={3}
                placeholder="Masukkan Alamat Pengantaran Anda"
                maxLength={500}
              />
              {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
            </div>
          </section>

          {/* Book Selection */}
          <section className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Pemilihan Buku Diktat
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{book.name}</h3>
                    <span className="text-purple-400 font-bold">{formatRupiah(book.price)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(book.id, (formData.quantities[book.id] || 0) - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    
                    <input
                      type="number"
                      value={formData.quantities[book.id] || 0}
                      onChange={(e) => handleQuantityChange(book.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center focus:border-purple-500 focus:outline-none"
                      min="0"
                    />
                    
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(book.id, (formData.quantities[book.id] || 0) + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                  
                  {formData.quantities[book.id] > 0 && (
                    <div className="mt-3 text-sm text-gray-300">
                      Subtotal: {formatRupiah(book.price * formData.quantities[book.id])}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {errors.books && <p className="text-red-400 text-sm mt-4">{errors.books}</p>}
          </section>

          {/* Order Summary */}
          {getTotalBooks() > 0 && (
            <section className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                {books.map((book) => {
                  const quantity = formData.quantities[book.id] || 0;
                  if (quantity === 0) return null;
                  
                  return (
                    <div key={book.id} className="flex justify-between items-center">
                      <span>{book.name} × {quantity}</span>
                      <span className="font-semibold">{formatRupiah(book.price * quantity)}</span>
                    </div>
                  );
                })}
                
                <div className="border-t border-gray-700 pt-3 mt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-purple-400">{formatRupiah(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Proof of Payment */}
          <section className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Pembuktian Pembayaran
            </h2>
            
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
              <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-300 mb-4">Upload bukti pembayaran anda (Gambar or PDF)</p>
              
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="proof-upload"
              />
              
              <label
                htmlFor="proof-upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-folder-open-line mr-2"></i>
                Pilih File
              </label>
              
              {formData.proofFile && (
                <p className="mt-4 text-green-400">
                  <i className="ri-file-check-line mr-2"></i>
                  {formData.proofFile.name}
                </p>
              )}
            </div>
            
            {errors.proof && <p className="text-red-400 text-sm mt-4">{errors.proof}</p>}
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
              <p className="text-gray-300 mt-2">Anda akan menerima Email dari kami secepatnya.</p>
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
