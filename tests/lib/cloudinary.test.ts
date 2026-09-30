import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadToCloudinary, deleteFromCloudinary, cloudinary } from '../../src/lib/cloudinary';

vi.mock('cloudinary', () => {
  return {
    v2: {
      config: vi.fn(),
      uploader: {
        upload_stream: vi.fn(),
        destroy: vi.fn(),
      },
    },
  };
});

describe('Cloudinary Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
    process.env.CLOUDINARY_API_KEY = 'test_key';
    process.env.CLOUDINARY_API_SECRET = 'test_secret';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('uploadToCloudinary', () => {
    it('throws if env vars are missing', async () => {
      delete process.env.CLOUDINARY_CLOUD_NAME;
      await expect(uploadToCloudinary(Buffer.from('test'), 'folder')).rejects.toThrow('Cloudinary is not configured');
    });

    it('uploads a buffer successfully', async () => {
      const endMock = vi.fn();

      // Simulate successful upload callback
      (cloudinary.uploader.upload_stream as any).mockImplementation((opts: any, callback: any) => {
        // Execute callback asynchronously
        setTimeout(() => callback(null, { secure_url: 'https://cloudinary.com/image.png' }), 0);
        return { end: endMock };
      });

      const buffer = Buffer.from('fake-image-data');
      const url = await uploadToCloudinary(buffer, 'test/folder', 'public-id-123');

      expect(url).toBe('https://cloudinary.com/image.png');
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: 'test/folder',
          public_id: 'public-id-123',
          resource_type: 'image',
          overwrite: true
        }),
        expect.any(Function)
      );
      expect(endMock).toHaveBeenCalledWith(buffer);
    });

    it('rejects if upload stream returns an error', async () => {
      (cloudinary.uploader.upload_stream as any).mockImplementation((opts: any, callback: any) => {
        setTimeout(() => callback(new Error('Upload failed'), null), 0);
        return { end: vi.fn() };
      });

      await expect(uploadToCloudinary(Buffer.from('test'), 'folder')).rejects.toThrow('Upload failed');
    });

    it('rejects if upload stream returns no URL', async () => {
      (cloudinary.uploader.upload_stream as any).mockImplementation((opts: any, callback: any) => {
        setTimeout(() => callback(null, {}), 0);
        return { end: vi.fn() };
      });

      await expect(uploadToCloudinary(Buffer.from('test'), 'folder')).rejects.toThrow('Cloudinary upload returned no URL');
    });
  });

  describe('deleteFromCloudinary', () => {
    it('skips silently if env vars are missing', async () => {
      delete process.env.CLOUDINARY_API_KEY;
      await deleteFromCloudinary('public-id-123');
      expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
    });

    it('calls destroy on cloudinary uploader', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue(true);
      await deleteFromCloudinary('public-id-123');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('public-id-123');
    });

    it('catches and logs errors silently', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      (cloudinary.uploader.destroy as any).mockRejectedValue(new Error('Delete failed'));

      await deleteFromCloudinary('public-id-123');

      expect(consoleSpy).toHaveBeenCalledWith('Cloudinary Delete Error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
