import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { User, Mail, School, Book, Settings, LogOut, Camera, Shield, MessageSquare, Bell, X, Upload, Trash2, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const presetAvatars = [
  { name: 'Siswa Perempuan A', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Siswa Laki-laki A', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { name: 'Siswa Perempuan B', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { name: 'Siswa Laki-laki B', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Kreatif Perempuan', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Kreatif Laki-laki', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

const presetBanners = [
  { name: 'Meja Kerja & Belajar', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Perpustakaan Klasik', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Abstrak Geometris', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Buku & Laptop', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Modern Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Pemandangan Gunung', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80' },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isPickingAvatar, setIsPickingAvatar] = useState(false);
  const [isPickingBanner, setIsPickingBanner] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [bannerUrlInput, setBannerUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadBannerError, setUploadBannerError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
    bio: user?.bio || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Ukuran file maksimal 2MB untuk optimasi penyimpanan.');
        return;
      }
      setUploadError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser({ avatar: base64String });
        setIsPickingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadBannerError('Ukuran banner maksimal 2MB untuk optimasi penyimpanan.');
        return;
      }
      setUploadBannerError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser({ banner: base64String });
        setIsPickingBanner(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarUrlInput.trim()) {
      updateUser({ avatar: avatarUrlInput.trim() });
      setAvatarUrlInput('');
      setIsPickingAvatar(false);
    }
  };

  const handleBannerUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bannerUrlInput.trim()) {
      updateUser({ banner: bannerUrlInput.trim() });
      setBannerUrlInput('');
      setIsPickingBanner(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Cover Profile */}
      <div className="relative">
        <div 
          className="h-48 md:h-64 rounded-[2.5rem] shadow-lg overflow-hidden relative group/banner bg-gradient-to-r from-blue-600 to-indigo-700 bg-cover bg-center transition-all duration-300"
          style={user.banner ? { backgroundImage: `url(${user.banner})` } : undefined}
        >
          {!user.banner && (
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
          )}
          
          {/* Centered Trigger Area for Banner Modification */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            user.banner 
              ? "bg-slate-950/40 opacity-0 group-hover/banner:opacity-100 focus-within:opacity-100 md:opacity-0" 
              : "bg-slate-950/15 opacity-100"
          )}>
            <button 
              onClick={() => setIsPickingBanner(true)}
              className="py-3.5 px-6 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white text-sm font-extrabold rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 border border-slate-100 dark:border-slate-800 backdrop-blur-md font-[Poppins]"
            >
              <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Ganti Background Banner</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 px-8 relative z-10 font-[Poppins]">
           <div className="relative group">
              <div className="w-40 h-40 rounded-full border-[6px] border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center relative">
                {user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
              <button 
                onClick={() => setIsPickingAvatar(true)}
                className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-full border-4 border-white dark:border-slate-950 shadow-lg hover:scale-110 mb-[-0.25rem] mr-[-0.25rem] transition-all cursor-pointer"
              >
                 <Camera className="w-4 h-4" />
              </button>
           </div>
           
           <div className="flex-1 mb-4 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                 <School className="w-4 h-4 text-blue-500" /> {user.school || 'Belum diatur'}
              </p>
           </div>

           <div className="flex gap-3 mb-4">
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={cn(
                  "px-8 py-3 rounded-2xl font-bold transition-all shadow-lg text-sm",
                  isEditing ? "bg-green-500 text-white shadow-green-500/20" : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700"
                )}
              >
                {isEditing ? 'Simpan Profil' : 'Edit Profil'}
              </button>
              <button 
                onClick={logout}
                className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl hover:bg-red-200"
              >
                <LogOut className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
             <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
               <Shield className="text-blue-500 w-5 h-5" /> Informasi Dasar
             </h2>
             
             <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nama Lengkap</label>
                      {isEditing ? (
                        <input 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <p className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white font-medium">{user.name}</p>
                      )}
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2">Alamat Email</label>
                      {isEditing ? (
                        <input 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <p className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white font-medium">{user.email}</p>
                      )}
                   </div>
                </div>
                
                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase mb-2">Instansi / Sekolah</label>
                   {isEditing ? (
                      <input 
                        value={formData.school}
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <p className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white font-medium">{user.school}</p>
                    )}
                </div>

                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase mb-2">Biodata Singkat</label>
                   {isEditing ? (
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 outline-none h-32"
                      />
                    ) : (
                      <p className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white font-medium leading-relaxed italic">
                        "{user.bio || 'Belum ada bio yang ditambahkan.'}"
                      </p>
                    )}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
              <h2 className="text-xl font-bold dark:text-white mb-6">Menu Pengguna</h2>
              <ul className="space-y-2">
                 {[
                   { icon: <Bell className="w-4 h-4" />, label: 'Notifikasi' },
                   { icon: <Shield className="w-4 h-4" />, label: 'Keamanan' },
                   { icon: <MessageSquare className="w-4 h-4" />, label: 'Bantuan' },
                   { icon: <Settings className="w-4 h-4" />, label: 'Pengaturan Lanjut' },
                 ].map((item, i) => (
                   <li key={i}>
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 group">
                         <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                              {item.icon}
                            </span>
                            <span className="font-bold text-sm">{item.label}</span>
                         </div>
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500" />
                      </button>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Book className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">EduDash Premium</h3>
              <p className="text-blue-800/60 dark:text-blue-400 text-sm leading-relaxed mb-6">Nikmati fitur sinkronisasi cloud dan backup otomatis untuk catatanmu.</p>
              <button className="w-full py-4 bg-white dark:bg-blue-600 text-blue-600 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:scale-105 transition-all">Upgrade Sekarang</button>
           </div>
        </div>
      </div>

      {/* Modern Avatar Selector Modal */}
      <AnimatePresence>
        {isPickingAvatar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="text-blue-500 w-5 h-5" /> Ubah Foto Profil
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-[Poppins]">Pilih cara mengubah foto profil Anda.</p>
                </div>
                <button 
                  onClick={() => setIsPickingAvatar(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-950/40 font-[Poppins]">
                  {uploadError}
                </div>
              )}

              <div className="space-y-6">
                {/* 1. Upload Local File Option */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 font-[Poppins]">1. Unggah dari Perangkat</h4>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-all cursor-pointer group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Pilih File Gambar</span>
                    <span className="text-[10px] text-slate-400">Format Jpeg, Png, Webp. Maksimal 2MB.</span>
                  </button>
                </div>

                {/* 2. Preset Avatars Library */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 font-[Poppins]">2. Pilih dari Galeri Avatar</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {presetAvatars.map((preset, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          updateUser({ avatar: preset.url });
                          setIsPickingAvatar(false);
                        }}
                        className="p-1.5 rounded-2xl border-2 border-transparent hover:border-blue-500 bg-slate-100 dark:bg-slate-800/50 hover:bg-blue-50/10 transition-all overflow-hidden flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 text-center leading-tight truncate w-full">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Custom Image URL */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 font-[Poppins]">3. Masukkan URL Gambar</h4>
                  <form onSubmit={handleUrlSubmit} className="flex gap-2">
                    <input 
                      type="url" 
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="https://example.com/foto-saya.jpg"
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl text-sm border-2 border-transparent focus:border-blue-500 outline-none font-[Poppins]"
                    />
                    <button 
                      type="submit"
                      className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      Terapkan
                    </button>
                  </form>
                </div>

                {/* 4. Delete Option if avatar is active */}
                {user.avatar && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => {
                        updateUser({ avatar: undefined });
                        setIsPickingAvatar(false);
                      }}
                      className="w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-dashed border-red-200 dark:border-red-900/40 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus Foto Saya Sekarang
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Banner Selector Modal */}
      <AnimatePresence>
        {isPickingBanner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Image className="text-blue-500 w-5 h-5" /> Ubah Background Banner
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-[Poppins]">Pilih cara mengubah latar belakang profil Anda.</p>
                </div>
                <button 
                  onClick={() => setIsPickingBanner(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Error Banner */}
              {uploadBannerError && (
                <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-950/40 font-[Poppins]">
                  {uploadBannerError}
                </div>
              )}

              <div className="space-y-6">
                {/* 1. Unggah dari Perangkat */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 font-[Poppins]">1. Unggah dari Perangkat</h4>
                  <input 
                    type="file" 
                    ref={bannerFileInputRef} 
                    onChange={handleBannerFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="w-full py-4 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-all cursor-pointer group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Pilih File Banner</span>
                    <span className="text-[10px] text-slate-400">Format Jpeg, Png, Webp. Maksimal 2MB.</span>
                  </button>
                </div>

                {/* 2. Galeri Banner Preset */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 font-[Poppins]">2. Pilih dari Galeri Banner</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {presetBanners.map((preset, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          updateUser({ banner: preset.url });
                          setIsPickingBanner(false);
                        }}
                        className="p-1 rounded-2xl border-2 border-transparent hover:border-blue-500 bg-slate-100 dark:bg-slate-800/50 hover:bg-blue-50/10 transition-all overflow-hidden flex flex-col cursor-pointer"
                      >
                        <div className="w-full h-16 rounded-xl overflow-hidden mb-1.5">
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center leading-tight truncate w-full px-1 mb-1">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Masukkan URL Gambar */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 font-[Poppins]">3. Masukkan URL Gambar</h4>
                  <form onSubmit={handleBannerUrlSubmit} className="flex gap-2">
                    <input 
                      type="url" 
                      value={bannerUrlInput}
                      onChange={(e) => setBannerUrlInput(e.target.value)}
                      placeholder="https://example.com/banner-saya.jpg"
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl text-sm border-2 border-transparent focus:border-blue-500 outline-none font-[Poppins]"
                    />
                    <button 
                      type="submit"
                      className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      Terapkan
                    </button>
                  </form>
                </div>

                {/* 4. Delete/Reset Option */}
                {user.banner && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => {
                        updateUser({ banner: undefined });
                        setIsPickingBanner(false);
                      }}
                      className="w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-dashed border-red-200 dark:border-red-900/40 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Kembalikan ke Banner Default
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
