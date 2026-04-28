import { SURVEY_QUESTIONS, AGE_GROUPS } from '@/utils/constants.js';

/**
 * Records are normalized to:
 *   { id, created, name, email, phone, answers: { reporter, answers, metadata } }
 *
 * Older/legacy rows may have answers as a flat object — `flattenRecord` handles
 * both shapes so admin exports stay compatible.
 */

const formatAnswer = (q, value) => {
  if (value === undefined || value === null || value === '') return '';
  if (q.type === 'single') return q.options?.find((o) => o.id === value)?.label || String(value);
  if (q.type === 'multi') {
    const arr = Array.isArray(value) ? value : [];
    return arr.map((id) => q.options?.find((o) => o.id === id)?.label || id).join(' | ');
  }
  return String(value);
};

const flattenRecord = (record) => {
  const wrapper = record.answers || {};
  const reporter = wrapper.reporter || {
    fullName: record.name,
    phone: record.phone,
    ageGroup: '',
    optionalContact: record.email,
  };
  const answers = wrapper.answers || (typeof wrapper === 'object' ? wrapper : {});
  const ageLabel = AGE_GROUPS.find((g) => g.id === reporter.ageGroup)?.label || reporter.ageGroup || '';

  const flat = {
    submittedAt: record.created,
    name: reporter.fullName || '',
    phone: reporter.phone || '',
    ageGroup: ageLabel,
    optionalContact: reporter.optionalContact || '',
  };
  SURVEY_QUESTIONS.forEach((q) => {
    flat[q.id] = formatAnswer(q, answers[q.id]);
  });
  return flat;
};

const csvEscape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
const REQUIRED_QUESTION_IDS = SURVEY_QUESTIONS.filter((q) => q.required).map((q) => q.id);

const isAnswered = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null && value !== '';
};

const calculateCompletionRate = (records) => {
  if (!Array.isArray(records) || records.length === 0) return '0.0';
  const completed = records.filter((record) => {
    const answers = record?.answers?.answers || record?.answers || {};
    return REQUIRED_QUESTION_IDS.every((id) => isAnswered(answers?.[id]));
  }).length;
  return ((completed / records.length) * 100).toFixed(1);
};

const toPercentText = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '—';
  return raw.endsWith('%') ? raw : `${raw}%`;
};

export const exportToCSV = (surveyResults) => {
  if (!surveyResults || surveyResults.length === 0) return;
  const rows = surveyResults.map(flattenRecord);
  const headers = ['submittedAt', 'name', 'phone', 'ageGroup', 'optionalContact', ...SURVEY_QUESTIONS.map((q) => q.id)];
  const lines = [headers.join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => csvEscape(r[h])).join(',')));
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `benha-survey-results-${getFormattedDate()}.csv`);
};

export const exportToJSON = (surveyResults) => {
  if (!surveyResults || surveyResults.length === 0) return;
  const data = surveyResults.map((r) => ({
    id: r.id,
    submittedAt: r.created,
    ...(r.answers || {}),
  }));
  const payload = {
    metadata: { exportedAt: new Date().toISOString(), totalRecords: data.length },
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `benha-survey-results-${getFormattedDate()}.json`);
};

export const exportToPDF = (surveyResults, stats = {}) => {
  if (!Array.isArray(surveyResults) || surveyResults.length === 0) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  const rows = surveyResults.map((rec) => ({ rec, flat: flattenRecord(rec) }));
  const completionRate = toPercentText(stats.completionRate ?? calculateCompletionRate(surveyResults));

  const respondentCard = ({ rec, flat }, index) => `
    <article class="respondent" aria-label="مشاركة ${index + 1}">
      <header class="respondent-head">
        <div class="respondent-num">#${index + 1}</div>
        <dl class="respondent-meta">
          <div><dt>الاسم</dt><dd>${escapeHtml(flat.name) || '—'}</dd></div>
          <div><dt>الموبايل</dt><dd dir="ltr">${escapeHtml(flat.phone) || '—'}</dd></div>
          <div><dt>الفئة العمرية</dt><dd>${escapeHtml(flat.ageGroup) || '—'}</dd></div>
          <div><dt>تاريخ الإرسال</dt><dd>${new Date(rec.created).toLocaleDateString('ar-EG')}</dd></div>
        </dl>
      </header>
      <ol class="answers">
        ${SURVEY_QUESTIONS.map((q, i) => {
          const ans = flat[q.id];
          const isEmpty = ans === undefined || ans === null || ans === '';
          return `
            <li class="answer">
              <div class="q-line">
                <span class="q-num">Q${i + 1}</span>
                <p class="q-text">${escapeHtml(q.text)}</p>
              </div>
              <p class="a${isEmpty ? ' empty' : ''}">${isEmpty ? '— لم يُجَب —' : escapeHtml(ans)}</p>
            </li>`;
        }).join('')}
      </ol>
    </article>
  `;

  const htmlContent = `
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>تقرير نتائج استبيان بنها — ${getFormattedDate()}</title>
    <style>
      :root {
        --ink: #111827;
        --ink-soft: #4b5563;
        --line: #e5e7eb;
        --bg-soft: #f8fafc;
        --accent: #1a2a4a;
        --accent-soft: #eef2ff;
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #fff; color: var(--ink); }
      body {
        font-family: 'Cairo', 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.5;
        direction: rtl;
        padding: 14mm 11mm;
      }

      .doc-head { margin-bottom: 8mm; border-bottom: 2px solid var(--accent); padding-bottom: 4mm; }
      .doc-head h1 { margin: 0 0 2mm; font-size: 20pt; color: var(--accent); letter-spacing: -0.01em; }
      .doc-head .sub { color: var(--ink-soft); font-size: 10.5pt; }

      .summary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4mm;
        margin: 4mm 0 8mm;
      }
      .summary .box {
        border: 1px solid var(--line);
        border-radius: 6pt;
        padding: 4mm 5mm;
        background: var(--bg-soft);
      }
      .summary .box .label { font-size: 9pt; color: var(--ink-soft); margin-bottom: 1mm; }
      .summary .box .val { font-size: 16pt; font-weight: 700; color: var(--accent); }

      .respondent {
        border: 1px solid var(--line);
        border-radius: 8pt;
        padding: 5mm 6mm;
        margin-bottom: 5mm;
        background: #fff;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .respondent-head {
        display: flex;
        align-items: flex-start;
        gap: 5mm;
        padding-bottom: 4mm;
        border-bottom: 1px dashed var(--line);
        margin-bottom: 4mm;
      }
      .respondent-num {
        flex: 0 0 auto;
        width: 11mm; height: 11mm;
        border-radius: 50%;
        background: var(--accent);
        color: #fff;
        font-weight: 800;
        font-size: 11pt;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .respondent-meta {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 2mm 8mm;
        margin: 0;
      }
      .respondent-meta dt { font-size: 9pt; color: var(--ink-soft); margin: 0; }
      .respondent-meta dd { font-size: 11pt; font-weight: 600; margin: 0; word-break: break-word; }

      .answers { list-style: none; padding: 0; margin: 0; }
      .answer {
        padding: 2mm 0;
        border-bottom: 1px dotted var(--line);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .answer:last-child { border-bottom: none; }
      .answer .q-line {
        display: flex;
        align-items: baseline;
        gap: 2.5mm;
        margin: 0 0 1mm;
      }
      .answer .q-num {
        flex: 0 0 auto;
        min-width: 12mm;
        font-weight: 700;
        color: var(--accent);
        direction: ltr;
        text-align: left;
      }
      .answer .q-text {
        margin: 0;
        font-weight: 700;
        font-size: 10.2pt;
        color: var(--accent);
      }
      .answer .a {
        margin: 0;
        font-size: 10.5pt;
        color: var(--ink);
        white-space: pre-wrap;
        word-break: break-word;
      }
      .answer .a.empty { color: var(--ink-soft); font-style: italic; }

      .doc-foot {
        margin-top: 8mm;
        text-align: center;
        font-size: 9pt;
        color: var(--ink-soft);
      }

      @page { size: A4 portrait; margin: 10mm; }

      @media print {
        body { padding: 0; }
        .respondent { box-shadow: none; }
        .doc-head { margin-bottom: 5mm; padding-bottom: 3mm; }
        .summary { margin: 3mm 0 5mm; }
        .respondent { page-break-inside: avoid; break-inside: avoid; }
        .answer { page-break-inside: avoid; break-inside: avoid; }
      }

      @media screen {
        body { background: #f1f5f9; padding: 24px; }
        .page {
          background: #fff;
          max-width: 210mm;
          margin: 0 auto 16px;
          padding: 14mm 11mm;
          box-shadow: 0 6px 24px rgba(0,0,0,0.08);
          border-radius: 6pt;
        }
        .toolbar {
          max-width: 210mm;
          margin: 0 auto 16px;
          display: flex;
          justify-content: flex-start;
          gap: 8px;
        }
        .toolbar button {
          font-family: inherit;
          font-size: 14px;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid var(--accent);
          background: var(--accent);
          color: #fff;
          cursor: pointer;
        }
        .toolbar button.secondary { background: #fff; color: var(--accent); }
      }
      @media print {
        .toolbar { display: none !important; }
        .page { padding: 0; box-shadow: none; }
      }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <button onclick="window.print()">طباعة / حفظ PDF</button>
      <button class="secondary" onclick="window.close()">إغلاق</button>
    </div>

    <main class="page">
      <header class="doc-head">
        <h1>تقرير نتائج استبيان بنها</h1>
        <p class="sub">نمط عرض رأسي لردود المشاركين</p>
      </header>

      <section class="summary">
        <div class="box"><div class="label">تاريخ التصدير</div><div class="val">${escapeHtml(getFormattedDate())}</div></div>
        <div class="box"><div class="label">إجمالي الردود</div><div class="val">${stats.total ?? rows.length}</div></div>
        <div class="box"><div class="label">معدل الإكمال</div><div class="val">${escapeHtml(completionRate)}</div></div>
        <div class="box"><div class="label">عدد الأسئلة</div><div class="val">${SURVEY_QUESTIONS.length}</div></div>
      </section>

      ${rows.map(respondentCard).join('')}

      <footer class="doc-foot">— نهاية التقرير —</footer>
    </main>
  </body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

const escapeHtml = (val) =>
  String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getFormattedDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export { flattenRecord };
