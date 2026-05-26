import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Layers, 
  Calendar, 
  Heart, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useSearch } from '../context/SearchContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Catatan', path: '/notes', icon: BookOpen },
  { name: 'Tugas', path: '/tasks', icon: CheckSquare },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Kalender', path: '/calendar', icon: Calendar },
  { name: 'Wishlist', path: '/wishlist', icon: Heart },
  { name: 'Profil', path: '/profile', icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoggedIn } = useUser();
  const { searchQuery, setSearchQuery } = useSearch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isLanding = location.pathname === '/' && !isLoggedIn;

  if (isLanding) {
    return <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen">
        <Link to="/" className="p-8 flex items-center gap-3 hover:opacity-80 transition-all">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">StudyFlow</span>
        </Link>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "group-hover:text-slate-800 dark:group-hover:text-white")} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {isLoggedIn && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center gap-3 border border-amber-100 dark:border-amber-900/30 mb-2">
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-500 truncate">{user.name}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-600/80 uppercase font-bold tracking-wider">Mahasiswa</p>
              </div>
            </div>
          )}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase tracking-wider">{theme === 'light' ? 'Mode Malam' : 'Mode Terang'}</span>
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
          <Link to="/" className="md:hidden flex items-center gap-3 hover:opacity-80 transition-all">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold dark:text-white">StudyFlow</span>
          </Link>

          <div className="flex-1 max-w-xs sm:max-w-md relative mx-2 sm:mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari catatan, tugas, atau jadwal..."
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={cn("p-1.5 rounded-full transition-all", theme === 'light' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={cn("p-1.5 rounded-full transition-all", theme === 'dark' ? "bg-slate-700 shadow-sm text-blue-400" : "text-slate-400")}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-20"
            >
              <nav className="px-6 space-y-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 py-3 text-lg rounded-xl px-4",
                        isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "dark:text-slate-300"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-6 border-t dark:border-slate-800 space-y-4">
                  <button 
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-4 py-3 text-lg px-4 dark:text-slate-300 w-full"
                  >
                    {theme === 'light' ? <Moon /> : <Sun />}
                    Ganti Tema
                  </button>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-4 py-3 text-lg px-4 text-red-600 font-bold w-full"
                  >
                    <LogOut />
                    Keluar
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
