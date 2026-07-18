import { useState, type FormEvent } from "react";
import { ArrowRight, CreditCard, Globe, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentMethodId } from "@/lib/aadl-data";

export type PaymentDetails =
  | {
      method: "golden";
      cardNumber: string;
      cardHolder: string;
      expiry: string;
      phone: string;
    }
  | {
      method: "baridiweb";
      ccp: string;
      key: string;
      fullName: string;
      phone: string;
    };

export function PaymentDetailsForm({
  method,
  onBack,
  onSubmit,
}: {
  method: PaymentMethodId;
  onBack: () => void;
  onSubmit: (details: PaymentDetails) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Golden card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [goldenPhone, setGoldenPhone] = useState("");

  // BaridiWeb fields
  const [ccp, setCcp] = useState("");
  const [key, setKey] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  function formatCardNumber(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const errs: Record<string, string> = {};

    if (method === "golden") {
      if (cardNumber.replace(/\D/g, "").length !== 16)
        errs.cardNumber = "رقم البطاقة يجب أن يتكون من 16 رقمًا.";
      if (cardHolder.trim().length < 3)
        errs.cardHolder = "يرجى إدخال اسم صاحب البطاقة.";
      if (!/^\d{2}\/\d{2}$/.test(expiry))
        errs.expiry = "صيغة تاريخ الانتهاء غير صحيحة (MM/YY).";
      if (goldenPhone.replace(/\D/g, "").length < 9)
        errs.goldenPhone = "رقم الهاتف غير صحيح.";
    } else {
      if (ccp.replace(/\D/g, "").length < 6)
        errs.ccp = "رقم الحساب البريدي غير صحيح.";
      if (!/^\d{2}$/.test(key)) errs.key = "المفتاح يجب أن يكون رقمين.";
      if (fullName.trim().length < 3) errs.fullName = "يرجى إدخال الاسم الكامل.";
      if (phone.replace(/\D/g, "").length < 9)
        errs.phone = "رقم الهاتف غير صحيح.";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (method === "golden") {
        onSubmit({ method: "golden", cardNumber, cardHolder, expiry, phone: goldenPhone });
      } else {
        onSubmit({ method: "baridiweb", ccp, key, fullName, phone });
      }
    }, 800);
  }

  const isGolden = method === "golden";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance text-2xl font-bold text-foreground">
          {isGolden ? "معلومات البطاقة الذهبية" : "معلومات حساب بريدي واب"}
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          {isGolden
            ? "أدخل بيانات بطاقتك الذهبية لإتمام عملية الدفع."
            : "أدخل بيانات حسابك البريدي لإتمام عملية الدفع عبر بريدي واب."}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3 text-sm">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {isGolden ? (
            <CreditCard className="size-4" aria-hidden="true" />
          ) : (
            <Globe className="size-4" aria-hidden="true" />
          )}
        </span>
        <span className="font-bold text-foreground">
          {isGolden ? "البطاقة الذهبية" : "بريدي واب"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isGolden ? (
          <>
            <Field
              id="cardNumber"
              label="رقم البطاقة"
              error={errors.cardNumber}
              input={
                <input
                  id="cardNumber"
                  inputMode="numeric"
                  dir="ltr"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className={inputClass}
                />
              }
            />
            <Field
              id="cardHolder"
              label="اسم صاحب البطاقة"
              error={errors.cardHolder}
              input={
                <input
                  id="cardHolder"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="AHMED BENALI"
                  className={inputClass}
                />
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="expiry"
                label="تاريخ الانتهاء"
                error={errors.expiry}
                input={
                  <input
                    id="expiry"
                    inputMode="numeric"
                    dir="ltr"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className={inputClass}
                  />
                }
              />
              <Field
                id="goldenPhone"
                label="رقم الهاتف"
                error={errors.goldenPhone}
                input={
                  <input
                    id="goldenPhone"
                    inputMode="tel"
                    dir="ltr"
                    value={goldenPhone}
                    onChange={(e) => setGoldenPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="0555555555"
                    className={inputClass}
                  />
                }
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Field
                id="ccp"
                label="رقم الحساب البريدي (CCP)"
                error={errors.ccp}
                input={
                  <input
                    id="ccp"
                    inputMode="numeric"
                    dir="ltr"
                    value={ccp}
                    onChange={(e) => setCcp(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    placeholder="0000000000"
                    className={inputClass}
                  />
                }
              />
              <Field
                id="key"
                label="المفتاح"
                error={errors.key}
                input={
                  <input
                    id="key"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={2}
                    value={key}
                    onChange={(e) => setKey(e.target.value.replace(/\D/g, ""))}
                    placeholder="00"
                    className={`${inputClass} w-20`}
                  />
                }
              />
            </div>
            <Field
              id="fullName"
              label="الاسم الكامل لصاحب الحساب"
              error={errors.fullName}
              input={
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أحمد بن علي"
                  className={inputClass}
                />
              }
            />
            <Field
              id="phone"
              label="رقم الهاتف المرتبط بالحساب"
              error={errors.phone}
              input={
                <input
                  id="phone"
                  inputMode="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="0555555555"
                  className={inputClass}
                />
              }
            />
          </>
        )}

        <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            يتم تشفير معلومات الدفع الخاصة بك ولا يتم تخزينها على خوادمنا.
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                جارٍ التأكيد...
              </>
            ) : (
              "تأكيد الدفع"
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

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring";

function Field({
  id,
  label,
  error,
  input,
}: {
  id: string;
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {input}
      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
