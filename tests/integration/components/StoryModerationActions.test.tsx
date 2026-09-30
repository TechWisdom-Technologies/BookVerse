import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoryModerationActions } from '../../../src/components/stories/StoryModerationActions';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('StoryModerationActions Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders correctly and validates authentication before reporting', async () => {
    const user = userEvent.setup();
    render(<StoryModerationActions storyId="s1" authorId="a1" currentUserId={null} />); // Not signed in
    
    // Type in description
    const descInput = screen.getByPlaceholderText(/provide details/i);
    await user.type(descInput, 'Bad content here');
    
    // Click submit report
    const submitBtn = screen.getByRole('button', { name: /Submit Violation Report/i });
    await user.click(submitBtn);
    
    const toast = await import('react-hot-toast');
    expect(toast.default.error).toHaveBeenCalledWith('Please sign in first');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits a content report successfully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'r1' })
    });
    
    render(<StoryModerationActions storyId="s1" authorId="a1" currentUserId="u1" />);
    
    // Type in description
    const descInput = screen.getByPlaceholderText(/provide details/i);
    await user.type(descInput, 'Harassment observed');
    
    // Select reason
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'HARASSMENT');
    
    // Click submit report
    const submitBtn = screen.getByRole('button', { name: /Submit Violation Report/i });
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/content-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: 's1', reason: 'HARASSMENT', description: 'Harassment observed' })
      });
    });
    
    const toast = await import('react-hot-toast');
    expect(toast.default.success).toHaveBeenCalledWith('Content report submitted successfully');
    
    // The description field should be cleared
    expect(descInput).toHaveValue('');
  });

  it('submits a DMCA notice successfully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'dmca1' })
    });
    
    render(<StoryModerationActions storyId="s1" authorId="a1" currentUserId="u1" />);
    
    // Open DMCA form
    const toggleBtn = screen.getByRole('button', { name: /File DMCA Notice/i });
    await user.click(toggleBtn);
    
    // Fill out DMCA form
    await user.type(screen.getByPlaceholderText(/Harry Potter/i), 'My Original Title');
    await user.type(screen.getByPlaceholderText(/J.K. Rowling/i), 'Myself');
    await user.type(screen.getByPlaceholderText(/Warner Bros/i), 'Myself Inc');
    await user.type(screen.getByPlaceholderText(/Identify where the copyrighted material/i), 'They stole my work');
    
    // Click File Claim
    const fileBtn = screen.getByRole('button', { name: /Submit DMCA Affidavit/i });
    await user.click(fileBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/dmca-notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: 's1',
          originalWorkTitle: 'My Original Title',
          originalWorkAuthor: 'Myself',
          copyrightHolder: 'Myself Inc',
          description: 'They stole my work'
        })
      });
    });
    
    const toast = await import('react-hot-toast');
    expect(toast.default.success).toHaveBeenCalledWith('DMCA copyright notice submitted');
    
    // Form should close, so inputs should not be in the document
    expect(screen.queryByPlaceholderText(/Harry Potter/i)).not.toBeInTheDocument();
  });
});
