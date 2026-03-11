interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export default function Loader({ size = "md", text }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`animate-spin rounded-full border-surface border-t-accent ${sizes[size]}`}
        role="status"
      >
        <span className="sr-only">Cargando...</span>
      </div>
      {text && <p className="text-sm text-muted">{text}</p>}
    </div>
  );
}
