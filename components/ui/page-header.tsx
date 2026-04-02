type PageHeaderProps = {
  badge: string;
  title: string;
  description: string;
};

export function PageHeader({ badge, title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl space-y-4">
      <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-900">
        {badge}
      </span>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
      </div>
    </header>
  );
}
