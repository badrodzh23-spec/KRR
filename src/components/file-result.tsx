import {
  CalendarClock,
  Check,
  MapPin,
  Hash,
  RotateCcw,
  Phone,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  lookupFile,
  statusMeta,
  problems,
  paymentMethods,
  type PaymentMethodId,
} from "@/lib/aadl-data";
import type { PaymentDetails } from "@/components/payment-details";

const toneClasses: Record<string, string> = {
  accent: "bg-accent/15 text-accent border-accent/30",
  primary: "bg-primary/10 text-primary border-primary/30",
  warning: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
};

export function FileResult({
  serial,
  problemId,
  paymentMethodId,
  paymentDetails,
  onReset,
}: {
  serial: string;
  problemId: string;
  paymentMethodId?: PaymentMethodId;
  paymentDetails?: PaymentDetails;
  onReset: () => void;
}) {
  const file = lookupFile(serial);
  const meta = statusMeta[file.status];
  const problem = problems.find((p) => p.id === problemId);
  const payment = paymentMethods.find((m) => m.id === paymentMethodId);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance text-2xl font-bold text-foreground">حالة ملفك</h1>
        <p className="text-sm text-muted-foreground">
          الرقم التسلسلي: <span className="font-mono" dir="ltr">{serial}</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <span className="font-bold text-foreground">{file.fullName}</span>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-bold",
              toneClasses[meta.tone],
            )}
          >
            {meta.label}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-px bg-border">
          <Info icon={Hash} label="الترتيب في القائمة" value={`رقم ${file.ranking}`} />
          <Info icon={MapPin} label="الولاية" value={file.wilaya} />
          <Info icon={CalendarClock} label="تاريخ الإيداع" value={file.submissionDate} />
          <Info icon={RotateCcw} label="آخر تحديث" value={file.lastUpdate} />
        </dl>
      </div>

      <div className={cn("rounded-lg border p-4 text-sm font-medium", toneClasses[meta.tone])}>
        {meta.note}
      </div>

      {payment && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">طريقة الدفع المختارة</span>
              <span className="font-bold text-foreground">{payment.title}</span>
            </div>
          </div>
          {paymentDetails?.method === "golden" && (
            <dl className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
              <PayInfo label="رقم البطاقة" value={maskCard(paymentDetails.cardNumber)} />
              <PayInfo label="صاحب البطاقة" value={paymentDetails.cardHolder} />
              <PayInfo label="تاريخ الانتهاء" value={paymentDetails.expiry} />
              <PayInfo label="رقم الهاتف" value={paymentDetails.phone} />
            </dl>
          )}
          {paymentDetails?.method === "baridiweb" && (
            <dl className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
              <PayInfo
                label="الحساب البريدي"
                value={`${paymentDetails.ccp} / ${paymentDetails.key}`}
              />
              <PayInfo label="الاسم" value={paymentDetails.fullName} />
              <PayInfo label="الهاتف" value={paymentDetails.phone} />
            </dl>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 font-bold text-foreground">مراحل معالجة الملف</h2>
        <ol className="flex flex-col gap-4">
          {file.steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  step.done
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {step.done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  step.done ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {problem && (
        <div className="rounded-xl border border-border bg-secondary p-4">
          <h2 className="mb-1 font-bold text-foreground">بخصوص: {problem.title}</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            تم تسجيل طلبك وسيتم التواصل معك في حال الحاجة لمعلومات إضافية. يمكنك أيضاً
            التواصل مع مصلحة الزبائن للاستفسار.
          </p>
          <a
            href="tel:1100"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <Phone className="size-4" aria-hidden="true" />
            الاتصال بمصلحة الزبائن: 1100
          </a>
        </div>
      )}

      <Button type="button" variant="outline" onClick={onReset} className="bg-transparent">
        <RotateCcw className="size-4" aria-hidden="true" />
        متابعة ملف آخر
      </Button>
    </section>
  );
}

function PayInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold text-foreground">{value}</dd>
    </div>
  );
}

function maskCard(v: string) {
  const digits = v.replace(/\D/g, "");
  if (digits.length < 4) return v;
  return "•••• •••• •••• " + digits.slice(-4);
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-card p-4">
      <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-bold text-foreground">{value}</dd>
      </div>
    </div>
  );
}
