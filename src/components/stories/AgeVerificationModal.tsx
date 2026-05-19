'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function AgeVerificationModal({ storyId }: { storyId: string }) {
  const [showModal, setShowModal] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    if (!dateOfBirth) {
      toast.error('Please enter your date of birth');
      return;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Store verification (simplified)
    localStorage.setItem(`age-verified-${storyId}`, age.toString());
    setShowModal(false);
    toast.success('Age verified!');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h2 className="text-2xl font-bold mb-4">Age Verification Required</h2>
        <p className="text-gray-600 mb-4">
          This content may contain mature material. Please verify your age to continue.
        </p>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Verify Age
        </button>
      </div>
    </div>
  );
}
