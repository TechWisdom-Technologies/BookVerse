import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 p-16 text-center rounded">
      <Icon className="h-12 w-12 text-zinc-100 dark:text-zinc-800 mb-8" />
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="max-w-xs text-[11px] font-medium text-zinc-500 dark:text-zinc-400 italic mb-10 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:opacity-90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
