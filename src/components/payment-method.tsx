import { useState } from "react";
import { ArrowRight, Check, CreditCard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { paymentMethods, type PaymentMethodId } from "@/lib/aadl-data";

const iconFor: Record<PaymentMethodId, typeof CreditCard> = {
  golden: CreditCard,
  baridiweb: Globe,
};

export function PaymentMethod({
  initial,
  onBack,
  onSubmit,
}: {
  initial?: PaymentMethodId;
  onBack: () => void;
  onSubmit: (method: PaymentMethodId) => void;
}) {
  const [selected, setSelected] = useState<PaymentMethodId | undefined>(initial);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance text-2xl font-bold text-foreground">
          أدخل وسيلة الدفع التي تأكد أنك صاحب هذا الطلب
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          حدد الطريقة التي تفضل الدفع بها لإتمام العملية.
        </p>
      </div>

      <ul className="flex flex-col gap-3" role="radiogroup" aria-label="طريقة الدفع">
        {paymentMethods.map((method) => {
          const Icon = iconFor[method.id];
          const isSelected = selected === method.id;
          return (
            <li key={method.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(method.id)}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-xl border p-4 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-secondary"
                    : "border-border bg-card hover:border-primary hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-bold text-foreground">{method.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {method.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card",
                  )}
                  aria-hidden="true"
                >
                  {isSelected && <Check className="size-3.5" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button
          type="button"
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected}
          className="flex-1"
        >
          متابعة
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 bg-transparent"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          رجوع
        </Button>
      </div>
    </section>
  );
}
