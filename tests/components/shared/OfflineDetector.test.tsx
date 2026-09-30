import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OfflineDetector } from '../../../src/components/shared/OfflineDetector';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe('OfflineDetector Component', () => {
  const mockRouter = {
    replace: vi.fn(),
    push: vi.fn(),
  };

  const originalOnLine = navigator.onLine;

  beforeEach(() => {
    vi.clearAllMocks();
    (navigation.useRouter as any).mockReturnValue(mockRouter);
    (navigation.usePathname as any).mockReturnValue('/');
    
    // Default to online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: originalOnLine,
    });
  });

  it('renders nothing when online', () => {
    const { container } = render(<OfflineDetector />);
    expect(container.firstChild).toBeNull();
  });

  it('redirects to /offline-stories immediately if mounted while offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false });
    
    render(<OfflineDetector />);
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/offline-stories');
    expect(screen.queryByText('ইন্টারনেট সংযোগ নেই')).not.toBeInTheDocument(); // Modal shouldn't show, it redirects
  });

  it('does not redirect if already on /offline-stories', () => {
    Object.defineProperty(navigator, 'onLine', { value: false });
    (navigation.usePathname as any).mockReturnValue('/offline-stories');
    
    render(<OfflineDetector />);
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows modal when going offline mid-session', () => {
    render(<OfflineDetector />);
    
    // Simulate going offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    expect(screen.getByText('ইন্টারনেট সংযোগ নেই')).toBeInTheDocument();
  });

  it('hides modal when going back online', () => {
    render(<OfflineDetector />);
    
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    expect(screen.getByText('ইন্টারনেট সংযোগ নেই')).toBeInTheDocument();
    
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    expect(screen.queryByText('ইন্টারনেট সংযোগ নেই')).not.toBeInTheDocument();
  });

  it('navigates to offline stories when primary button is clicked', () => {
    render(<OfflineDetector />);
    
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    const readOfflineBtn = screen.getByText('অফলাইন গল্প পড়ুন');
    fireEvent.click(readOfflineBtn);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/offline-stories');
    expect(screen.queryByText('ইন্টারনেট সংযোগ নেই')).not.toBeInTheDocument();
  });

  it('closes modal when dismiss buttons are clicked', () => {
    render(<OfflineDetector />);
    
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    const dismissBtn = screen.getByText('পরে দেখব');
    fireEvent.click(dismissBtn);
    
    expect(screen.queryByText('ইন্টারনেট সংযোগ নেই')).not.toBeInTheDocument();
  });
});
