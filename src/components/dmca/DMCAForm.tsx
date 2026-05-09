'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

export function DMCAForm({ storyId }: { storyId: string }) {
  const [formData, setFormData] = useState({
    originalWorkTitle: '',
    originalWorkAuthor: '',
    copyrightHolder: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/dmca-notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      toast.success('DMCA notice submitted successfully');
      setFormData({
        originalWorkTitle: '',
        originalWorkAuthor: '',
        copyrightHolder: '',
        description: '',
      });
    } catch (error) {
      toast.error('Failed to submit DMCA notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
        <p className="text-sm text-yellow-800">
          File a DMCA notice if you believe this content violates copyright. False claims may result in legal consequences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original Work Title *</label>
          <input
            type="text"
            name="originalWorkTitle"
            value={formData.originalWorkTitle}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Title of the original work"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Original Work Author</label>
          <input
            type="text"
            name="originalWorkAuthor"
            value={formData.originalWorkAuthor}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Author of the original work"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Copyright Holder *</label>
          <input
            type="text"
            name="copyrightHolder"
            value={formData.copyrightHolder}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Your name or organization"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
            placeholder="Explain how this content infringes your copyright"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
        >
          {loading ? 'Submitting...' : 'Submit DMCA Notice'}
        </button>
      </form>
    </div>
  );
}
