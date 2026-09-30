import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pagination } from '../../../src/components/shared/Pagination';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => {
    return <a href={href} className={className} data-testid="page-link">{children}</a>;
  },
}));

describe('Pagination Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (navigation.useSearchParams as any).mockReturnValue(new URLSearchParams(''));
  });

  it('renders correctly with multiple pages', () => {
    render(<Pagination currentPage={3} totalPages={10} basePath="/search" />);
    
    // It should render pages 1, 2, 3, 4, 5
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
    
    // And page 10 at the end
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(<Pagination currentPage={3} totalPages={10} basePath="/search" />);
    
    const activeLink = screen.getByText('03');
    expect(activeLink).toHaveClass('bg-zinc-900');
  });

  it('generates correct URLs', () => {
    (navigation.useSearchParams as any).mockReturnValue(new URLSearchParams('sort=recent'));
    render(<Pagination currentPage={2} totalPages={5} basePath="/search" />);
    
    const page3Link = screen.getByText('03');
    expect(page3Link).toHaveAttribute('href', '/search?sort=recent&page=3');
    
    // Check previous button
    // It renders as the first link
    const links = screen.getAllByTestId('page-link');
    // First link is "previous", so it should point to page 1
    expect(links[0]).toHaveAttribute('href', '/search?sort=recent&page=1');
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} basePath="/search" />);
    
    // The previous button is a disabled button instead of a Link
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} basePath="/search" />);
    
    // The next button is a disabled button instead of a Link
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
  });

  it('shifts the visible page window near the end', () => {
    render(<Pagination currentPage={9} totalPages={10} basePath="/search" />);
    
    // Window of 5, should show 6, 7, 8, 9, 10
    expect(screen.getByText('06')).toBeInTheDocument();
    expect(screen.getByText('07')).toBeInTheDocument();
    expect(screen.getByText('08')).toBeInTheDocument();
    expect(screen.getByText('09')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // And page 1 at the beginning
    expect(screen.getByText('01')).toBeInTheDocument();
  });
});
