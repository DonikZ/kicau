import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format, isAfter, isBefore, startOfToday } from 'date-fns';
import { useSearch } from '../context/SearchContext';

interface Task {
  id: string;
  text: string;
  deadline: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Kerjakan tugas Matematika BAB 3', deadline: format(new Date(), 'yyyy-MM-dd'), completed: false, priority: 'high' },
      { id: '2', text: 'Baca buku literasi Sejarah', deadline: format(new Date(), 'yyyy-MM-dd'), completed: true, priority: 'medium' }
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const { searchQuery } = useSearch();

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      deadline: newDeadline,
      completed: false,
      priority: newPriority
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch(p) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const filteredTasks = tasks.filter(task => {
    return task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.priority.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">To-Do & Deadline</h1>
          <p className="text-slate-500">Kelola tugas dan tenggat waktu akademikmu.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-4 py-2 border-r border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total</span>
            <span className="text-xl font-bold dark:text-white">{tasks.length}</span>
          </div>
          <div className="px-4 py-2">
            <span className="text-xs font-bold text-slate-400 uppercase block">Selesai</span>
            <span className="text-xl font-bold text-green-500">{tasks.filter(t => t.completed).length}</span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={addTask} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Ada tugas apa hari ini?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <input 
            type="date" 
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <select 
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as any)}
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Tambah
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task) => {
            const isOverdue = !task.completed && isBefore(new Date(task.deadline), startOfToday());
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={task.id}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 group",
                  task.completed 
                    ? "bg-slate-50/50 dark:bg-slate-900/50 border-transparent opacity-60" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm"
                )}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "transition-all duration-300 transform active:scale-90",
                    task.completed ? "text-green-500" : "text-slate-300 dark:text-slate-600 hover:text-blue-500"
                  )}
                >
                  {task.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                </button>

                <div className="flex-1">
                  <h3 className={cn(
                    "text-[15px] font-bold transition-all tracking-tight",
                    task.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-white"
                  )}>
                    {task.text}
                  </h3>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(task.deadline), 'dd MMM yyyy')}
                    </span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                    {isOverdue && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-red-600 uppercase italic">
                        <AlertCircle className="w-3 h-3" /> Terlambat
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">
              {searchQuery ? 'Tidak ada tugas yang cocok dengan pencarian.' : 'Yeay! Semua tugas sudah selesai.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
