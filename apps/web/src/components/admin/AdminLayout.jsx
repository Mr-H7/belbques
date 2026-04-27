
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { LayoutDashboard, Users, PieChart, Download, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { currentAdmin, logout } = useAuth();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'الرئيسية', end: true },
    { path: '/admin/results', icon: Users, label: 'النتائج' },
    { path: '/admin/analytics', icon: PieChart, label: 'الإحصائيات' },
    { path: '/admin/export', icon: Download, label: 'تصدير' },
    { path: '/admin/settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <div className="min-h-screen bg-background dark flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col admin-sidebar fixed h-full right-0 top-0 z-40 border-l border-border">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-primary">ب</span>
            </div>
            <h2 className="text-lg font-bold">لوحة الإدارة</h2>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center">
              <span className="text-sm font-medium">{currentAdmin?.email?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{currentAdmin?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentAdmin?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center w-full gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pr-64">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
