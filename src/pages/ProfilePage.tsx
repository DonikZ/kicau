import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, Mail, School, Book, Settings, LogOut, Camera, Shield, MessageSquare, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const { user, updateUser, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
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

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Cover Profile */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-lg overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 px-8 relative z-10">
           <div className="relative group">
              <div className="w-40 h-40 rounded-full border-[6px] border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-400" />}
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-full border-4 border-white dark:border-slate-950 shadow-lg hover:scale-110 mb-[-0.25rem] mr-[-0.25rem]">
                 <Camera className="w-4 h-4" />
              </button>
           </div>
           
           <div className="flex-1 mb-4 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                 <School className="w-4 h-4 text-blue-500" /> {user.school || 'Belum diatur'}
              </p>
           </div>

           <div className="flex gap-3 mb-4">
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={cn(
                  "px-8 py-3 rounded-2xl font-bold transition-all shadow-lg",
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
    </div>
  );
}
