import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  CheckSquare, 
  Layers, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Plus, 
  Award,
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  PiggyBank,
  Sparkles
} from 'lucide-react';
import { format, isAfter, isBefore, startOfToday, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { useSearch } from '../context/SearchContext';
import { cn } from '../lib/utils';

// State definitions to match other pages
interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: number;
}

interface Task {
  id: string;
  text: string;
  deadline: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Exam {
  id: string;
  title: string;
  date: string;
  room: string;
  time: string;
  subject: string;
}

interface Card {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

interface WishItem {
  id: string;
  name: string;
  price: number;
  saved: number;
  completed: boolean;
  category: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { searchQuery } = useSearch();

  // Load live data from other pages' localStorage keys
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [wishlist, setWishlist] = useState<WishItem[]>([]);

  // Random flashcard state for quick quiz
  const [randomCard, setRandomCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quick savings state
  const [quickSaveAmount, setQuickSaveAmount] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    // Load Notes
    const savedNotes = localStorage.getItem('notes');
    const initialNotes = savedNotes ? JSON.parse(savedNotes) : [];
    setNotes(initialNotes);

    // Load Tasks
    const savedTasks = localStorage.getItem('tasks');
    const initialTasks = savedTasks ? JSON.parse(savedTasks) : [];
    setTasks(initialTasks);

    // Load Exams
    const savedExams = localStorage.getItem('exams');
    const initialExams = savedExams ? JSON.parse(savedExams) : [];
    setExams(initialExams);

    // Load Flashcards
    const savedCards = localStorage.getItem('flashcards');
    const initialCards = savedCards ? JSON.parse(savedCards) : [];
    setCards(initialCards);
    if (initialCards.length > 0) {
      const randomIdx = Math.floor(Math.random() * initialCards.length);
      setRandomCard(initialCards[randomIdx]);
    }

    // Load Wishlist
    const savedWish = localStorage.getItem('wishlist');
    const initialWishlist = savedWish ? JSON.parse(savedWish) : [];
    setWishlist(initialWishlist);
  }, []);

  // Update notes helper
  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Add quick savings to first incomplete wishlist item
  const handleQuickSave = (itemId: string, e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(quickSaveAmount);
    if (isNaN(amount) || amount <= 0) return;

    const updatedWishlist = wishlist.map(item => {
      if (item.id === itemId) {
        const newSaved = Math.min(item.price, item.saved + amount);
        return {
          ...item,
          saved: newSaved,
          completed: newSaved >= item.price
        };
      }
      return item;
    });

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setQuickSaveAmount('');
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  // Get greeting based on hourly time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Date formatting for header
  const todayString = format(new Date(), 'EEEE, d MMMM yyyy');

  // Filter tasks that are uncompleted
  const pendingTasks = tasks.filter(t => !t.completed);
  const nextTasksToShow = pendingTasks.slice(0, 3);

  // Filter upcoming exams
  const sortedExams = [...exams]
    .filter(e => isAfter(new Date(e.date), startOfToday()) || format(new Date(e.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextExam = sortedExams[0];

  // Latest modified note
  const latestNote = [...notes].sort((a, b) => b.updatedAt - a.updatedAt)[0];

  // Active target savings item
  const activeWishItem = wishlist.find(item => !item.completed);

  // Format currency helpers
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  // Search logic
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTasks = tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredExams = exams.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  const hasSearch = searchQuery.trim() !== '';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Search overlay results if searching is active */}
      {hasSearch ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold dark:text-white mb-2">Hasil Pencarian</h1>
            <p className="text-slate-500">Hasil pencarian untuk "{searchQuery}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Notes Results */}
            <div className="card-polish p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 dark:text-white">
                <BookOpen className="text-blue-500 w-5 h-5" /> Catatan ({filteredNotes.length})
              </h2>
              {filteredNotes.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotes.slice(0, 3).map(n => (
                    <Link key={n.id} to="/notes" className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                      <p className="font-semibold text-sm dark:text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{n.category}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Tidak ada catatan yang cocok.</p>
              )}
            </div>

            {/* Tasks Results */}
            <div className="card-polish p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 dark:text-white">
                <CheckSquare className="text-green-500 w-5 h-5" /> Tugas ({filteredTasks.length})
              </h2>
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
                  {filteredTasks.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <button onClick={() => handleToggleTask(t.id)}>
                        {t.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-slate-300" />}
                      </button>
                      <span className={cn("text-sm font-semibold dark:text-slate-200", t.completed && "line-through text-slate-400")}>{t.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Tidak ada tugas yang cocok.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Welcome / Greetings */}
          <div className="relative overflow-hidden card-polish p-8 md:p-10 border-none bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-xl shadow-blue-500/10">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Dashboard Belajarmu
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                  {getGreeting()}, <span className="text-yellow-200">{user?.name || 'Mahasiswa'}</span>
                </h1>
                <p className="text-blue-100 font-medium text-sm md:text-base">
                  Hari yang hebat untuk mengejar mimpi akademikmu! Tetap semangat.
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm font-bold text-blue-200/80 uppercase tracking-widest">{todayString}</p>
                <div className="mt-2 bg-black/10 hover:bg-black/20 p-2.5 rounded-2xl flex items-center gap-2 max-w-sm transition-all border border-white/5 cursor-pointer" onClick={() => navigate('/profile')}>
                  <div className="w-8 h-8 bg-amber-400 text-white font-extrabold flex items-center justify-center rounded-xl shadow-md">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-none">{user?.name}</p>
                    <p className="text-[9px] text-blue-200 mt-0.5 tracking-wider uppercase font-semibold">{user?.school || 'Universitas Indonesia'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle floating patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/20 rounded-full blur-xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => navigate('/notes')}
              className="card-polish p-5 flex items-center gap-4 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white leading-none">{notes.length}</p>
                <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">Catatan Tersimpan</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => navigate('/tasks')}
              className="card-polish p-5 flex items-center gap-4 cursor-pointer hover:border-green-400 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-green-50 dark:bg-green-950/40 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white leading-none">{pendingTasks.length}</p>
                <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">Tugas Tersisa</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => navigate('/flashcards')}
              className="card-polish p-5 flex items-center gap-4 cursor-pointer hover:border-purple-400 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white leading-none">{cards.length}</p>
                <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">Smart Flashcard</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => navigate('/calendar')}
              className="card-polish p-5 flex items-center gap-4 cursor-pointer hover:border-red-400 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white leading-none">{sortedExams.length}</p>
                <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">Ujian Mendatang</p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Bento Box Grid layout */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* LEFT COLUMN: Tasks / Exams (Span 2) */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              
              {/* Tugas Terdekat Card */}
              <div className="card-polish p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold dark:text-white flex items-center gap-3">
                      <CheckSquare className="text-green-500 w-6 h-6 animate-pulse" /> Tugas Terdekat
                    </h2>
                    <p className="text-xs text-slate-400">Kerjakan tugas sebelum deadline berakhir.</p>
                  </div>
                  <Link to="/tasks" className="text-xs font-bold text-blue-600 flex items-center gap-1.5 hover:underline">
                    Semua Tugas <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {nextTasksToShow.length > 0 ? (
                  <div className="space-y-3">
                    {nextTasksToShow.map(task => {
                      const priorityColors = {
                        high: 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400',
                        medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
                        low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      };
                      return (
                        <motion.div 
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl gap-3"
                          layoutId={`task-${task.id}`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <button 
                              onClick={() => handleToggleTask(task.id)}
                              className="text-slate-400 hover:text-green-600 transition-colors"
                            >
                              <Circle className="w-5 h-5 flex-shrink-0" />
                            </button>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{task.text}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider", priorityColors[task.priority])}>
                                  {task.priority === 'high' ? 'Penting' : task.priority === 'medium' ? 'Sedang' : 'Santai'}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {task.deadline}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed dark:border-slate-800 flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-400 mb-2" />
                    <p className="text-slate-500 font-medium text-sm">Hebat! Tidak ada tugas terdekat.</p>
                  </div>
                )}
              </div>

              {/* Ujian Mendatang Card */}
              {nextExam ? (
                <div className="card-polish p-6 md:p-8 bg-rose-50/25 dark:bg-rose-950/10 border-rose-100 dark:border-rose-950/20 relative overflow-hidden">
                  <div className="flex justify-between items-start z-10 relative">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-3 h-3 animate-spin" /> Countdown Ujian
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-rose-900 dark:text-rose-100 tracking-tight leading-tight mb-1">
                          {nextExam.title}
                        </h3>
                        <p className="text-sm font-semibold text-rose-700/80 dark:text-rose-400">
                          Mata Kuliah: <span className="underline">{nextExam.subject}</span>
                        </p>
                      </div>
                      <div className="flex gap-4 flex-wrap text-sm text-rose-900/70 dark:text-rose-300">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-rose-500" /> {nextExam.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-rose-500" /> {nextExam.time} WIB</span>
                        <span className="flex items-center gap-1"><Award className="w-4 h-4 text-rose-500" /> {nextExam.room}</span>
                      </div>
                    </div>

                    <div className="bg-rose-500 text-white rounded-3xl p-5 font-black text-center shadow-lg shadow-rose-500/20">
                      <span className="block text-4xl leading-none">
                        {Math.max(0, differenceInDays(new Date(nextExam.date), startOfToday()))}
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest mt-1 block">Hari Lagi</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-polish p-6 md:p-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                      <Calendar className="text-red-500" /> Belum ada jadwal ujian terdekat
                    </h3>
                    <p className="text-xs text-slate-400">Tenang, belajarlah dengan teratur setiap hari.</p>
                  </div>
                  <button onClick={() => navigate('/calendar')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-white hover:bg-slate-200 hover:dark:bg-slate-700 rounded-xl font-bold text-xs">
                    Atur Jadwal
                  </button>
                </div>
              )}

              {/* Catatan Terbaru snippet */}
              <div className="card-polish p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold dark:text-white flex items-center gap-3">
                      <BookOpen className="text-blue-500 w-5 h-5" /> Catatan Terakhir
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Buka kembali catatan belajarmu yang lalu.</p>
                  </div>
                  <Link to="/notes" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                    Lihat Semua <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {latestNote ? (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-white">{latestNote.title}</h4>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">{latestNote.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed font-medium">
                      {latestNote.content.replace(/([#*`_\-]|\[.*\])/g, '') || 'Kertas kosong yang menanti goresan tintamu...'}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Dibuat: {format(new Date(latestNote.updatedAt), 'd MMM yyyy, HH:mm')}</span>
                      <button onClick={() => navigate('/notes')} className="text-blue-500 hover:underline flex items-center gap-1 font-bold">
                        Buka Catatan <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400">Belum ada catatan yang tersimpan.</p>
                    <button onClick={() => navigate('/notes')} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Tulis Catatan Pertamamu</button>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Savings / Quiz widget */}
            <div className="space-y-6 md:space-y-8">
              
              {/* Savings Goal Quick saving element */}
              {activeWishItem ? (
                <div className="card-polish p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-lg font-black dark:text-white flex items-center gap-2">
                          <Heart className="text-rose-500 w-5 h-5 fill-rose-500" /> Target Impian
                        </h2>
                        <p className="text-[11px] text-slate-400">Impian belajarmu yang sedang ditabung.</p>
                      </div>
                      <Link to="/wishlist" className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5 hover:underline">
                        Buka Wishlist <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-5">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-extrabold text-sm dark:text-white uppercase leading-tight">{activeWishItem.name}</span>
                        <span className="text-[9px] bg-purple-50 text-purple-600 dark:bg-purple-950/20 px-20 py-0.5 rounded-full font-black tracking-widest">{activeWishItem.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 font-semibold">Harga total: {formatRupiah(activeWishItem.price)}</p>
                      
                      {/* Saving slider visual */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (activeWishItem.saved / activeWishItem.price) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>{formatRupiah(activeWishItem.saved)}</span>
                        <span>{Math.round((activeWishItem.saved / activeWishItem.price) * 100)}% kumpul 💸</span>
                      </div>
                    </div>
                  </div>

                  {/* Saving Action Form */}
                  <form onSubmit={(e) => handleQuickSave(activeWishItem.id, e)} className="space-y-2 mt-auto">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Menabung Fleksibel (Quick Save)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={quickSaveAmount}
                        onChange={(e) => setQuickSaveAmount(e.target.value)}
                        placeholder="Rp 50.000"
                        className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 dark:text-white text-xs border border-transparent focus:border-indigo-600 rounded-xl focus:outline-none"
                      />
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all">
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="card-polish p-6 flex flex-col justify-between p-8 text-center items-center">
                  <PiggyBank className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-sm text-slate-500 dark:text-slate-300 font-semibold mb-3">Ingin membeli laptop baru atau gadget pendukung belajar?</p>
                  <button onClick={() => navigate('/wishlist')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Buat Sasaran Tabungan
                  </button>
                </div>
              )}

              {/* Flashcard Quick Review Card Flip mechanism */}
              {randomCard ? (
                <div className="card-polish p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-black dark:text-white flex items-center gap-2 mb-1">
                      <Layers className="text-purple-500 w-5 h-5" /> Kuis Kilat
                    </h2>
                    <p className="text-[11px] text-slate-400 mb-6">Review materi secara acak untuk mengingat kembali.</p>
                  </div>

                  {/* 3D Flippable card layout inside dashboard context */}
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-36 relative cursor-pointer group"
                    style={{ perspective: '1000px' }}
                  >
                    <div 
                      className="w-full h-full relative transition-transform duration-500 ease-out preserve-3d"
                      style={{ 
                        transform: isFlipped ? 'rotateY(180deg)' : 'none', 
                        transformStyle: 'preserve-3d' 
                      }}
                    >
                      {/* Front Card */}
                      <div 
                        className="absolute inset-0 bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-100 dark:border-purple-900/30 rounded-2xl p-4 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div>
                          <span className="text-[9px] font-black uppercase text-purple-600 bg-white dark:bg-purple-900/40 px-2 py-0.5 rounded-full tracking-wider">Pertanyaan</span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-3 leading-relaxed">{randomCard.front}</p>
                        </div>
                        <span className="text-[9px] text-purple-500 font-bold flex justify-center items-center gap-1 mt-1 opacity-70 group-hover:opacity-100">
                          Klik untuk membalik 🔄
                        </span>
                      </div>

                      {/* Back Card */}
                      <div 
                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-4 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <span className="text-[9px] font-black uppercase text-indigo-600 bg-white dark:bg-indigo-900/40 px-2 py-0.5 rounded-full tracking-wider">Jawaban</span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-3 leading-relaxed">{randomCard.back}</p>
                        </div>
                        <span className="text-[9px] text-indigo-500 font-bold flex justify-center items-center gap-1 mt-1 opacity-70 group-hover:opacity-100">
                          Kembali 🔄
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsFlipped(false);
                      setTimeout(() => {
                        const randomIdx = Math.floor(Math.random() * cards.length);
                        setRandomCard(cards[randomIdx]);
                      }, 150);
                    }} 
                    className="w-full mt-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-bold border dark:border-slate-800 transition-colors"
                  >
                    Materi Berikutnya
                  </button>
                </div>
              ) : (
                <div className="card-polish p-6 text-center">
                  <p className="text-xs text-slate-400">Belum ada flashcard untuk kuis.</p>
                  <button onClick={() => navigate('/flashcards')} className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">Buat Flashcard</button>
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {/* Floating saving notification popup toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-green-600 text-white py-3 px-5 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-white" /> Tabunganmu Berhasil Ditambahkan! 🥳
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
