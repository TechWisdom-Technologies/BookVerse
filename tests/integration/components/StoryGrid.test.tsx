import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryGrid } from '../../../src/components/stories/StoryGrid';

describe('StoryGrid Integration', () => {
  it('renders loading skeleton when loading is true', () => {
    render(<StoryGrid stories={[]} loading={true} />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(8); // 8 skeletons rendered
  });

  it('renders empty state when there are no stories', () => {
    render(<StoryGrid stories={[]} loading={false} />);
    expect(screen.getByText('No stories yet')).toBeInTheDocument();
    expect(screen.getByText(/Be the first to share your story/i)).toBeInTheDocument();
  });

  it('renders story cards when stories are provided', () => {
    const mockStories = [
      {
        id: 's1',
        title: 'Story 1',
        summary: 'Summary 1',
        coverUrl: null,
        author: { id: 'a1', username: 'author1', displayName: 'Author One', avatarUrl: null },
        createdAt: new Date().toISOString(),
        viewCount: 100,
        _count: { chapters: 2, reactions: 3, comments: 1 }
      },
      {
        id: 's2',
        title: 'Story 2',
        summary: 'Summary 2',
        coverUrl: null,
        author: { id: 'a2', username: 'author2', displayName: 'Author Two', avatarUrl: null },
        createdAt: new Date().toISOString(),
        viewCount: 200,
        _count: { chapters: 5, reactions: 10, comments: 5 }
      }
    ];

    render(<StoryGrid stories={mockStories} loading={false} />);
    
    // Check titles
    expect(screen.getAllByText('Story 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Story 2').length).toBeGreaterThan(0);
    
    // Check authors
    expect(screen.getByText('Author One')).toBeInTheDocument();
    expect(screen.getByText('Author Two')).toBeInTheDocument();
  });
});
