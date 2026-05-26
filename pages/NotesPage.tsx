import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Plus, Trash2, Edit3, BookOpen, Save, Hash, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSearch } from '../context/SearchContext';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: number;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [{ 
      id: '1', 
      title: 'Selamat Datang di Catatan Markdown', 
      content: '# Judul Catatan\n\nMulai tulis catatan belajarmu di sini menggunakan format **Markdown**!\n\n- Gunakan `-` untuk list\n- Gunakan `#` untuk heading\n- Gunakan `**` untuk bold',
      category: 'Umum',
      updatedAt: Date.now()
    }];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const { searchQuery } = useSearch();

  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(q) || 
           note.content.toLowerCase().includes(q) || 
           note.category.toLowerCase().includes(q);
  });

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Catatan Baru',
      content: '',
      category: 'Umum',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    setNoteIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (noteIdToDelete) {
      const filtered = notes.filter(n => n.id !== noteIdToDelete);
      setNotes(filtered);
      if (activeNoteId === noteIdToDelete) {
        setActiveNoteId(filtered[0]?.id || '');
      }
      setNoteIdToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar Catatan */}
      <div className="w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white">Catatan</h1>
          <button 
            onClick={addNote}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => { setActiveNoteId(note.id); setIsEditing(false); }}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-200 group relative",
                activeNoteId === note.id 
                  ? "bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900 shadow-sm" 
                  : "bg-slate-100/50 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-blue-500 uppercase">{note.category}</span>
              </div>
              <h3 className={cn(
                "font-bold truncate",
                activeNoteId === note.id ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
              )}>
                {note.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              
              <button 
                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                className="absolute top-4 right-4 p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 card-polish overflow-hidden flex flex-col">
        {activeNote ? (
          <>
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder="Judul Catatan"
                  className="text-2xl font-bold bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white w-full tracking-tight"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-black text-slate-400 uppercase tracking-widest">Kategori</span>
                  <select 
                    value={activeNote.category}
                    onChange={(e) => updateNote(activeNote.id, { category: e.target.value })}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold border-none p-0 focus:ring-0 cursor-pointer bg-transparent"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa">Bahasa</option>
                    <option value="Sains">Sains</option>
                    <option value="Sejarah">Sejarah</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                    isEditing 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  )}
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {isEditing ? 'Selesai' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isEditing ? (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-mono text-slate-700 dark:text-slate-300 leading-relaxed"
                  placeholder="Tulis sesuatu menarik..."
                />
              ) : (
                <div className="markdown-body dark:text-slate-300">
                  <ReactMarkdown>{activeNote.content || '_Tak ada konten. Klik Edit untuk menulis._'}</ReactMarkdown>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
            <p>Pilih catatan atau buat yang baru</p>
          </div>
        )}
      </div>

      {/* Custom Confirm Delete Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm font-[Poppins]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Hapus Catatan?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tindakan ini permanen dan catatan terpilih tidak bisa dipulihkan kembali.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
