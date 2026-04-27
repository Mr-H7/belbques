
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSurveyStats } from '@/services/api';
import { Users, CheckCircle2, Clock, Activity } from 'lucide-react';
import { usePageView } from '@/hooks/useSurvey.js';

export default function AdminDashboard() {
  usePageView('Admin Dashboard');
  const [stats, setStats] = useState({ total: 0, completionRate: '0.0', avgTime: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSurveyStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { title: 'إجمالي المشاركات', value: stats.total, icon: Users, desc: 'منذ إطلاق الاستبيان' },
    { title: 'معدل الإكمال', value: `${stats.completionRate}%`, icon: CheckCircle2, desc: 'من إجمالي الزيارات' },
    { title: 'متوسط وقت الإكمال', value: stats.avgTime || '—', icon: Clock, desc: 'سيُحسب لاحقًا (لم يُسجَّل بعد)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">نظرة عامة</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-2">{stat.desc}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">نشاط الاستبيان</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center text-muted-foreground flex-col gap-4">
            <Activity className="w-12 h-12 opacity-20" />
            <p>رسم بياني للنشاط سيظهر هنا (مساحة مخصصة لـ Recharts)</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">أحدث المشاركات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Users className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">مشارك #{Math.floor(Math.random() * 1000)}</p>
                      <p className="text-xs text-muted-foreground">قبل {i * 2} ساعات</p>
                    </div>
                  </div>
                  <div className="text-sm text-primary font-medium">مكتمل</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
