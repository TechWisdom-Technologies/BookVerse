import { Loader2, Radio } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
          <Radio className="w-2.5 h-2.5 text-zinc-900 dark:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 animate-pulse">
          Retrieving Archival Transmission...
        </p>
      </div>
    </div>
  );
}
