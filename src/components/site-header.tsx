export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
        <img
          src="/aadl-logo.png"
          alt="شعار الوكالة الوطنية لتحسين السكن وتطويره AADL"
          className="h-12 w-12 object-contain"
        />
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
