import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSearch } from '../context/SearchContext';

interface Card {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [
      { id: '1', front: 'Apa ibukota Indonesia?', back: 'Jakarta (Nusantara sebagai IKN)', mastered: false },
      { id: '2', front: 'Atom terdiri dari?', back: 'Proton, Neutron, Elektron', mastered: false }
    ];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const { searchQuery } = useSearch();

  const filteredCards = cards.filter(card => {
    const q = searchQuery.toLowerCase();
    return card.front.toLowerCase().includes(q) ||
           card.back.toLowerCase().includes(q);
  });

  const activeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront || !newBack) return;
    setCards([...cards, { id: Date.now().toString(), front: newFront, back: newBack, mastered: false }]);
    setNewFront('');
    setNewBack('');
    setIsAdding(false);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    if (currentIndex >= cards.length - 1) setCurrentIndex(Math.max(0, cards.length - 2));
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (filteredCards.length || 1));
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % (filteredCards.length || 1));
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 h-full flex flex-col justify-center py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Layers className="text-blue-500" /> Flashcards
          </h1>
          <p className="text-slate-500">Uji daya ingatmu dengan kartu belajar cepat.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Kartu
        </button>
      </div>

      {filteredCards.length > 0 ? (
        <div className="space-y-8 flex-1 flex flex-col justify-center">
          {/* Progress Bar */}
          <div className="bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-blue-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((activeIndex + 1) / filteredCards.length) * 100}%` }}
            />
          </div>

          <div className="relative h-80 perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex + (isFlipped ? '-back' : '-front')}
                initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className={cn(
                  "w-full h-full p-10 rounded-[3rem] shadow-xl flex flex-col items-center justify-center text-center cursor-pointer select-none transition-colors border-4",
                  isFlipped 
                    ? "bg-slate-900 border-slate-700 text-white" 
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white"
                )}
              >
                <span className="absolute top-8 left-10 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {isFlipped ? 'Jawaban' : 'Pertanyaan'}
                </span>
                <p className="text-2xl font-bold leading-relaxed">
                  {isFlipped ? filteredCards[activeIndex].back : filteredCards[activeIndex].front}
                </p>
                <div className="absolute bottom-8 text-xs font-bold text-blue-500 flex items-center gap-2">
                  <RefreshCw className="w-3 h-3" /> Klik untuk membalik
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={prevCard}
              className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all active:scale-90"
            >
              <ArrowLeft />
            </button>
            <span className="text-lg font-bold text-slate-600 dark:text-slate-400">
              {activeIndex + 1} <span className="opacity-40">/</span> {filteredCards.length}
            </span>
            <button 
              onClick={nextCard}
              className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all active:scale-90"
            >
              <ArrowRight />
            </button>
          </div>

          <div className="flex justify-center">
             <button 
                onClick={() => deleteCard(filteredCards[activeIndex].id)}
                className="text-red-500 flex items-center gap-2 font-bold text-sm hover:underline opacity-50 hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" /> Hapus Kartu Ini
              </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Layers className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
          <p className="text-slate-500 font-medium">
            {searchQuery ? 'Tidak ada flashcards yang cocok.' : 'Belum ada flashcards. Tambahkan untuk mulai belajar!'}
          </p>
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative"
          >
            <h2 className="text-2xl font-bold dark:text-white mb-6">Tambah Kartu Baru</h2>
            <form onSubmit={addCard} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Pertanyaan (Depan)</label>
                <textarea 
                  required
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white h-24 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Mis: Apa fungsi mitokondria?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Jawaban (Belakang)</label>
                <textarea 
                  required
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white h-24 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Mis: Penghasil energi sel"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold border border-transparent hover:border-slate-200"
                >
                  Batal
                </button>
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700">
                  Simpan Kartu
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
