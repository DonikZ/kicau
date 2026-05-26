import React, { useState } from 'react';
import { Search, Rocket, Star, Shield, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { login } = useUser();
  const { theme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      name: name || 'Student User',
      email: email || 'student@example.com',
      school: 'Universitas Indonesia',
      bio: 'Ready to learn and grow!'
    });
  };

  const features = [
    { icon: <Star className="text-yellow-500" />, title: 'Smart Notes', desc: 'Powerful markdown support for your academic success.' },
    { icon: <Rocket className="text-purple-500" />, title: 'Goal Tracker', desc: 'Track your deadlines and savings in one place.' },
    { icon: <Shield className="text-green-500" />, title: 'Secure & Private', desc: 'Your data stays with you, local and safe.' },
  ];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen font-sans">
      {/* Navbar overlay */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold dark:text-white tracking-tight">EduDash</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2 rounded-full font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all"
          >
            Masuk
          </button>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Daftar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 container mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            Tingkatkan <span className="text-blue-600">Produktivitas</span> <br /> Belajarmu Disini.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Satu tempat untuk semua kebutuhan akademikmu. Dari catatan markdown hingga track record tabungan, semua ada di EduDash.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari fitur belajar..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all dark:text-white"
              />
            </div>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="whitespace-nowrap px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Mulai <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {features.map((f, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + i * 0.1 }}
               className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-left hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group"
            >
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Login Modal (Simplified) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Selamat Datang</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Masuk untuk mengakses dashboard pribadimu.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Budi Sudarsono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="budi@example.com"
                />
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                Mulai Sekarang
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
