
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/context/AuthContext.jsx';
import { SurveyProvider } from '@/context/SurveyContext.jsx';
import { AppSettingsProvider } from '@/context/AppSettingsContext.jsx';

import HomePage from '@/pages/HomePage.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

import AdminLogin from '@/components/admin/AdminLogin.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import AdminDashboard from '@/components/admin/AdminDashboard.jsx';
import ResultsTable from '@/components/admin/ResultsTable.jsx';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel.jsx';
import ExportPanel from '@/components/admin/ExportPanel.jsx';
import SettingsPanel from '@/components/admin/SettingsPanel.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppSettingsProvider>
        <SurveyProvider>
          <Toaster position="top-center" richColors />
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="results" element={<ResultsTable />} />
              <Route path="analytics" element={<AnalyticsPanel />} />
              <Route path="export" element={<ExportPanel />} />
              <Route path="settings" element={<SettingsPanel />} />
            </Route>

            {/* Catch All Route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center px-4">
                  <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                  <p className="text-xl mb-8">الصفحة التي تبحث عنها غير موجودة</p>
                  <a href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
                    العودة للرئيسية
                  </a>
                </div>
              } 
            />
          </Routes>
        </SurveyProvider>
        </AppSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
