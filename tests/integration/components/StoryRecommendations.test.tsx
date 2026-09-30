import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StoryRecommendations } from '../../../src/components/stories/StoryRecommendations';

// Mock next/link so StoryCard renders correctly
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock next/image so it doesn't crash on priority or layout issues
vi.mock('next/image', () => ({
  default: ({ alt, src }: any) => <img alt={alt} src={src} />,
}));

describe('StoryRecommendations Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders loading state initially', () => {
    // Leave fetch unresolved to check loading state
    (global.fetch as any).mockReturnValue(new Promise(() => {}));
    
    render(<StoryRecommendations />);
    // There are 6 loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders null if API returns no recommendations', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    const { container } = render(<StoryRecommendations />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stories/recommendations');
    });

    // Should return null and render nothing
    expect(container.firstChild).toBeNull();
  });

  it('renders story cards if API returns recommendations', async () => {
    const mockRecommendations = [
      {
        id: 's1',
        title: 'The Great Adventure',
        summary: 'A thrilling journey.',
        coverUrl: '/cover1.jpg',
        author: { id: 'a1', username: 'john', displayName: 'John Doe' },
        createdAt: new Date().toISOString(),
        viewCount: 100,
        _count: { chapters: 5, reactions: 10, comments: 2 }
      },
      {
        id: 's2',
        title: 'Mystery of the Unknown',
        summary: 'Who knows?',
        coverUrl: null,
        author: { id: 'a2', username: 'jane', displayName: 'Jane Doe' },
        createdAt: new Date().toISOString(),
        viewCount: 200,
        _count: { chapters: 1, reactions: 5, comments: 0 }
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecommendations
    });

    render(<StoryRecommendations />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stories/recommendations');
    });

    // Should render the "Recommended For You" header
    expect(screen.getByText(/Recommended For You/i)).toBeInTheDocument();

    // Should render the stories
    expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    expect(screen.getAllByText('Mystery of the Unknown').length).toBeGreaterThan(0);
    
    // Links should be present
    expect(screen.getByRole('link', { name: /The Great Adventure/i })).toHaveAttribute('href', '/stories/s1');
  });

  it('fails gracefully if API request throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { container } = render(<StoryRecommendations />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stories/recommendations');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to load story recommendations:', expect.any(Error));
    // Since recommendations remain empty, it returns null
    expect(container.firstChild).toBeNull();
    
    consoleSpy.mockRestore();
  });
});
