'use client';

import { useEffect, useState } from 'react';
import { Target, TrendingUp, Calendar, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WritingGoal {
  id: string;
  title: string;
  targetWords: number;
  progress: number;
  percentage: number;
  year: number;
  month: number;
  frequency: string;
}

export default function WritingGoalsPage() {
  const [goals, setGoals] = useState<WritingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [targetWords, setTargetWords] = useState(10000);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`/api/writing-goals?year=${currentYear}&month=${currentMonth}`);
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetWords <= 0) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      const res = await fetch('/api/writing-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          targetWords,
          year: currentYear,
          month: currentMonth,
          frequency: 'MONTHLY',
        }),
      });

      if (res.ok) {
        toast.success('Writing goal created! 📝');
        setTitle('');
        setTargetWords(10000);
        fetchGoals();
      } else {
        toast.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Writing Goals</h1>
              <p className="text-gray-600">Track your monthly writing targets</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Goal Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Set a Goal</h2>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Draft novel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Words
                  </label>
                  <input
                    type="number"
                    value={targetWords}
                    onChange={(e) => setTargetWords(parseInt(e.target.value))}
                    min="100"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {isCreating ? 'Creating...' : 'Create Goal'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Set realistic targets and track daily! Consistency matters more than speed.
                </p>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div className="lg:col-span-2 space-y-6">
            {goals.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
                <p className="text-gray-600">Create your first writing goal to start tracking!</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {monthName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{goal.progress.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">/ {goal.targetWords.toLocaleString()} words</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(goal.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, goal.percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {goal.percentage >= 100 ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <TrendingUp className="w-5 h-5" />
                        Goal Achieved! 🎉
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {Math.max(0, goal.targetWords - goal.progress).toLocaleString()} words to go
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
