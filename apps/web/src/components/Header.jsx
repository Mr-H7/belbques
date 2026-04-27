
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSurvey = () => {
    const surveySection = document.getElementById('survey');
    if (surveySection) {
      surveySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header premium-shadow' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">
              بنها بتقول إيه؟
            </h1>
          </div>
          
          <Button
            onClick={scrollToSurvey}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
          >
            ابدأ الاستبيان
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
