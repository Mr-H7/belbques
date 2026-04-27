
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button.jsx';
import { useAppSettings } from '@/context/AppSettingsContext.jsx';

const DEFAULT_TITLE = 'بنها بتقول إيه؟';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { general, surveyState } = useAppSettings();
  const title = general?.title?.trim() || DEFAULT_TITLE;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSurvey = () => {
    const surveySection = document.getElementById('survey-section');
    if (surveySection) {
      surveySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header premium-shadow' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">ب</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-foreground/80 font-medium">
            <a href="#benefits" className="hover:text-foreground transition-colors">الأهمية</a>
            <a href="#future" className="hover:text-foreground transition-colors">المستقبل</a>
          </nav>

          <Button
            onClick={scrollToSurvey}
            variant="primary"
            size="sm"
            disabled={!surveyState.open}
            className="hidden sm:flex px-6"
          >
            {surveyState.open ? 'ابدأ الاستبيان' : 'مغلق'}
          </Button>
        </div>
      </div>
    </header>
  );
}
