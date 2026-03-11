interface PageHeaderProps {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
        <h1 className="mt-1 font-heading text-3xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
