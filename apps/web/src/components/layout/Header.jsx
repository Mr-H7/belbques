import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button.jsx';
import { useAppSettings } from '@/context/AppSettingsContext.jsx';
import { Menu, X, Shield } from 'lucide-react';

const DEFAULT_TITLE = 'بنها بتقول إيه؟';

const NAV_ITEMS = [
  { href: '#benefits', label: 'الأهمية' },
  { href: '#survey-section', label: 'الاستبيان' },
  { href: '#future', label: 'المستقبل' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { general, surveyState } = useAppSettings();
  const title = general?.title?.trim() || DEFAULT_TITLE;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 14);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);

  const scrollToSurvey = () => {
    const surveySection = document.getElementById('survey-section');
    if (surveySection) {
      surveySection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? 'glass-header premium-shadow py-2.5' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between gap-3 min-h-[72px]">
          <button
            type="button"
            className="flex items-center gap-3 min-w-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-12 h-12 rounded-xl border border-white/20 bg-[#08162d]/70 p-1.5 flex items-center justify-center logo-mark">
              <img
                src="/belb-logo.png"
                alt="شعار بنها"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right min-w-0 hidden sm:block">
              <p className="text-lg sm:text-xl font-extrabold text-foreground truncate">{title}</p>
              <p className="text-xs text-foreground/65">منصة تشاركية لتطوير المدينة</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/10 bg-[#08162d]/45 backdrop-blur-md">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/82 hover:text-foreground hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/admin"
              className="admin-cta inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-95"
              aria-label="لوحة التحكم"
            >
              <Shield className="w-4 h-4" />
              لوحة التحكم
            </Link>
            <Button
              onClick={scrollToSurvey}
              variant="primary"
              size="sm"
              disabled={!surveyState.open}
              className="px-6 rounded-full"
            >
              {surveyState.open ? 'ابدأ الاستبيان' : 'مغلق حالياً'}
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl border border-white/15 bg-[#0a1933]/80 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-white/15 bg-[#08162d]/92 backdrop-blur-xl premium-shadow p-4 space-y-3">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className="block w-full text-right px-3 py-2.5 rounded-xl text-foreground/90 font-semibold hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="flex flex-col gap-2.5">
              <Link
                to="/admin"
                onClick={closeMobile}
                className="admin-cta inline-flex items-center justify-center gap-2 h-11 rounded-xl font-semibold"
              >
                <Shield className="w-4 h-4" />
                لوحة التحكم
              </Link>
              <Button
                onClick={scrollToSurvey}
                variant="primary"
                size="sm"
                disabled={!surveyState.open}
                className="h-11 rounded-xl"
              >
                {surveyState.open ? 'ابدأ الاستبيان' : 'الاستبيان مغلق حالياً'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
