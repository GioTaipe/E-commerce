interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "sale";
}

export default function Badge({ children, variant = "new" }: BadgeProps) {
  const styles =
    variant === "sale"
      ? "bg-accent text-white"
      : "bg-dark text-white";

  return (
    <span
      className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${styles}`}
    >
      {children}
    </span>
  );
}
