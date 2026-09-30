import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditProfileForm } from '../../../src/components/profile/EditProfileForm';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })
}));

// Mock useAuth
const mockRefreshUser = vi.fn();
vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({
    refreshUser: mockRefreshUser,
  })
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('EditProfileForm Integration', () => {
  const mockUser = {
    id: 'user123',
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    bio: 'Avid reader.',
    avatarUrl: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock global fetch
    global.fetch = vi.fn();
  });

  it('renders form with initial user data', () => {
    render(<EditProfileForm user={mockUser} />);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Avid reader.')).toBeInTheDocument();
  });

  it('updates profile data and shows success toast on successful save', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { ...mockUser, displayName: 'John Smith' } })
    });
    
    render(<EditProfileForm user={mockUser} />);
    
    const displayNameInput = screen.getByLabelText(/display name/i);
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'John Smith');
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/me',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"displayName":"John Smith"')
        })
      );
    });
    
    const toast = await import('react-hot-toast');
    expect(toast.default.success).toHaveBeenCalledWith('Profile updated successfully');
    expect(mockRefreshUser).toHaveBeenCalled();
  });

  it('shows error text if username is already taken', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Username already taken' })
    });
    
    render(<EditProfileForm user={mockUser} />);
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/me',
        expect.any(Object)
      );
    });
    
    expect(await screen.findByText('This username is already taken')).toBeInTheDocument();
  });

  it('uploads avatar to cloudinary when a file is selected', async () => {
    const user = userEvent.setup();
    
    // Mock the Cloudinary /api/upload POST
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://cloudinary.com/new-avatar.png' })
    });

    render(<EditProfileForm user={mockUser} />);
    
    // Find hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/upload',
        expect.objectContaining({ 
          method: 'POST',
          body: expect.any(FormData) 
        })
      );
    });
    
    const toast = await import('react-hot-toast');
    expect(toast.default.success).toHaveBeenCalledWith('Avatar uploaded');
  });
});
