'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { TipModal } from './TipModal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface TipButtonProps {
  authorId: string;
  authorName: string;
  storyId?: string;
  storyTitle?: string;
  className?: string;
  variant?: 'button' | 'icon';
}

export function TipButton({
  authorId,
  authorName,
  storyId,
  storyTitle,
  className = '',
  variant = 'button',
}: TipButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      toast.error('Please log in to send tips');
      return;
    }
    setIsModalOpen(true);
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`text-red-500 hover:text-red-600 hover:scale-110 transition ${className}`}
          title="Send a tip"
        >
          <Heart className="w-5 h-5" />
        </button>
        <TipModal
          authorId={authorId}
          authorName={authorName}
          storyId={storyId}
          storyTitle={storyTitle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold py-2 px-4 rounded-lg transition ${className}`}
      >
        <Heart className="w-4 h-4 fill-red-600" />
        Support Author
      </button>
      <TipModal
        authorId={authorId}
        authorName={authorName}
        storyId={storyId}
        storyTitle={storyTitle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
