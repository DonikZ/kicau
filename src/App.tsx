import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import FlashcardsPage from './pages/FlashcardsPage';
import CalendarPage from './pages/CalendarPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUser();
  if (!isLoggedIn) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useUser();
  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/notes" /> : <LandingPage />} />
          <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
}
