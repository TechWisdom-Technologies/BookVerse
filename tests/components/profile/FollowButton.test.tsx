import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FollowButton } from '../../../src/components/profile/FollowButton';

describe('FollowButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Follow text when not following', () => {
    render(<FollowButton targetUserId="user1" isFollowing={false} />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('renders Following text when following', () => {
    render(<FollowButton targetUserId="user1" isFollowing={true} />);
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('sends POST request to follow when clicked if not following', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as any);
    render(<FollowButton targetUserId="user1" isFollowing={false} />);
    
    fireEvent.click(screen.getByText('Follow'));
    
    expect(fetchSpy).toHaveBeenCalledWith('/api/follow', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ followingId: 'user1' })
    }));

    await waitFor(() => {
      expect(screen.getByText('Following')).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it('sends DELETE request to unfollow when clicked if following', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as any);
    render(<FollowButton targetUserId="user1" isFollowing={true} />);
    
    fireEvent.click(screen.getByText('Following'));
    
    expect(fetchSpy).toHaveBeenCalledWith('/api/follow?followingId=user1', expect.objectContaining({
      method: 'DELETE'
    }));

    await waitFor(() => {
      expect(screen.getByText('Follow')).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it('does not toggle state if request fails', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false } as any);
    render(<FollowButton targetUserId="user1" isFollowing={false} />);
    
    fireEvent.click(screen.getByText('Follow'));
    
    await waitFor(() => {
      expect(screen.getByText('Follow')).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });
});
