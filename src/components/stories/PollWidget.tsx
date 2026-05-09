'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, BarChart3 } from 'lucide-react';
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
}

export function PollWidget({ pollId, question, options, expiresAt, onVote }: PollProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [userVoted, setUserVoted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (expiresAt && new Date(expiresAt) < new Date()) {
      setIsExpired(true);
    }
  }, [expiresAt]);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes.length, 0);

  const handleVote = async (optionId: string) => {
    if (isExpired || userVoted) return;

    try {
      setIsVoting(true);
      const res = await fetch(`/api/polls/${optionId}/vote`, {
        method: 'POST',
      });

      if (res.ok) {
        setUserVoted(true);
        toast.success('Vote recorded! 🗳️');
        onVote?.();
      } else {
        toast.error('Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('An error occurred');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-3">
        <BarChart3 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{question}</h3>
          {totalVotes > 0 && (
            <p className="text-sm text-gray-500 mt-1">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isVoting || isExpired || userVoted}
              className="w-full text-left transition"
            >
              <div className="relative group">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {userVoted && option.votes.length > 0 && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{option.text}</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-10 text-right">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isExpired && (
        <p className="text-xs text-center text-gray-500">Poll has ended</p>
      )}
      {userVoted && !isExpired && (
        <p className="text-xs text-center text-green-600 font-medium">You voted ✓</p>
      )}
    </div>
  );
}
