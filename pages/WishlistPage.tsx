import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Heart, PiggyBank, TrendingUp, ShoppingBag, CheckCircle2, ArrowUpRight, ArrowDownRight, Wallet, AlertCircle, X, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSearch } from '../context/SearchContext';

interface WishItem {
  id: string;
  name: string;
  price: number;
  saved: number;
  completed: boolean;
  category: string;
}

interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: number;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Laptop Baru', price: 15000000, saved: 4500000, completed: false, category: 'Elektronik' },
      { id: '2', name: 'Buku Kursus Python', price: 250000, saved: 250000, completed: true, category: 'Edukasi' }
    ];
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('wish_transactions');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'income', amount: 5000000, description: 'Uang Saku Bulanan', category: 'Keluarga', date: Date.now() - 3 * 24 * 3600 * 1000 },
      { id: '2', type: 'expense', amount: 150000, description: 'Beli Buku Pelajaran', category: 'Pendidikan', date: Date.now() - 2 * 24 * 3600 * 1000 },
      { id: '3', type: 'expense', amount: 50000, description: 'Makan Bento', category: 'Konsumsi', date: Date.now() - 24 * 3600 * 1000 }
    ];
  });

  const [activeTab, setActiveTab] = useState<'wishlist' | 'finance'>('wishlist');
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingTrans, setIsAddingTrans] = useState(false);
  const [insufficientBalanceError, setInsufficientBalanceError] = useState('');

  // Wishlist addition state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Edukasi');

  // Transaction addition state
  const [transType, setTransType] = useState<'income' | 'expense'>('income');
  const [transAmount, setTransAmount] = useState('');
  const [transDesc, setTransDesc] = useState('');
  const [transCategory, setTransCategory] = useState('Keluarga');

  const { searchQuery } = useSearch();

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) ||
           item.category.toLowerCase().includes(q);
  });

  const filteredTransactions = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.description.toLowerCase().includes(q) ||
           t.category.toLowerCase().includes(q);
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('wish_transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const transUnit: FinancialTransaction = {
      id: Date.now().toString(),
      type: transType,
      amount: Number(transAmount),
      description: transDesc,
      category: transCategory,
      date: Date.now()
    };
    setTransactions([transUnit, ...transactions]);
    setIsAddingTrans(false);
    setTransAmount('');
    setTransDesc('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const sisaSaldo = totalIncome - totalExpense;

  const addSavings = (id: string, amount: number) => {
    if (sisaSaldo < amount) {
      setInsufficientBalanceError(`Saldo tidak mencukupi untuk menabung Rp ${amount.toLocaleString()}. Harap catat pemasukan baru terlebih dahulu!`);
      setTimeout(() => setInsufficientBalanceError(''), 5000);
      return;
    }

    const matchedItem = items.find(item => item.id === id);
    if (!matchedItem) return;

    // Deduct from Saldo dengan mencatat auto-expense
    const newTrans: FinancialTransaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount: amount,
      description: `Menabung: ${matchedItem.name}`,
      category: 'Tabungan',
      date: Date.now()
    };
    setTransactions([newTrans, ...transactions]);

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
    <div className="max-w-5xl mx-auto space-y-8 font-[Poppins]">
      {/* Insufficent Balance Alert Toast */}
      <AnimatePresence>
        {insufficientBalanceError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-3xl text-sm font-bold border border-rose-200 dark:border-rose-900/40 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{insufficientBalanceError}</span>
            <button onClick={() => setInsufficientBalanceError('')} className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tight flex items-center gap-3">
            <Heart className="text-pink-500 fill-pink-500" /> Wishlist & Keuangan
          </h1>
          <p className="text-slate-500">Kelola impian masa depan dan keuangan belajar secara terencana.</p>
        </div>
        
        {activeTab === 'wishlist' ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Target Baru
          </button>
        ) : (
          <button 
            onClick={() => setIsAddingTrans(true)}
            className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Catat Transaksi
          </button>
        )}
      </div>

      {/* Modern Tab Selectors */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl max-w-md border border-slate-200/50 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={cn(
            "flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider",
            activeTab === 'wishlist'
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
          )}
        >
          <Heart className="w-4 h-4" />
          Celengan Target
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={cn(
            "flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider",
            activeTab === 'finance'
              ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
          )}
        >
          <Coins className="w-4 h-4" />
          Buku Arus Kas
        </button>
      </div>

      {/* Main Budget Status Row */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 grid sm:grid-cols-3 gap-6 shadow-sm">
        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl flex items-center gap-4 border border-blue-100/40 dark:border-blue-900/20">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/15">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none">Dompet Utama</p>
            <h4 className="text-lg font-black mt-1 dark:text-white">Rp {sisaSaldo.toLocaleString()}</h4>
          </div>
        </div>

        <div className="p-4 bg-pink-50/50 dark:bg-pink-900/10 rounded-2xl flex items-center gap-4 border border-pink-100/40 dark:border-pink-900/20">
          <div className="w-12 h-12 bg-pink-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/15">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none">Total Tabungan</p>
            <h4 className="text-lg font-black mt-1 dark:text-white">Rp {totalSaved.toLocaleString()}</h4>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl flex items-center gap-4 border border-emerald-100/40 dark:border-emerald-900/20">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/15">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none">Buku Arus Kas</p>
            <h4 className="text-lg font-black mt-1 text-emerald-600 dark:text-emerald-400">Rp {totalIncome.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      {/* Tab: Celengan / Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-8">
          {/* Progress Section */}
          <div className="bg-[#1E293B] p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-2">Total Tabungan Terkumpul</p>
                <h2 className="text-4xl font-extrabold tracking-tight">Rp {totalSaved.toLocaleString()}</h2>
                <p className="text-xs text-slate-400 mt-2">Ditinjau dari harga target total {items.length} impian belajarmu.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Target Progress</span>
                <span className="text-3xl font-black text-blue-400">{( (totalSaved / (totalWanted || 1)) * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-2 relative z-10">
              <div className="h-3 bg-slate-850 rounded-full overflow-hidden">
                 <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalSaved / (totalWanted || 1)) * 100}%` }}
                 />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const progress = (item.saved / item.price) * 100;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id}
                    className={cn(
                      "bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border transition-all duration-300 relative group flex flex-col justify-between min-h-[280px]",
                      item.completed 
                        ? "border-green-200 dark:border-green-900/50 bg-green-50/20" 
                        : "border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900"
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[10px] font-black uppercase tracking-wider">
                          {item.category}
                        </span>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 truncate">{item.name}</h3>
                      <p className="text-slate-400 text-sm font-semibold mb-6">Rp {item.price.toLocaleString()}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className={cn("h-full", progress >= 100 ? "bg-green-500" : "bg-blue-500")}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 dark:text-slate-400">{progress.toFixed(0)}% Selesai</span>
                        <span className="font-black dark:text-white">Rp {item.saved.toLocaleString()}</span>
                      </div>
                      
                      {item.completed ? (
                        <div className="flex items-center justify-center gap-2 text-green-500 font-extrabold py-3 bg-green-50 dark:bg-green-900/25 rounded-2xl mt-4">
                          <CheckCircle2 className="w-5 h-5" /> Terbeli!
                        </div>
                      ) : (
                        <div className="flex gap-2">
                           <button 
                            onClick={() => addSavings(item.id, 50000)}
                            className="flex-1 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer whitespace-nowrap"
                           >
                             +50rb
                           </button>
                           <button 
                            onClick={() => addSavings(item.id, 250000)}
                            className="flex-1 py-3 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-2xl text-xs font-bold hover:bg-blue-200 transition-all cursor-pointer whitespace-nowrap"
                           >
                             +250rb
                           </button>
                           <button 
                            onClick={() => addSavings(item.id, 1000000)}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer whitespace-nowrap"
                           >
                             +1M
                           </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-400">
                Belum ada wishlist atau celengan yang sesuai pencarian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Buku Arus Kas Keuangan (Pemasukan & Pengeluaran) */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-xl font-extrabold dark:text-white">Aliran Arus Kas</h3>
                <p className="text-xs text-slate-400 mt-1">Lacak pencatatan masuk dan keluar dari uang saku Anda.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="pb-3 text-left">Tanggal</th>
                    <th className="pb-3 text-left">Deskripsi</th>
                    <th className="pb-3 text-left">Kategori</th>
                    <th className="pb-3 text-right">Jumlah</th>
                    <th className="pb-3 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                      <td className="py-4 text-xs font-semibold text-slate-400">
                        {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 font-bold max-w-xs truncate">{t.description}</td>
                      <td className="py-4 text-xs">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg font-black uppercase tracking-wider",
                          t.type === 'income' 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
                          t.category === 'Tabungan' && "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                        )}>
                          {t.category}
                        </span>
                      </td>
                      <td className={cn("py-4 text-right font-black", t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                        {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString()}
                      </td>
                      <td className="py-4 text-center">
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 text-slate-300 hover:text-red-500 rounded-lg dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-slate-450 dark:text-slate-500 text-xs font-bold">
                        Belum ada mutasi keuangan. Klik "Catat Transaksi" untuk memasukkan data baru!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Impian (Wishlist Target) */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-150 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black dark:text-white">Tambah Impian Baru</h2>
              <button onClick={() => setIsAdding(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nama Barang / Belajar</label>
                <input 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Mis: iPad Pro M4 atau Kursus TOEFL"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Estimasi Harga (Rupiah)</label>
                <input 
                  required
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Estimasi Anggaran"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Kategori</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Hobi">Hobi</option>
                  <option value="Kebutuhan">Kebutuhan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-350 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 cursor-pointer">
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Tambah Transaksi Keuangan (Income & Expense) */}
      {isAddingTrans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-150 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black dark:text-white">Catat Arus Kas</h2>
              <button onClick={() => setIsAddingTrans(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={addTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setTransType('income'); setTransCategory('Keluarga'); }}
                    className={cn(
                      "py-2.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider",
                      transType === 'income' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <ArrowUpRight className="w-4 h-4" /> Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTransType('expense'); setTransCategory('Konsumsi'); }}
                    className={cn(
                      "py-2.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider",
                      transType === 'expense' ? "bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <ArrowDownRight className="w-4 h-4" /> Keluar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Jumlah Uang (Rupiah)</label>
                <input 
                  required
                  type="number"
                  value={transAmount}
                  onChange={(e) => setTransAmount(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Mis: 100000"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Keterangan / Deskripsi</label>
                <input 
                  required
                  value={transDesc}
                  onChange={(e) => setTransDesc(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Mis: Kiriman orang tua, Jajan bulanan, Beli kopi"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Kategori</label>
                {transType === 'income' ? (
                  <select 
                    value={transCategory}
                    onChange={(e) => setTransCategory(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Keluarga">Keluarga (Uang Saku)</option>
                    <option value="Beasiswa">Beasiswa</option>
                    <option value="Gaji / Part-time">Gaji / Part-time</option>
                    <option value="Hadiah">Hadiah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                ) : (
                  <select 
                    value={transCategory}
                    onChange={(e) => setTransCategory(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Konsumsi">Bahan Makanan / Jajan</option>
                    <option value="Pendidikan">Peralatan Kuliah / Buku</option>
                    <option value="Transportasi">Bensin / Ongkos</option>
                    <option value="Kebutuhan">Kos / Kuota Internet</option>
                    <option value="Hiburan">Main / Langganan Film</option>
                    <option value="Tabungan">Tabungan Mandiri</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddingTrans(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-350 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button className="flex-1 py-4 bg-emerald-650 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 cursor-pointer">
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
