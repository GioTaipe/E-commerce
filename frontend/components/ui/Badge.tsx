interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "sale";
}

export default function Badge({ children, variant = "new" }: BadgeProps) {
  const styles =
    variant === "sale"
      ? "bg-accent text-white"
      : "bg-white text-[#1d1d1f]";

  return (
    <span
      className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] ${styles}`}
    >
      {children}
    </span>
  );
}
