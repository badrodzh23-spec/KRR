import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { problems } from "@/lib/aadl-data";

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

  const problem = problems.find((p) => p.id === problemId);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
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

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance text-2xl font-bold text-foreground">
          أدخل الرقم التسلسلي لملفك
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          الرقم التسلسلي موجود على وصل الاكتتاب الخاص بك في برنامج عدل.
        </p>
      </div>

      {problem && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3 text-sm">
          <span className="font-medium text-muted-foreground">المشكل المحدد:</span>
          <span className="font-bold text-foreground">{problem.title}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

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
