import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { ArrowRight, Loader2, MessageSquare, RefreshCcw, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentMethodId } from "@/lib/aadl-data";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 120; // دقيقتان
const MAX_ATTEMPTS = 6; // 6 محاولات

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
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const providerLabel = method === "golden" ? "البطاقة الذهبية" : "بريدي واب";

  // Timer effect
  useEffect(() => {
    if (isExpired || timeLeft === 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsExpired(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired, timeLeft]);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function resetTimer() {
    setTimeLeft(OTP_EXPIRY_SECONDS);
    setIsExpired(false);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setAttempts(0);
    setMaxAttemptsReached(false);
  }

  function handleAttemptFailed() {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      setMaxAttemptsReached(true);
      setError(`انتهت المحاولات المسموحة (${MAX_ATTEMPTS} محاولات). يرجى الاتصال بالدعم.`);
    } else {
      setError(`رمز غير صحيح. المحاولة ${newAttempts} من ${MAX_ATTEMPTS}`);
    }
  }

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
    
    if (maxAttemptsReached) {
      setError(`انتهت المحاولات المسموحة (${MAX_ATTEMPTS} محاولات). يرجى الاتصال بالدعم.`);
      return;
    }

    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      setError(`يرجى إدخال رمز التحقق المكون من ${OTP_LENGTH} أرقام.`);
      return;
    }

    // Simulate verification - in production this would call a backend API
    const isCorrect = code === "123456"; // Mock verification

    if (!isCorrect) {
      handleAttemptFailed();
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
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
          ستصلك رسالة نصية خلال دقيقتين تحتوي على رمز التحقق المكون من {OTP_LENGTH} أرقام إلى الهاتف المرتبط بحساب{" "}
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
              disabled={isExpired}
              className="size-12 rounded-lg border border-input bg-card text-center font-mono text-xl font-bold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        {/* Timer Display */}
        <div className="flex items-center justify-center gap-2">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          <span className={`text-sm font-semibold ${
            timeLeft <= 30 ? "text-destructive" : "text-primary"
          }`}>
            الوقت المتبقي: {formatTime(timeLeft)}
          </span>
        </div>

        {/* Attempts Counter */}
        {attempts > 0 && !maxAttemptsReached && (
          <div className="text-center text-sm font-medium text-muted-foreground">
            المحاولات المتبقية: {MAX_ATTEMPTS - attempts} من {MAX_ATTEMPTS}
          </div>
        )}

        {/* Max Attempts Reached */}
        {maxAttemptsReached && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex items-center gap-2">
            <AlertCircle className="size-5 text-destructive flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-destructive">
              انتهت جميع المحاولات المسموحة. يرجى الاتصال بالدعم.
            </p>
          </div>
        )}

        {/* Expiration Message */}
        {isExpired && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex items-center gap-2">
            <AlertCircle className="size-5 text-destructive flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-destructive">
              انتهت صلاحية الرمز. يرجى طلب رمز جديد لإعادة المحاولة.
            </p>
          </div>
        )}

        {error && (
          <p className="text-center text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 self-center text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={resetTimer}
          disabled={!isExpired && timeLeft > 30}
        >
          <RefreshCcw className="size-3.5" aria-hidden="true" />
          إعادة إرسال الرمز
        </button>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button 
            type="submit" 
            disabled={loading || isExpired || maxAttemptsReached || digits.join("").length !== OTP_LENGTH}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                جارٍ التحقق...
              </>
            ) : maxAttemptsReached ? (
              "انتهت المحاولات"
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
