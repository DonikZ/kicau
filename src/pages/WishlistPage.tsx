import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Heart, PiggyBank, TrendingUp, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface WishItem {
  id: string;
  name: string;
  price: number;
  saved: number;
  completed: boolean;
  category: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Laptop Baru', price: 15000000, saved: 4500000, completed: false, category: 'Elektronik' },
      { id: '2', name: 'Buku Kursus Python', price: 250000, saved: 250000, completed: true, category: 'Edukasi' }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Edukasi');

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: WishItem = {
      id: Date.now().toString(),
      name: newName,
      price: Number(newPrice),
      saved: 0,
      completed: false,
      category: newCategory
    };
    setItems([item, ...items]);
    setIsAdding(false);
    setNewName('');
    setNewPrice('');
  };

  const addSavings = (id: string, amount: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newSaved = Math.min(item.saved + amount, item.price);
        return { ...item, saved: newSaved, completed: newSaved >= item.price };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totalSaved = items.reduce((acc, curr) => acc + curr.saved, 0);
  const totalWanted = items.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white tracking-tight flex items-center gap-3">
            <Heart className="text-pink-500 fill-pink-500" /> Wishlist & Tabungan
          </h1>
          <p className="text-slate-500">Kelola impian masa depanmu secara terencana.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Target Baru
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Savings Overview */}
        <div className="bg-[#1E293B] p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-3">Saldo Tabungan Saat Ini</p>
              <h2 className="text-4xl font-black tracking-tight leading-none">Rp {totalSaved.toLocaleString()}</h2>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <PiggyBank className="w-10 h-10" />
            </div>
          </div>
          
          <div className="mt-12 space-y-4 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Target Progress</span>
              <span className="text-2xl font-black text-blue-400">{( (totalSaved / (totalWanted || 1)) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(totalSaved / (totalWanted || 1)) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-center shadow-sm">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="text-blue-600 dark:text-blue-400 w-6 h-6" />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Item Aktif</p>
              <p className="text-3xl font-black dark:text-white tracking-tight">{items.filter(i => !i.completed).length}</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-center shadow-sm">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="text-green-600 dark:text-green-400 w-6 h-6" />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Sudah Dicapai</p>
              <p className="text-3xl font-black dark:text-white tracking-tight">{items.filter(i => i.completed).length}</p>
           </div>
        </div>
      </div>

      {/* Item List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {items.map((item) => {
            const progress = (item.saved / item.price) * 100;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className={cn(
                  "bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border transition-all duration-300 relative group",
                  item.completed 
                    ? "border-green-200 dark:border-green-900/50 bg-green-50/20" 
                    : "border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{item.name}</h3>
                <p className="text-slate-400 text-sm mb-4">Rp {item.price.toLocaleString()}</p>

                <div className="space-y-4">
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn("h-full", progress >= 100 ? "bg-green-500" : "bg-blue-500")}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold dark:text-slate-400">{progress.toFixed(0)}% Selesai</span>
                    <span className="text-xs font-black dark:text-white">Rp {item.saved.toLocaleString()}</span>
                  </div>
                  
                  {item.completed ? (
                    <div className="flex items-center justify-center gap-2 text-green-500 font-bold py-2 bg-green-50 dark:bg-green-900/20 rounded-xl mt-4">
                      <CheckCircle2 className="w-5 h-5" /> Terbeli!
                    </div>
                  ) : (
                    <div className="flex gap-2">
                       <button 
                        onClick={() => addSavings(item.id, 50000)}
                        className="flex-1 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-all"
                       >
                         +50rb
                       </button>
                       <button 
                        onClick={() => addSavings(item.id, 100000)}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all"
                       >
                         +100rb
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold dark:text-white mb-6 text-center">Tambah Impian Baru</h2>
            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nama Barang</label>
                <input 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Mis: iPad Pro M4"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Harga (Rupiah)</label>
                <input 
                  required
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="15000000"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Kategori</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Hobi">Hobi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold"
                >
                  Batal
                </button>
                <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
