import React, { useEffect, useState } from 'react';
import { useSurvey, usePageView } from '@/hooks/useSurvey.js';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SURVEY_QUESTIONS, AGE_GROUPS } from '@/utils/constants.js';
import { flattenRecord } from '@/services/export';

export default function ResultsTable() {
  usePageView('Admin Results');
  const {
    surveyResults,
    resultsLoading,
    fetchResults,
    deleteSurvey,
    currentPage,
    setCurrentPage,
    totalResults,
    updateFilters,
  } = useSurvey();

  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchResults(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().replace(/"/g, '');
    if (!term) {
      updateFilters('');
    } else {
      updateFilters(`name ~ "${term}" || phone ~ "${term}"`);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المشاركة؟')) deleteSurvey(id);
  };

  const summarize = (record) => {
    const flat = flattenRecord(record);
    return { ...flat };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">النتائج والمشاركات</h1>
        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالاسم أو الموبايل..."
              className="pr-10 bg-card border-border/50 focus-visible:ring-primary"
            />
          </div>
          <Button type="submit" variant="outline" className="border-border/50 bg-card">بحث</Button>
        </form>
      </div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-right py-4 pr-6">التاريخ</TableHead>
                  <TableHead className="text-right py-4">الاسم</TableHead>
                  <TableHead className="text-right py-4">الموبايل</TableHead>
                  <TableHead className="text-right py-4">العمر</TableHead>
                  <TableHead className="text-right py-4">الإجابات</TableHead>
                  <TableHead className="text-right py-4 pl-6 w-32">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">جاري التحميل...</TableCell>
                  </TableRow>
                ) : surveyResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">لا توجد نتائج حالياً</TableCell>
                  </TableRow>
                ) : (
                  surveyResults.map((result) => {
                    const flat = summarize(result);
                    const innerAnswers = result.answers?.answers || {};
                    const answeredCount = SURVEY_QUESTIONS.filter((q) => {
                      const v = innerAnswers[q.id];
                      if (Array.isArray(v)) return v.length > 0;
                      return v !== undefined && v !== '' && v !== null;
                    }).length;
                    return (
                      <TableRow key={result.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                        <TableCell className="pr-6 font-medium">
                          {new Date(result.created).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>{flat.name || 'مجهول'}</TableCell>
                        <TableCell dir="ltr" className="text-right">{flat.phone || '—'}</TableCell>
                        <TableCell>{flat.ageGroup || '—'}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {answeredCount} / {SURVEY_QUESTIONS.length}
                          </span>
                        </TableCell>
                        <TableCell className="pl-6 flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelected(result)}
                            className="text-foreground hover:bg-primary/10"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(result.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              إجمالي النتائج: <span className="font-medium text-foreground">{totalResults}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || resultsLoading}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="border-border/50"
              >السابق</Button>
              <Button
                variant="outline"
                size="sm"
                disabled={surveyResults.length < 20 || resultsLoading}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="border-border/50"
              >التالي</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل المشاركة</DialogTitle>
          </DialogHeader>
          {selected && (
            <DetailsView record={selected} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailsView({ record }) {
  const wrapper = record.answers || {};
  const reporter = wrapper.reporter || { fullName: record.name, phone: record.phone };
  const answers = wrapper.answers || {};
  const ageLabel = AGE_GROUPS.find((g) => g.id === reporter.ageGroup)?.label || reporter.ageGroup || '—';

  const renderAnswer = (q) => {
    const v = answers[q.id];
    if (v === undefined || v === '' || v === null || (Array.isArray(v) && v.length === 0)) {
      return <span className="text-muted-foreground">—</span>;
    }
    if (q.type === 'single') return q.options?.find((o) => o.id === v)?.label || String(v);
    if (q.type === 'multi') {
      return (Array.isArray(v) ? v : []).map((id) => q.options?.find((o) => o.id === id)?.label || id).join('، ');
    }
    return v;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 p-4 bg-muted/20">
        <h4 className="font-bold mb-3">بيانات التواصل</h4>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-muted-foreground">الاسم</dt><dd>{reporter.fullName || '—'}</dd></div>
          <div><dt className="text-muted-foreground">الموبايل</dt><dd dir="ltr" className="text-right">{reporter.phone || '—'}</dd></div>
          <div><dt className="text-muted-foreground">العمر</dt><dd>{ageLabel}</dd></div>
          <div><dt className="text-muted-foreground">تواصل إضافي</dt><dd>{reporter.optionalContact || '—'}</dd></div>
          <div className="col-span-2"><dt className="text-muted-foreground">تاريخ الإرسال</dt><dd>{new Date(record.created).toLocaleString('ar-EG')}</dd></div>
        </dl>
      </div>
      <div className="space-y-3">
        {SURVEY_QUESTIONS.map((q, i) => (
          <div key={q.id} className="rounded-lg border border-border/50 p-3">
            <p className="text-sm font-semibold mb-1">{i + 1}. {q.text}</p>
            <p className="text-sm text-foreground/80">{renderAnswer(q)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
