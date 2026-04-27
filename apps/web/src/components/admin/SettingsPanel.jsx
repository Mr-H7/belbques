import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePageView } from '@/hooks/useSurvey.js';
import { useAuth } from '@/hooks/useAuth.js';
import { useAppSettings } from '@/context/AppSettingsContext.jsx';
import {
  saveGeneral,
  saveSurveyState,
  listAdmins,
  createAdmin,
  deleteAdmin,
  updateOwnAccount,
} from '@/services/settings';
import { Settings as SettingsIcon, Shield, ToggleLeft, UserCog, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_CLOSED_MESSAGE = 'الاستبيان مغلق حالياً';

export default function SettingsPanel() {
  usePageView('Admin Settings');
  const { currentAdmin } = useAuth();
  const { general, surveyState, refresh } = useAppSettings();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">الإعدادات</h1>

      <GeneralSection initial={general} onSaved={refresh} />
      <SurveyStateSection initial={surveyState} onSaved={refresh} />
      <AccountSection currentAdmin={currentAdmin} />
      <AdminsSection currentAdmin={currentAdmin} />
    </div>
  );
}

/* ───────────── General ───────────── */

function GeneralSection({ initial, onSaved }) {
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initial.title);
    setSubtitle(initial.subtitle);
  }, [initial.title, initial.subtitle]);

  const dirty = title !== initial.title || subtitle !== initial.subtitle;

  const handleSave = async () => {
    if (!title.trim()) return toast.error('عنوان الاستبيان لا يمكن أن يكون فارغًا');
    if (!subtitle.trim()) return toast.error('الوصف لا يمكن أن يكون فارغًا');
    setSaving(true);
    try {
      const res = await saveGeneral({ title: title.trim(), subtitle: subtitle.trim() });
      if (!res.ok) {
        toast.error(res.error?.message || 'فشل حفظ الإعدادات');
        return;
      }
      if (res.persisted) toast.success('تم حفظ الإعدادات');
      else toast.success('حُفظ محليًا — السيرفر غير متاح حاليًا');
      onSaved();
    } catch (err) {
      toast.error(err?.message || 'فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" />
          إعدادات الاستبيان العامة
        </CardTitle>
        <CardDescription>عنوان الاستبيان والوصف الظاهر في الصفحة الرئيسية.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="survey-title">عنوان الاستبيان</Label>
          <Input
            id="survey-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border/50 focus-visible:ring-primary"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="survey-desc">الوصف / رسالة الترحيب</Label>
          <Input
            id="survey-desc"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="bg-background border-border/50 focus-visible:ring-primary"
          />
        </div>
        <Button onClick={handleSave} disabled={!dirty || saving} className="mt-2">
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ───────────── Survey state (open/closed) ───────────── */

function SurveyStateSection({ initial, onSaved }) {
  const [open, setOpen] = useState(initial.open);
  const [closedMessage, setClosedMessage] = useState(initial.closedMessage);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setOpen(!!initial.open);
    setClosedMessage(initial.closedMessage || '');
  }, [initial.open, initial.closedMessage]);

  const dirty = open !== initial.open || closedMessage !== initial.closedMessage;

  const handleSave = async () => {
    if (!open && !closedMessage.trim()) {
      return toast.error('اكتب رسالة تظهر للزوار عند إغلاق الاستبيان');
    }
    setSaving(true);
    try {
      const payload = {
        open,
        closedMessage: open ? DEFAULT_CLOSED_MESSAGE : closedMessage.trim(),
      };
      const res = await saveSurveyState(payload);
      if (!res.ok) {
        toast.error(res.error?.message || 'فشل حفظ حالة الاستبيان');
        return;
      }
      if (res.persisted) toast.success(open ? 'الاستبيان مفتوح للزوار الآن' : 'الاستبيان مُغلق للزوار الآن');
      else toast.success('حُفظ محليًا — السيرفر غير متاح حاليًا');
      onSaved();
    } catch (err) {
      toast.error(err?.message || 'فشل حفظ حالة الاستبيان');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ToggleLeft className="w-5 h-5 text-primary" />
          حالة الاستبيان
        </CardTitle>
        <CardDescription>افتح أو أغلق الاستبيان للجمهور بدون نشر إصدار جديد من الموقع.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-muted/20 border border-border/50 p-4">
          <div>
            <p className="font-medium">{open ? 'الاستبيان مفتوح' : 'الاستبيان مغلق'}</p>
            <p className="text-sm text-muted-foreground">
              {open ? 'الزوار يقدرون يجاوبوا ويرسلوا.' : 'الزوار هيشوفوا رسالة الإغلاق فقط.'}
            </p>
          </div>
          <Switch checked={open} onCheckedChange={setOpen} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="closed-msg">رسالة الإغلاق</Label>
          <Input
            id="closed-msg"
            value={closedMessage}
            onChange={(e) => setClosedMessage(e.target.value)}
            disabled={open}
            placeholder={DEFAULT_CLOSED_MESSAGE}
            className="bg-background border-border/50 focus-visible:ring-primary disabled:opacity-60"
          />
        </div>
        <Button onClick={handleSave} disabled={!dirty || saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ الحالة'}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ───────────── Account (own email + password) ───────────── */

function AccountSection({ currentAdmin }) {
  const [email, setEmail] = useState(currentAdmin?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setEmail(currentAdmin?.email || ''); }, [currentAdmin?.email]);

  const handleSave = async () => {
    if (!currentAdmin?.id) return;
    const nextEmail = email.trim();
    if (!nextEmail) return toast.error('البريد الإلكتروني مطلوب');
    if (!EMAIL_RE.test(nextEmail)) return toast.error('بريد إلكتروني غير صحيح');
    const wantsPasswordChange = newPassword.length > 0 || confirm.length > 0 || oldPassword.length > 0;
    const emailChanged = nextEmail !== currentAdmin.email;
    if (wantsPasswordChange) {
      if (newPassword.length < 8) return toast.error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      if (newPassword !== confirm) return toast.error('تأكيد كلمة المرور غير مطابق');
      if (!oldPassword) return toast.error('أدخل كلمة المرور الحالية لتأكيد التغيير');
    }
    if (!emailChanged && !wantsPasswordChange) {
      return toast.error('لا توجد تغييرات للحفظ');
    }
    setSaving(true);
    try {
      await updateOwnAccount({
        id: currentAdmin.id,
        email: emailChanged ? nextEmail : undefined,
        oldPassword: wantsPasswordChange ? oldPassword : undefined,
        newPassword: wantsPasswordChange ? newPassword : undefined,
      });
      setEmail(nextEmail);
      toast.success('تم تحديث الحساب');
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'فشل التحديث');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="w-5 h-5 text-primary" />
          الحساب الشخصي
        </CardTitle>
        <CardDescription>غيّر بريدك الإلكتروني أو كلمة المرور.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="acc-email">البريد الإلكتروني</Label>
          <Input id="acc-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background border-border/50 focus-visible:ring-primary text-left" />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="acc-old">كلمة المرور الحالية</Label>
            <Input id="acc-old" type="password" dir="ltr" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="bg-background border-border/50 focus-visible:ring-primary text-left" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="acc-new">كلمة المرور الجديدة</Label>
            <Input id="acc-new" type="password" dir="ltr" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-background border-border/50 focus-visible:ring-primary text-left" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="acc-confirm">تأكيد كلمة المرور</Label>
            <Input id="acc-confirm" type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-background border-border/50 focus-visible:ring-primary text-left" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'تحديث الحساب'}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ───────────── Admins (list / add / delete) ───────────── */

function AdminsSection({ currentAdmin }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    if (!currentAdmin?.id) return;
    setLoading(true);
    try {
      setAdmins(await listAdmins());
    } catch (err) {
      console.error('Failed to load admin users list:', err);
      toast.error(err?.message || 'فشل تحميل قائمة المدراء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // intentionally tied to current admin readiness so we don't call before auth
    // model is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAdmin?.id]);

  const handleAdd = async () => {
    const email = newEmail.trim();
    if (!email) return toast.error('البريد الإلكتروني مطلوب');
    if (!EMAIL_RE.test(email)) return toast.error('بريد إلكتروني غير صحيح');
    if (newPassword.length < 8) return toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    if (newPassword !== confirm) return toast.error('تأكيد كلمة المرور غير مطابق');
    setCreating(true);
    try {
      await createAdmin({ email, password: newPassword });
      toast.success('تمت إضافة المدير الجديد');
      setNewEmail(''); setNewPassword(''); setConfirm(''); setShowAdd(false);
      await refresh();
    } catch (err) {
      console.error('Failed to create admin user:', err);
      toast.error(err?.message || 'فشل الإضافة');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (admin) => {
    if (admin.id === currentAdmin?.id) {
      toast.error('لا يمكنك حذف حسابك الحالي');
      return;
    }
    if (!window.confirm(`حذف ${admin.email}؟`)) return;
    try {
      await deleteAdmin(admin.id);
      toast.success('تم الحذف');
      await refresh();
    } catch (err) {
      console.error('Failed to delete admin user:', err);
      toast.error(err?.message || 'فشل الحذف');
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            إدارة المدراء
          </CardTitle>
          <CardDescription>أضف، اعرض، أو احذف حسابات لوحة التحكم.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setShowAdd((v) => !v)} variant={showAdd ? 'outline' : 'default'}>
          <Plus className="w-4 h-4 ml-1" />
          {showAdd ? 'إلغاء' : 'إضافة مدير'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showAdd && (
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="new-email">بريد المدير الجديد</Label>
              <Input id="new-email" type="email" dir="ltr" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="bg-background border-border/50 text-left" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="new-pass">كلمة المرور</Label>
                <Input id="new-pass" type="password" dir="ltr" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-background border-border/50 text-left" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-confirm">تأكيد</Label>
                <Input id="new-confirm" type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-background border-border/50 text-left" />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={creating}>
              {creating ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground py-3">جاري التحميل...</p>
        ) : admins.length === 0 ? (
          <p className="text-sm text-muted-foreground py-3">لا يوجد مدراء بعد.</p>
        ) : (
          <ul className="divide-y divide-border/50 rounded-xl border border-border/50">
            {admins.map((a) => {
              const isMe = a.id === currentAdmin?.id;
              return (
                <li key={a.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium" dir="ltr">{a.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.role === 'admin' ? 'صلاحيات كاملة' : 'عرض فقط'}{isMe ? ' • أنت' : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(a)}
                    disabled={isMe}
                    className="text-destructive hover:bg-destructive/10 disabled:opacity-30"
                    title={isMe ? 'لا يمكن حذف حسابك الحالي' : 'حذف'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
