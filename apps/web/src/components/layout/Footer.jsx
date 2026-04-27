
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-background/90 border-t border-border py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">ب</span>
            </div>
            <span className="text-xl font-bold text-foreground">بنها بتقول إيه؟</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-foreground/70 mb-2">
              © {new Date().getFullYear()} بنها بتقول إيه؟ - جميع الحقوق محفوظة
            </p>
            <div className="flex items-center justify-center md:justify-end gap-6 text-sm">
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                سياسة الخصوصية
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
