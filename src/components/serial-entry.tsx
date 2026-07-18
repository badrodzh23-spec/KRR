import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Loader2, ShieldCheck, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { problems } from "@/lib/aadl-data";

type RegistrationData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  wilaya: string;
  maritalStatus: string;
};

export function SerialEntry({
  problemId,
  onBack,
  onSubmit,
}: {
  problemId: string;
  onBack: () => void;
  onSubmit: (serial: string) => void;
}) {
  const [serial, setSerial] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    wilaya: "",
    maritalStatus: "",
  });

  const problem = problems.find((p) => p.id === problemId);
  const isRegistration = problemId === "registration";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    if (isRegistration) {
      if (!registration.firstName.trim()) {
        setError("يرجى إدخال الاسم الأول.");
        return;
      }
      if (!registration.lastName.trim()) {
        setError("يرجى إدخال اللقب.");
        return;
      }
      if (!registration.birthDate) {
        setError("يرجى اختيار تاريخ الميلاد.");
        return;
      }
      if (!registration.wilaya) {
        setError("يرجى اختيار الولاية.");
        return;
      }
      if (!registration.maritalStatus) {
        setError("يرجى اختيار الحالة الاجتماعية.");
        return;
      }
      
      const registrationStr = `${registration.firstName}-${registration.lastName}-${registration.birthDate}-${registration.wilaya}-${registration.maritalStatus}`;
      setError("");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSubmit(registrationStr);
      }, 700);
    } else {
      const clean = serial.trim();
      if (clean.replace(/\D/g, "").length < 6) {
        setError("يرجى إدخال رقم تسلسلي صحيح (6 أرقام على الأقل).");
        return;
      }
      setError("");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSubmit(clean);
      }, 700);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance text-2xl font-bold text-foreground">
          {isRegistration ? "البيانات الشخصية" : "أدخل الرقم التسلسلي لملفك"}
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          {isRegistration 
            ? "أدخل بياناتك الشخصية للتسجيل الجديد في برنامج عدل"
            : "الرقم التسلسلي موجود على وصل الاكتتاب الخاص بك في برنامج عدل."}
        </p>
      </div>

      {problem && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3 text-sm">
          <span className="font-medium text-muted-foreground">المشكل المحدد:</span>
          <span className="font-bold text-foreground">{problem.title}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegistration ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  الاسم الأول
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={registration.firstName}
                  onChange={(e) => setRegistration({...registration, firstName: e.target.value})}
                  placeholder="أحمد"
                  className="rounded-lg border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  اللقب
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={registration.lastName}
                  onChange={(e) => setRegistration({...registration, lastName: e.target.value})}
                  placeholder="محمد"
                  className="rounded-lg border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="birthDate" className="text-sm font-medium text-foreground">
                تاريخ الميلاد
              </label>
              <input
                id="birthDate"
                type="date"
                value={registration.birthDate}
                onChange={(e) => setRegistration({...registration, birthDate: e.target.value})}
                className="rounded-lg border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="wilaya" className="text-sm font-medium text-foreground">
                الولاية
              </label>
              <select
                id="wilaya"
                value={registration.wilaya}
                onChange={(e) => setRegistration({...registration, wilaya: e.target.value})}
                className="rounded-lg border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
              >
                <option value="">اختر الولاية</option>
                <option value="الجزائر">الجزائر</option>
                <option value="أرزيو">أرزيو</option>
                <option value="تيبازة">تيبازة</option>
                <option value="البليدة">البليدة</option>
                <option value="البويرة">البويرة</option>
                <option value="تامنغست">تاسيلي</option>
                <option value="تمنراست">تمنراست</option>
                <option value="الشلف">الشلف</option>
                <option value="الأغواط">الأغواط</option>
                <option value="البيض">البيض</option>
                <option value="باتنة">باتنة</option>
                <option value="بجاية">بجاية</option>
                <option value="بسكرة">بسكرة</option>
                <option value="بئر الجاج">بئر الجاج</option>
                <option value="بليدة">بليدة</option>
                <option value="تيسمسيلت">تيسمسيلت</option>
                <option value="تيبازة">تيبازة</option>
                <option value="قسنطينة">قسنطينة</option>
                <option value="جيجل">جيجل</option>
                <option value="سطيف">سطيف</option>
                <option value="سعيدة">سعيدة</option>
                <option value="سكيكدة">سكيكدة</option>
                <option value="سيدي بلعباس">سيدي بلعباس</option>
                <option value="عنابة">عنابة</option>
                <option value="قالمة">قالمة</option>
                <option value="قرقودة">قرقودة</option>
                <option value="غليزان">غليزان</option>
                <option value="معسكر">معسكر</option>
                <option value="مستغانم">مستغانم</option>
                <option value="ميلة">ميلة</option>
                <option value="موقدم">موقدم</option>
                <option value="ندرومة">ندرومة</option>
                <option value="وادي سوف">وادي سوف</option>
                <option value="وهران">وهران</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="maritalStatus" className="text-sm font-medium text-foreground">
                الحالة الاجتماعية
              </label>
              <select
                id="maritalStatus"
                value={registration.maritalStatus}
                onChange={(e) => setRegistration({...registration, maritalStatus: e.target.value})}
                className="rounded-lg border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
              >
                <option value="">اختر الحالة</option>
                <option value="أعزب">أعزب</option>
                <option value="متزوج">متزوج</option>
                <option value="مطلق">مطلق</option>
              </select>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <label htmlFor="serial" className="text-sm font-medium text-foreground">
              الرقم التسلسلي
            </label>
            <div className="relative">
              <KeyRound
                className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="serial"
                inputMode="numeric"
                dir="ltr"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="0000 0000 0000"
                className="w-full rounded-lg border border-input bg-card py-3 pr-11 pl-4 text-center font-mono text-lg tracking-widest text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            بياناتك تُستخدم فقط للاطلاع على حالة ملفك ولا تتم مشاركتها مع أي جهة خارجية.
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                جارٍ البحث...
              </>
            ) : (
              "متابعة"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
            className="flex-1 bg-transparent"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            رجوع
          </Button>
        </div>
      </form>
    </section>
  );
}
