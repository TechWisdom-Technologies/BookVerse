import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Footer } from '../../../src/components/layout/Footer';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

describe('Footer Component', () => {
  it('renders the newsletter signup form', () => {
    render(<Footer />);
    
    expect(screen.getAllByText(/Newsletter/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Your email/i)).toBeInTheDocument();
  });

  it('handles newsletter subscription correctly', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as any);
    render(<Footer />);
    
    const input = screen.getByPlaceholderText(/Your email/i);
    // Button doesn't have text, it has an icon. We can find it by type="submit"
    // or we can just find it using getByRole and filter by type or something, 
    // but the input is in a form, we can just fire a submit event on the form.
    const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    
    expect(fetchSpy).toHaveBeenCalledWith('/api/newsletter/platform/subscribe', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    }));
    
    await waitFor(() => {
      expect(screen.getByText(/Thank you!/i)).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it('shows error message if subscription fails', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, json: async () => ({ error: 'Already subscribed' }) } as any);
    render(<Footer />);
    
    const input = screen.getByPlaceholderText(/Your email/i);
    const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Already subscribed/i)).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it('scrolls to top when scroll button is clicked', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;
    
    render(<Footer />);
    
    // The button has a ChevronUp icon but we can find it by looking for the last button
    const buttons = document.querySelectorAll('button');
    const scrollButton = buttons[buttons.length - 1]; // Scroll button is typically at the end
    fireEvent.click(scrollButton);
    
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });
});
