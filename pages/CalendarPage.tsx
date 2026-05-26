import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  MapPin,
  Clock
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSearch } from '../context/SearchContext';

interface Exam {
  id: string;
  title: string;
  date: string;
  room: string;
  time: string;
  subject: string;
}

export default function CalendarPage() {
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('exams');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Ujian Tengah Semester', date: format(addDays(new Date(), 5), 'yyyy-MM-dd'), room: 'Lab Komputer A', time: '09:00', subject: 'Matematika' },
      { id: '2', title: 'Kuis Sejarah Dunia', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), room: 'Gedung B R.201', time: '13:00', subject: 'Sejarah' }
    ];
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const { searchQuery } = useSearch();

  const filteredExams = exams.filter(exam => {
    const q = searchQuery.toLowerCase();
    return exam.title.toLowerCase().includes(q) ||
           exam.subject.toLowerCase().includes(q) ||
           exam.room.toLowerCase().includes(q);
  });
  
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newRoom, setNewRoom] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newSubject, setNewSubject] = useState('Umum');

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const addExam = (e: React.FormEvent) => {
    e.preventDefault();
    const exam: Exam = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      room: newRoom,
      time: newTime,
      subject: newSubject
    };
    setExams([...exams, exam]);
    setIsAdding(false);
    setNewTitle('');
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <CalendarIcon className="text-blue-500" /> Kalender Ujian
          </h1>
          <p className="text-slate-500">Pantau jadwal ujian agar tidak terlewat.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Jadwal Baru
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-white"
              ><ChevronLeft /></button>
              <button 
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-white"
              ><ChevronRight /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-tighter">{day}</div>
            ))}
            {days.map((day, idx) => {
              const dayExams = filteredExams.filter(e => isSameDay(new Date(e.date), day));
              return (
                <div 
                  key={idx} 
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border",
                    isSameDay(day, new Date()) ? "bg-blue-600 border-blue-500" : "bg-slate-50 dark:bg-slate-800/50 border-transparent shadow-sm"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    isSameDay(day, new Date()) ? "text-white" : "text-slate-700 dark:text-slate-300"
                  )}>{format(day, 'd')}</span>
                  {dayExams.length > 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full animate-pulse" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold dark:text-white mb-4">Mendatang</h3>
          <AnimatePresence>
            {filteredExams.map((exam) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={exam.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold dark:text-white leading-tight">{exam.title}</h4>
                  <button 
                    onClick={() => deleteExam(exam.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  ><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="space-y-1">
                   <p className="text-xs text-blue-600 font-bold">{exam.subject}</p>
                   <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {exam.room}</p>
                   <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {exam.time} WIB</p>
                </div>
              </motion.div>
            ))}
            {filteredExams.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                Tidak ada ujian yang cocok.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold dark:text-white mb-6">Jadwal Ujian Baru</h2>
            <form onSubmit={addExam} className="space-y-4">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="UTS Kimia" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none" required />
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none" required />
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none" required />
              <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Mata Pelajaran" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none" required />
              <input value={newRoom} onChange={e => setNewRoom(e.target.value)} placeholder="Ruangan" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none" required />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Batal</button>
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
