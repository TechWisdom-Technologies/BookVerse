import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  centered?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  className = "",
  centered = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2
      className={`animate-spin text-zinc-400 ${sizeMap[size]} ${className}`}
    />
  );

  if (centered) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
