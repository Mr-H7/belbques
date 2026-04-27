
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart } from 'lucide-react';
import { usePageView } from '@/hooks/useSurvey.js';

export default function AnalyticsPanel() {
  usePageView('Admin Analytics');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground mb-8">التحليلات المتقدمة</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              توزيع الإجابات
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-border/20 mt-4 bg-muted/10 rounded-b-xl">
            <p className="text-muted-foreground">مخطط توزيع الإجابات (سيتم تفعيله بربط بيانات Recharts)</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              معدل الزيارات اليومي
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-border/20 mt-4 bg-muted/10 rounded-b-xl">
            <p className="text-muted-foreground">مسار الزيارات على مدار الشهر</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">الخريطة الحرارية لتفاعل المستخدمين</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center bg-muted/10 rounded-xl mt-2 border border-border/20">
          <p className="text-muted-foreground">تحليل مناطق التركيز والأسئلة الأكثر تخطياً</p>
        </CardContent>
      </Card>
    </div>
  );
}
