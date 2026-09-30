import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoryFilters } from '../../../src/components/stories/StoryFilters';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => {
    return new URLSearchParams(''); // Mock empty params
  }
}));

describe('StoryFilters Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filters and updates sort parameter on click', async () => {
    const user = userEvent.setup();
    render(<StoryFilters genres={['Sci-Fi', 'Fantasy']} authors={['John', 'Jane']} />);
    
    const newestButton = screen.getByRole('button', { name: /newest/i });
    await user.click(newestButton);
    
    expect(mockPush).toHaveBeenCalledWith('/stories?sort=recent', { scroll: false });
  });

  it('updates genre parameter on input change', async () => {
    const user = userEvent.setup();
    render(<StoryFilters genres={['Sci-Fi', 'Fantasy']} authors={['John', 'Jane']} />);
    
    const genreInput = screen.getByPlaceholderText(/all genres/i);
    await user.type(genreInput, 'S');
    
    expect(mockPush).toHaveBeenCalledWith('/stories?genre=S', { scroll: false });
  });

  it('updates author parameter on input change', async () => {
    const user = userEvent.setup();
    render(<StoryFilters genres={['Sci-Fi', 'Fantasy']} authors={['John', 'Jane']} />);
    
    const authorInput = screen.getByPlaceholderText(/all authors/i);
    await user.type(authorInput, 'J');
    
    expect(mockPush).toHaveBeenCalledWith('/stories?authorName=J', { scroll: false });
  });
});
