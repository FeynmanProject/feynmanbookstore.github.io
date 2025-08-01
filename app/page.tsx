
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 25 particles with random positions and velocities
    const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 100) % 100,
        y: (particle.y + particle.vy + 100) % 100,
      })));
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-animation"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Light Sweep Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="light-sweep"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-20 min-h-screen">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Pembelian Buku Diktat<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Feynman Project
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-16 max-w-2xl mx-auto">
            Dapatkan buku diktat edisi cetak kami melalui sistem pemesanan <span className="text-white font-semibold">Resmi</span>
          </p>

          {/* Book Visual Element */}
          <div className="relative w-96 h-96 mx-auto mb-16">
            <div className="book-container">
              <img 
                src="https://static.readdy.ai/image/6277bd6514f36d96e4600ed908bd6bca/55e391ace1e4eb02762f82216b8c8de8.png"
                alt="Book Tech Visualization"
                className="w-full h-full object-contain opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl blur-xl"></div>
            </div>

            {/* Floating smaller books */}
            <div className="absolute -left-16 top-20 w-12 h-8 book-float" style={{ animationDelay: '0s' }}>
              <div className="w-full h-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded backdrop-blur-sm"></div>
            </div>
            <div className="absolute -right-12 top-32 w-8 h-6 book-float" style={{ animationDelay: '2s' }}>
              <div className="w-full h-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded backdrop-blur-sm"></div>
            </div>
            <div className="absolute left-20 -bottom-8 w-10 h-7 book-float" style={{ animationDelay: '1s' }}>
              <div className="w-full h-full bg-gradient-to-br from-pink-400/30 to-blue-400/30 rounded backdrop-blur-sm"></div>
            </div>
            <div className="absolute right-32 -top-4 w-6 h-4 book-float" style={{ animationDelay: '3s' }}>
              <div className="w-full h-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded backdrop-blur-sm"></div>
            </div>
            <div className="absolute -left-8 bottom-16 w-14 h-10 book-float" style={{ animationDelay: '1.5s' }}>
              <div className="w-full h-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded backdrop-blur-sm"></div>
            </div>
            <div className="absolute right-12 bottom-24 w-7 h-5 book-float" style={{ animationDelay: '2.5s' }}>
              <div className="w-full h-full bg-gradient-to-br from-pink-400/30 to-blue-400/30 rounded backdrop-blur-sm"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/order"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold text-lg text-white text-center hover:scale-105 shadow-lg hover:shadow-purple-500/25 whitespace-nowrap"
            >
              <i className="ri-shopping-cart-line mr-2"></i>
              Beli Sekarang
            </Link>

            <Link 
              href="https://feynmanproject.vercel.app"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all duration-300 font-semibold text-lg text-white text-center hover:scale-105 shadow-lg border border-white/20 whitespace-nowrap"
            >
              <i className="ri-external-link-line mr-2"></i>
              Kunjungi Situs Utama
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-animation {
          background: linear-gradient(-45deg, #0f0f23, #1a0933, #0f172a, #1e1b4b);
          background-size: 400% 400%;
          animation: gradientShift 20s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .light-sweep {
          position: absolute;
          top: 0;
          left: -30%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(147, 51, 234, 0.1) 50%, 
            transparent 100%
          );
          animation: lightSweep 12s linear infinite;
          transform: skewX(-20deg);
        }

        @keyframes lightSweep {
          0% {
            left: -30%;
          }
          100% {
            left: 120%;
          }
        }

        .book-container {
          position: relative;
          animation: bookFloat 6s ease-in-out infinite;
          filter: drop-shadow(0 20px 40px rgba(147, 51, 234, 0.3));
        }

        @keyframes bookFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        .book-float {
          animation: floatAround 8s ease-in-out infinite;
        }

        @keyframes floatAround {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) translateX(10px) rotate(3deg);
          }
          66% {
            transform: translateY(10px) translateX(-5px) rotate(-2deg);
          }
        }
      `}</style>
    </div>
  );
}
