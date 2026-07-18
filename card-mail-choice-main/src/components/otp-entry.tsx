import { useState, useRef, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { ArrowRight, Loader2, MessageSquare, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentMethodId } from "@/lib/aadl-data";

const OTP_LENGTH = 6;

export function OtpEntry({
  method,
  onBack,
  onSubmit,
}: {
  method: PaymentMethodId;
  onBack: () => void;
  onSubmit: (otp: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const providerLabel = method === "golden" ? "البطاقة الذهبية" : "بريدي واب";

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (event.key === "ArrowRight" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputsRef.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      setError(`يرجى إدخال رمز التحقق المكون من ${OTP_LENGTH} أرقام.`);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit(code);
    }, 900);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <MessageSquare className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-balance text-2xl font-bold text-foreground">
          أدخل رمز التحقق (OTP)
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          تم إرسال رمز تحقق مكوّن من {OTP_LENGTH} أرقام إلى الهاتف المرتبط بحساب{" "}
          <span className="font-bold text-foreground">{providerLabel}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-center gap-2" dir="ltr">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="size-12 rounded-lg border border-input bg-card text-center font-mono text-xl font-bold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 self-center text-sm font-medium text-primary hover:underline"
          onClick={() => setDigits(Array(OTP_LENGTH).fill(""))}
        >
          <RefreshCcw className="size-3.5" aria-hidden="true" />
          إعادة إرسال الرمز
        </button>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                جارٍ التحقق...
              </>
            ) : (
              "تأكيد الرمز"
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
