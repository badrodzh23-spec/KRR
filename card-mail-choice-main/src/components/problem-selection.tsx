import { ChevronLeft } from "lucide-react";
import { problems } from "@/lib/aadl-data";

export function ProblemSelection({
  onSelect,
}: {
  onSelect: (problemId: string) => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance text-2xl font-bold text-foreground">
          ما هو المشكل الذي تواجهه؟
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          اختر نوع المشكل المتعلق بملفك في برنامج عدل لنساعدك في متابعته وحله.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {problems.map((problem) => {
          const Icon = problem.icon;
          return (
            <li key={problem.id}>
              <button
                type="button"
                onClick={() => onSelect(problem.id)}
                className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-bold text-foreground">
                    {problem.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {problem.description}
                  </span>
                </span>
                <ChevronLeft
                  className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
