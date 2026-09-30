import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactionBar } from '../../../src/components/stories/ReactionBar';

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  }
}));

describe('ReactionBar Integration', () => {
  const mockInitialReactions = {
    LIKE: 5,
    LOVE: 2,
    FIRE: 0,
    CRY: 0,
    WOW: 1
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders initial reactions and handles clicking to react', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({ ok: true });

    render(
      <ReactionBar 
        storyId="s1" 
        initialReactions={mockInitialReactions} 
        initialUserReaction={null} 
      />
    );

    // Initial counts should be displayed
    expect(screen.getByText('5')).toBeInTheDocument(); // Like
    expect(screen.getByText('2')).toBeInTheDocument(); // Love
    expect(screen.getByText('1')).toBeInTheDocument(); // Wow
    
    // Click the FIRE reaction button (which is 0 initially and not rendered)
    const fireButton = screen.getByTitle('Fire');
    await user.click(fireButton);

    // Optimistic UI updates
    // Now Fire should have '1'
    const oneCounts = screen.getAllByText('1');
    expect(oneCounts.length).toBe(2); // Wow (1) + Fire (1)

    // Ensure API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stories/s1/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: 'FIRE' })
      });
    });
  });

  it('handles clicking the same reaction to toggle it off', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({ ok: true, status: 204 });

    render(
      <ReactionBar 
        storyId="s1" 
        initialReactions={mockInitialReactions} 
        initialUserReaction="LIKE" 
      />
    );

    // Like should have 5 initially
    expect(screen.getByText('5')).toBeInTheDocument(); 

    // Click LIKE again to toggle off
    const likeButton = screen.getByTitle('Like');
    await user.click(likeButton);

    // Optimistic update: Like should become 4
    expect(screen.getByText('4')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stories/s1/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: 'LIKE' })
      });
    });
  });

  it('shows error toast when unauthenticated', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({ status: 401 });

    render(
      <ReactionBar 
        storyId="s1" 
        initialReactions={mockInitialReactions} 
        initialUserReaction={null} 
      />
    );

    const wowButton = screen.getByTitle('Wow');
    await user.click(wowButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const toast = await import('react-hot-toast');
    expect(toast.default.error).toHaveBeenCalledWith('Sign in to react to stories.');
  });
});
