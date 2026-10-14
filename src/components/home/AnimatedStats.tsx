"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function formatNumber(value: number) {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  }
  return Math.floor(value).toString() + (value > 0 ? "+" : "");
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = formatNumber(v);
        },
      });
      return () => controls.stop();
    }
  }, [value, inView]);

  return <div ref={ref} className="text-xl font-bold tracking-tighter">0+</div>;
}

export function AnimatedStats({ stats }: { stats: { label: string; value: number }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 sm:gap-y-0 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded py-4 sm:py-6 shadow-sm">
      {stats.map((s, i) => (
        <div 
          key={i} 
          className={`text-center px-3 ${i % 2 === 0 ? "border-r sm:border-r" : "border-r-0 sm:border-r"} ${i >= 2 ? "sm:last:border-0" : ""} last:border-0 border-zinc-100 dark:border-zinc-900`}
        >
          <Counter value={s.value} />
          <div className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider sm:tracking-widest mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
