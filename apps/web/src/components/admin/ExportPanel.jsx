import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileJson, FileText, Download } from 'lucide-react';
import { exportToCSV, exportToJSON, exportToPDF } from '@/services/export';
import { getSurveyResults } from '@/services/api';
import { useSurvey, usePageView } from '@/hooks/useSurvey.js';
import { toast } from 'sonner';

export default function ExportPanel() {
  usePageView('Admin Export');
  const { surveyResults, fetchResults, totalResults } = useSurvey();

  useEffect(() => {
    if (!surveyResults || surveyResults.length === 0) fetchResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    // Pull up to 1000 records for a single export pass.
    const data = await getSurveyResults(1, 1000, '');
    return data?.items || [];
  };

  const handleExport = async (type) => {
    try {
      const records = await fetchAll();
      if (records.length === 0) {
        toast.error('لا توجد بيانات للتصدير');
        return;
      }
      if (type === 'csv') exportToCSV(records);
      if (type === 'json') exportToJSON(records);
      if (type === 'pdf') exportToPDF(records, { total: records.length });
      toast.success(`تم تصدير ${records.length} مشاركة (${type.toUpperCase()})`);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء التصدير');
    }
  };

  const formats = [
    { id: 'csv', label: 'تصدير CSV', desc: 'مناسب لبرامج Excel والجداول', Icon: FileSpreadsheet, bg: 'bg-green-500/10', fg: 'text-green-500' },
    { id: 'json', label: 'تصدير JSON', desc: 'مناسب للمطورين والأنظمة الأخرى', Icon: FileJson, bg: 'bg-yellow-500/10', fg: 'text-yellow-500' },
    { id: 'pdf', label: 'تصدير PDF', desc: 'تقرير جاهز للطباعة والمشاركة', Icon: FileText, bg: 'bg-red-500/10', fg: 'text-red-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">تصدير البيانات</h1>
        <p className="text-sm text-muted-foreground">
          {totalResults > 0
            ? `${totalResults} مشاركة جاهزة للتصدير. كل ملف يحتوي على بيانات التواصل + إجابات الأسئلة العشرين.`
            : 'لا توجد بيانات بعد. الأسئلة كلها هتنزل تلقائيًا في كل ملف لما تتوفر مشاركات.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formats.map(({ id, label, desc, Icon, bg, fg }) => (
          <Card key={id} className="bg-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => handleExport(id)}>
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-8 h-8 ${fg}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
              <Button variant="outline" className="w-full mt-4 border-border/50">
                <Download className="w-4 h-4 ml-2" />
                تحميل
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
