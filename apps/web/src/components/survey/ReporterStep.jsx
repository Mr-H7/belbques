import React from 'react';
import { useSurvey } from '@/hooks/useSurvey.js';
import { AGE_GROUPS } from '@/utils/constants.js';

const fieldClass = (hasError) =>
  `w-full p-4 rounded-xl bg-card/40 border-2 transition-all duration-200 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:ring-2 focus:ring-primary/20 ${
    hasError ? 'border-destructive' : 'border-border focus:border-primary'
  }`;

export function ReporterStep() {
  const { reporter, setReporter, reporterErrors } = useSurvey();
  const errs = reporterErrors || {};

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground/80 mb-2">
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
        <label className="block text-sm font-semibold text-foreground/80 mb-2">
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
        <label className="block text-sm font-semibold text-foreground/80 mb-3">
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
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-card/40 text-card-foreground border-transparent hover:border-border hover:bg-card'
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
        <label className="block text-sm font-semibold text-foreground/80 mb-2">
          وسيلة تواصل إضافية <span className="text-foreground/50 text-xs">(اختياري)</span>
        </label>
        <input
          type="text"
          value={reporter.optionalContact}
          onChange={(e) => setReporter({ optionalContact: e.target.value })}
          placeholder="إيميل، إنستجرام، أو أي وسيلة تحب"
          className={fieldClass(false)}
        />
      </div>

      <p className="text-xs text-foreground/60 leading-relaxed pt-2">
        بياناتك بتُستخدم بس عشان نفهم آراء الناس في بنها — مش هنبعت لك إعلانات ولا نشاركها مع حد.
      </p>
    </div>
  );
}
