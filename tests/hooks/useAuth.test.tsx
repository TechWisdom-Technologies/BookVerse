import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../src/hooks/useAuth';
import * as firebaseAuth from 'firebase/auth';

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth: any, cb: any) => {
      // return a mock unsubscribe function
      return vi.fn();
    }),
  };
});

vi.mock('@/lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('useAuth hook', () => {
  let originalFetch: typeof global.fetch;
  let originalLocation: typeof window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    originalFetch = global.fetch;
    global.fetch = vi.fn();

    // Mock window.location
    originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '', pathname: '/' } as any;

    // Default fetch response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: '123', email: 'test@test.com' } }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    window.location = originalLocation as any;
  });

  it('initializes with loading state and null user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.dbUser).toBe(null);
  });

  it('handles signIn correctly', async () => {
    const { result } = renderHook(() => useAuth());

    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValueOnce({ user: { uid: '123' } });

    await act(async () => {
      await result.current.signIn('test@test.com', 'password');
    });

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@test.com',
      'password'
    );
  });

  it('handles signUp correctly', async () => {
    const { result } = renderHook(() => useAuth());

    (firebaseAuth.createUserWithEmailAndPassword as any).mockResolvedValueOnce({ user: { uid: '123' } });

    await act(async () => {
      await result.current.signUp('test@test.com', 'password');
    });

    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@test.com',
      'password'
    );
  });

  it('handles resetPassword correctly', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword('test@test.com', 'token123');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot-password', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', captchaToken: 'token123' })
    }));
  });

  it('handles resetPassword error correctly', async () => {
    const { result } = renderHook(() => useAuth());

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'User not found' }),
    });

    await expect(result.current.resetPassword('test@test.com')).rejects.toThrow('User not found');
  });

  it('handles signOut correctly', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/signout', expect.objectContaining({ method: 'POST' }));
    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });

  it('handles signInWithGoogle correctly', async () => {
    const { result } = renderHook(() => useAuth());

    (firebaseAuth.signInWithPopup as any).mockResolvedValueOnce({ user: { uid: '123' } });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
  });

  it('falls back to signInWithRedirect if popup is blocked', async () => {
    const { result } = renderHook(() => useAuth());

    (firebaseAuth.signInWithPopup as any).mockRejectedValueOnce({ code: 'auth/popup-blocked' });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    expect(firebaseAuth.signInWithRedirect).toHaveBeenCalled();
  });

  it('updates state when onAuthStateChanged fires with a user', async () => {
    let authCallback: any;
    (firebaseAuth.onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      authCallback = cb;
      return vi.fn();
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await authCallback({ uid: '123', getIdToken: async () => 'mock-token' });
    });

    expect(result.current.user).toEqual({ uid: '123', getIdToken: expect.any(Function) });
    expect(result.current.dbUser).toEqual({ id: '123', email: 'test@test.com' });
    expect(result.current.loading).toBe(false);
  });

  it('redirects to login when onAuthStateChanged fires without a user on protected page', async () => {
    let authCallback: any;
    (firebaseAuth.onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      authCallback = cb;
      return vi.fn();
    });

    window.location.pathname = '/write/new'; // protected

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await authCallback(null);
    });

    expect(window.location.href).toBe('/login?redirect=%2Fwrite%2Fnew');
    expect(result.current.loading).toBe(false);
  });

  it('redirects to onboarding if needsOnboarding is true', async () => {
    let authCallback: any;
    (firebaseAuth.onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      authCallback = cb;
      return vi.fn();
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: '123' }, needsOnboarding: true }),
    });

    window.location.pathname = '/';

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await authCallback({ uid: '123', getIdToken: async () => 'mock-token' });
    });

    expect(window.location.href).toBe('/onboarding');
  });
});
