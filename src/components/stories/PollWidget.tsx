'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, BarChart3, Clock, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PollOption {
  id: string;
  text: string;
  votes: Array<{ userId: string }>;
}

interface PollProps {
  pollId: string;
  question: string;
  options: PollOption[];
  expiresAt?: string;
  onVote?: () => void;
  userId?: string | null;
}

export function PollWidget({ pollId, question, options, expiresAt, onVote, userId }: PollProps) {
  const initialVotedOptionId = options.find((opt) => 
    userId ? opt.votes.some((v) => v.userId === userId) : false
  )?.id;

  const [isVoting, setIsVoting] = useState(false);
  const [userVoted, setUserVoted] = useState(!!initialVotedOptionId);
  const [isExpired, setIsExpired] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialVotedOptionId || null);

  useEffect(() => {
    if (expiresAt && new Date(expiresAt) < new Date()) {
      setIsExpired(true);
    }
  }, [expiresAt]);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes.length, 0);

  const handleVote = async (optionId: string) => {
    if (!userId) {
      toast.error('You must be logged in to vote.');
      return;
    }
    if (isExpired || userVoted) return;

    try {
      setIsVoting(true);
      setSelectedOptionId(optionId);
      
      const res = await fetch(`/api/polls/${optionId}/vote`, {
        method: 'POST',
      });

      if (res.ok) {
        setUserVoted(true);
        toast.success('Vote recorded.');
        onVote?.();
      } else {
        toast.error('Failed to vote');
        setSelectedOptionId(null);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('An error occurred');
      setSelectedOptionId(null);
    } finally {
      setIsVoting(false);
    }
  };

  const showResults = userVoted || isExpired;

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {isExpired ? 'Ended' : 'Active Poll'}
            </span>
          </div>
          {totalVotes > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
              {totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
          {question}
        </h3>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
          const isSelected = selectedOptionId === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isVoting || showResults}
              className={`w-full text-left relative overflow-hidden rounded-lg transition-all duration-300 border ${
                showResults 
                  ? isSelected 
                    ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 cursor-default'
                    : 'border-zinc-100 dark:border-zinc-800/50 bg-transparent cursor-default opacity-60 hover:opacity-100'
                  : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer'
              }`}
            >
              {showResults && (
                <div 
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                    isSelected ? 'bg-zinc-200/50 dark:bg-zinc-800/50' : 'bg-zinc-100 dark:bg-zinc-800/30'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  {showResults && (
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      {isSelected ? <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />}
                    </div>
                  )}
                  <span className={`text-xs font-bold transition-colors ${
                    showResults && isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {option.text}
                  </span>
                </div>
                
                {showResults && (
                  <span className={`text-[10px] font-black font-mono shrink-0 ml-4 ${
                    isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'
                  }`}>
                    {Math.round(percentage)}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {userVoted && !isExpired && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-900">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Voted
          </span>
        </div>
      )}
    </div>
  );
}
