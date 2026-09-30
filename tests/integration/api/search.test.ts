import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../src/app/api/search/route';
import { prisma } from '@/lib/prisma';

describe('Search API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if no search parameter is provided', async () => {
    const req = new Request('http://localhost/api/search');
    const res = await GET(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/required/i);
  });

  it('performs a global search across all entities when type=all', async () => {
    // Mock the raw SQL query for stories
    (prisma.$queryRaw as any).mockResolvedValue([
      { id: 's1', title: 'Story One', _type: 'story', createdAt: new Date() }
    ]);
    
    // Mock books
    (prisma.book.findMany as any).mockResolvedValue([
      { id: 'b1', title: 'Book One', createdAt: new Date() }
    ]);
    (prisma.book.count as any).mockResolvedValue(1);

    // Mock universes
    (prisma.universe.findMany as any).mockResolvedValue([
      { id: 'u1', name: 'Universe One', createdAt: new Date(), user: { displayName: 'U Creator' }, _count: { stories: 0 } }
    ]);
    (prisma.universe.count as any).mockResolvedValue(1);

    // Mock users (authors)
    (prisma.user.findMany as any).mockResolvedValue([
      { id: 'a1', username: 'author1', displayName: 'Author', createdAt: new Date(), _count: { stories: 0 } }
    ]);
    (prisma.user.count as any).mockResolvedValue(1);

    // Mock series
    (prisma.series.findMany as any).mockResolvedValue([
      { id: 'se1', name: 'Series One', createdAt: new Date(), user: { displayName: 'S Creator' }, _count: { stories: 0 } }
    ]);
    (prisma.series.count as any).mockResolvedValue(1);

    // Mock clubs
    (prisma.club.findMany as any).mockResolvedValue([
      { id: 'c1', name: 'Club One', createdAt: new Date(), owner: { displayName: 'C Creator' }, _count: { members: 0 } }
    ]);
    (prisma.club.count as any).mockResolvedValue(1);

    const req = new Request('http://localhost/api/search?q=test&type=all');
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    
    // Expect total count
    expect(data.total).toBe(6); // 1 story + 1 book + 1 universe + 1 author + 1 series + 1 club
    expect(data.results.length).toBe(6);
    
    // Verify results array has mixed types
    const types = data.results.map((r: any) => r._type);
    expect(types).toContain('book');
    expect(types).toContain('story');
    expect(types).toContain('universe');
    expect(types).toContain('author');
  });

  it('filters results by type=books', async () => {
    (prisma.book.findMany as any).mockResolvedValue([
      { id: 'b1', title: 'Book One', createdAt: new Date() }
    ]);
    (prisma.book.count as any).mockResolvedValue(1);

    const req = new Request('http://localhost/api/search?q=magic&type=books');
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.total).toBe(1);
    expect(data.results.length).toBe(1);
    expect(data.results[0]._type).toBe('book');
    
    // Ensure story query raw was NOT called
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
    expect(prisma.universe.findMany).not.toHaveBeenCalled();
  });
});
