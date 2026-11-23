import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected Route Component for Admin Dashboard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

// Route wrapper for Admin Login (redirects if already signed in)
const AdminLoginRoute: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLoginPage />;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MenuProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Routes>
                
                {/* Customer Public Pages with Navbar & Footer */}
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <div className="flex-1">
                        <HomePage />
                      </div>
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/menu"
                  element={
                    <>
                      <Navbar />
                      <div className="flex-1">
                        <MenuPage />
                      </div>
                      <Footer />
                    </>
                  }
                />

                {/* Owner Admin Login */}
                <Route path="/admin" element={<AdminLoginRoute />} />

                {/* Owner Protected Admin Dashboard */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboardPage />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Catch-all redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </div>
          </BrowserRouter>
        </MenuProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};
