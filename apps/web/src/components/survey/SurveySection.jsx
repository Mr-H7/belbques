import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurvey } from '@/hooks/useSurvey.js';
import { SurveyCard } from './SurveyCard.jsx';
import { QuestionButton } from './QuestionButton.jsx';
import { SurveyInput } from './SurveyInput.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { ReporterStep } from './ReporterStep.jsx';
import { Button } from '@/components/common/Button.jsx';
import { AGE_GROUPS } from '@/utils/constants.js';
import {
  trackQuestionAnswered,
  trackSurveyStart,
  trackInputFocus,
} from '@/services/analytics.js';

const stepVariants = {
  enter: { opacity: 0, x: -24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
};

function MultiOption({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full px-5 py-4 sm:py-[18px] rounded-2xl text-right font-semibold text-base sm:text-lg transition-all duration-200 border-2 flex items-center justify-between gap-4 ${
        selected
          ? 'bg-primary/15 text-foreground border-primary shadow-[0_8px_24px_-12px_rgba(96,165,250,0.4)]'
          : 'bg-card/40 text-card-foreground border-white/5 hover:bg-card hover:border-primary/40 hover:-translate-y-0.5'
      } active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      aria-pressed={selected}
    >
      <span className="flex-1">{children}</span>
      <span
        className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-colors ${
          selected ? 'bg-primary border-primary text-primary-foreground' : 'border-white/30 group-hover:border-primary/60'
        }`}
      >
        {selected ? '✓' : ''}
      </span>
    </button>
  );
}

function QuestionView({ question, index }) {
  const { answers, updateAnswer, toggleMultiAnswer } = useSurvey();
  const value = answers[question.id];
  const startedRef = useRef(Date.now());

  if (question.type === 'single') {
    return (
      <div className="space-y-3">
        {question.options.map((opt) => (
          <QuestionButton
            key={opt.id}
            selected={value === opt.id}
            onClick={() => {
              updateAnswer(question.id, opt.id);
              trackQuestionAnswered(
                index + 1,
                opt.id,
                Math.round((Date.now() - startedRef.current) / 1000)
              );
            }}
          >
            {opt.label}
          </QuestionButton>
        ))}
      </div>
    );
  }

  if (question.type === 'multi') {
    const selectedList = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        {question.options.map((opt) => (
          <MultiOption
            key={opt.id}
            selected={selectedList.includes(opt.id)}
            onClick={() => toggleMultiAnswer(question.id, opt.id)}
          >
            {opt.label}
          </MultiOption>
        ))}
        <p className="text-xs text-foreground/60 pt-2">يمكنك اختيار أكثر من إجابة</p>
      </div>
    );
  }

  // text
  return (
    <div onFocus={() => trackInputFocus(`question_${question.id}`)}>
      <SurveyInput
        value={value || ''}
        onChange={(val) => updateAnswer(question.id, val)}
        placeholder={question.placeholder}
      />
    </div>
  );
}

function ReviewStep() {
  const { reporter, answers, questions, goToStep } = useSurvey();
  const ageLabel = AGE_GROUPS.find((g) => g.id === reporter.ageGroup)?.label || '—';

  const renderAnswer = (q) => {
    const v = answers[q.id];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
      return <span className="text-foreground/40">—</span>;
    }
    if (q.type === 'single') {
      return q.options.find((o) => o.id === v)?.label || String(v);
    }
    if (q.type === 'multi') {
      return (Array.isArray(v) ? v : [])
        .map((id) => q.options.find((o) => o.id === id)?.label || id)
        .join('، ');
    }
    return v;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-card/30 border border-border/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">بيانات التواصل</h4>
          <button
            type="button"
            onClick={() => goToStep(0)}
            className="text-sm text-primary hover:underline"
          >
            تعديل
          </button>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><dt className="text-foreground/60">الاسم</dt><dd>{reporter.fullName || '—'}</dd></div>
          <div><dt className="text-foreground/60">الموبايل</dt><dd dir="ltr" className="text-left">{reporter.phone || '—'}</dd></div>
          <div><dt className="text-foreground/60">الفئة العمرية</dt><dd>{ageLabel}</dd></div>
          <div><dt className="text-foreground/60">تواصل إضافي</dt><dd>{reporter.optionalContact || '—'}</dd></div>
        </dl>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-xl bg-card/30 border border-border/40 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h5 className="font-semibold text-foreground/90">
                {i + 1}. {q.text}
              </h5>
              <button
                type="button"
                onClick={() => goToStep(i + 1)}
                className="text-xs text-primary hover:underline shrink-0"
              >
                تعديل
              </button>
            </div>
            <div className="text-sm text-foreground/80">{renderAnswer(q)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SurveySection() {
  const {
    questions,
    step,
    totalSteps,
    progress,
    canAdvance,
    goNext,
    goPrev,
    submitSurvey,
    isSubmitting,
  } = useSurvey();

  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      trackSurveyStart();
      startedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const el = document.getElementById('survey-section');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [step]);

  const isReporter = step === 0;
  const isReview = step === totalSteps - 1;
  const questionIndex = step - 1;
  const currentQuestion = !isReporter && !isReview ? questions[questionIndex] : null;

  let title = '';
  let subtitle = '';
  if (isReporter) {
    title = 'قبل ما نبدأ… عرّفنا بنفسك';
    subtitle = 'بياناتك سرّية — هنستخدمها بس عشان نفهم آراء أهل بنها.';
  } else if (isReview) {
    title = 'راجع إجاباتك قبل الإرسال';
    subtitle = 'لو حابب تعدّل أي حاجة، اضغط "تعديل" جنب السؤال.';
  } else if (currentQuestion) {
    title = currentQuestion.text;
    subtitle = currentQuestion.required ? '' : 'اختياري';
  }

  return (
    <div className="max-w-3xl mx-auto w-full relative z-10">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-primary mb-3 tracking-wide">
          الخطوة {step + 1} من {totalSteps}
        </p>
        <ProgressBar progress={progress} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <SurveyCard
            title={!isReporter && !isReview ? `${questionIndex + 1}. ${title}` : title}
            description={subtitle || undefined}
          >
            {isReporter && <ReporterStep />}
            {currentQuestion && <QuestionView question={currentQuestion} index={questionIndex} />}
            {isReview && <ReviewStep />}
          </SurveyCard>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 mb-16">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={step === 0 || isSubmitting}
          className={step === 0 ? 'opacity-40 pointer-events-none' : ''}
        >
          → السابق
        </Button>

        {isReview ? (
          <Button
            onClick={submitSurvey}
            isLoading={isSubmitting}
            size="lg"
            className="px-12 animate-glow"
          >
            إرسال الاستبيان
          </Button>
        ) : (
          <Button
            onClick={goNext}
            disabled={!canAdvance(step)}
            className={!canAdvance(step) ? 'opacity-50 cursor-not-allowed' : ''}
          >
            التالي ←
          </Button>
        )}
      </div>
    </div>
  );
}
