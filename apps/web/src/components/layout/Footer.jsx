import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative z-10 pt-10 pb-8 mt-auto">
      <div className="section-divider mb-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[#0a1831]/78 backdrop-blur-xl p-6 sm:p-8 premium-shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl border border-white/20 bg-[#09152a]/70 p-1.5 logo-mark">
                  <img src="/belb-logo.png" alt="شعار بنها" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">بنها بتقول إيه؟</p>
                  <p className="text-xs text-foreground/65">منصة مشاركة مجتمعية موثوقة</p>
                </div>
              </div>
              <p className="text-sm text-foreground/72 leading-relaxed max-w-sm">
                نؤمن أن البيانات الدقيقة وصوت المواطن هما أساس التخطيط الحضري الذكي وبناء خدمات عامة أفضل.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-foreground font-semibold">روابط سريعة</p>
                <a href="#benefits" className="block text-foreground/70 hover:text-foreground">الأهمية</a>
                <a href="#survey-section" className="block text-foreground/70 hover:text-foreground">الاستبيان</a>
                <a href="#future" className="block text-foreground/70 hover:text-foreground">المستقبل</a>
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-semibold">الإدارة</p>
                <Link to="/admin" className="block text-foreground/70 hover:text-foreground">لوحة التحكم</Link>
                <Link to="/admin/login" className="block text-foreground/70 hover:text-foreground">تسجيل الدخول</Link>
              </div>
            </div>

            <div className="text-sm text-foreground/70 lg:text-left">
              <p className="mb-2">
                تم تصميم المنصة لتقديم تجربة واضحة وسريعة مع الحفاظ على خصوصية المشاركين.
              </p>
              <p className="text-xs text-foreground/55">
                © {new Date().getFullYear()} بنها بتقول إيه؟ - جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
