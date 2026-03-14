type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-white/70 p-6 shadow-panel backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">{title}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
