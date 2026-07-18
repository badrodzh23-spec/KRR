import { Building2 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Building2 className="size-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold leading-tight text-foreground">
            متابعة ملف عدل
          </span>
          <span className="text-xs text-muted-foreground">
            الوكالة الوطنية لتحسين السكن وتطويره — AADL
          </span>
        </div>
      </div>
    </header>
  );
}
