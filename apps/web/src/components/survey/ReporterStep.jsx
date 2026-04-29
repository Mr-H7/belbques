import React from 'react';
import { useSurvey } from '@/hooks/useSurvey.js';
import { AGE_GROUPS } from '@/utils/constants.js';

const fieldClass = (hasError) =>
  `w-full p-4 rounded-xl bg-[#0d1e3b]/70 border-2 transition-all duration-200 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-[#12274a] focus:ring-2 focus:ring-primary/20 ${
    hasError ? 'border-destructive' : 'border-white/10 focus:border-primary'
  }`;

export function ReporterStep() {
  const { reporter, setReporter, reporterErrors } = useSurvey();
  const errs = reporterErrors || {};

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground/85 mb-2">
          الاسم بالكامل <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={reporter.fullName}
          onChange={(e) => setReporter({ fullName: e.target.value })}
          placeholder="مثلاً: أحمد محمد"
          className={fieldClass(!!errs.fullName)}
        />
        {errs.fullName && <p className="mt-2 text-sm text-destructive">{errs.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground/85 mb-2">
          رقم الموبايل <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          inputMode="tel"
          dir="ltr"
          value={reporter.phone}
          onChange={(e) => setReporter({ phone: e.target.value })}
          placeholder="01xxxxxxxxx"
          className={`${fieldClass(!!errs.phone)} text-left`}
        />
        {errs.phone && <p className="mt-2 text-sm text-destructive">{errs.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground/85 mb-3">
          الفئة العمرية <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AGE_GROUPS.map((g) => {
            const selected = reporter.ageGroup === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setReporter({ ageGroup: g.id })}
                className={`py-3 px-4 rounded-xl font-semibold border-2 transition-all duration-200 ${
                  selected
                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_12px_28px_-16px_rgba(56,189,248,0.7)]'
                    : 'bg-[#0d1e3b]/65 text-card-foreground border-white/10 hover:border-primary/40 hover:bg-[#12274a]'
                }`}
                aria-pressed={selected}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        {errs.ageGroup && <p className="mt-2 text-sm text-destructive">{errs.ageGroup}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground/85 mb-2">
          وسيلة تواصل إضافية <span className="text-foreground/50 text-xs">(اختياري)</span>
        </label>
        <input
          type="text"
          value={reporter.optionalContact}
          onChange={(e) => setReporter({ optionalContact: e.target.value })}
          placeholder="إيميل، إنستجرام، أو أي وسيلة تفضّلها"
          className={fieldClass(false)}
        />
      </div>

      <p className="text-xs text-foreground/62 leading-relaxed pt-1">
        بياناتك بتُستخدم فقط لتحليل نتائج الاستبيان وتحسين الخدمات، ولا يتم مشاركتها مع أي جهة خارج نطاق المشروع.
      </p>
    </div>
  );
}
