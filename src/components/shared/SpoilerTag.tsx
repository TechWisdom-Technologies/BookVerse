'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function SpoilerTag({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      onClick={() => setRevealed(!revealed)}
      className={`inline-block px-3 py-1 rounded cursor-pointer transition ${
        revealed
          ? 'bg-gray-100 text-gray-900'
          : 'bg-gray-800 text-gray-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {revealed ? (
          <>
            <EyeOff className="w-4 h-4" />
            {content}
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Spoiler (click to reveal)</span>
          </>
        )}
      </div>
    </div>
  );
}
