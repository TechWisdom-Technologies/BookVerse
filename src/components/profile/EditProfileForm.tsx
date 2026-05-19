"use client";

import { useState, useRef, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, Camera, Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  dateOfBirth?: string | Date | null;
  _count?: {
    followers: number;
    following: number;
    stories?: number;
  };
}

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().substring(0, 10) : "");
  const [usernameError, setUsernameError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Upload file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "avatar");

    try {
      setIsLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setAvatarUrl(data.url);
      toast.success("Avatar uploaded");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (value: string) => {
    if (value.length < 3) return "Username must be at least 3 characters";
    if (value.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-z0-9_]+$/.test(value)) return "Username can only contain lowercase letters, numbers, and underscores";
    return "";
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const usernameValidation = validateUsername(username);
    if (usernameValidation) {
      setUsernameError(usernameValidation);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName || null,
          username,
          bio: bio || null,
          avatarUrl: avatarUrl || user.avatarUrl,
          dateOfBirth: dateOfBirth || null,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        await refreshUser();
        router.push(`/profile/${username}`);
        router.refresh();
      } else {
        const data = await res.json();
        if (data.error === "Username already taken") {
          setUsernameError("This username is already taken");
        } else {
          toast.error(data.error || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Avatar Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div
          onClick={handleAvatarClick}
          className="group relative h-32 w-32 sm:h-40 sm:w-40 cursor-pointer overflow-hidden rounded-full shadow-2xl transition-transform hover:scale-[1.02]"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand to-rose-500 text-5xl font-black text-white">
              {(displayName || username)[0]?.toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0 flex flex-col items-center gap-2">
              <Camera className="h-8 w-8 text-white" />
              <span className="text-xs font-bold text-white tracking-wider uppercase">Change</span>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Profile Photo</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
            We recommend an image of at least 400x400. Max size 5MB.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

      <div className="space-y-8">
        {/* Display Name */}
        <div className="group">
          <label
            htmlFor="displayName"
            className="block text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-2 group-focus-within:text-brand transition-colors"
          >
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-6 py-4 text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
            placeholder="How you want to be known"
          />
        </div>

        {/* Username */}
        <div className="group">
          <label
            htmlFor="username"
            className="block text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-2 group-focus-within:text-brand transition-colors"
          >
            Username
          </label>
          <div className="flex rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 transition-all focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-within:bg-zinc-900">
            <span className="flex items-center pl-6 pr-2 text-xl font-bold text-zinc-400">
              @
            </span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="block w-full rounded-r-2xl bg-transparent px-2 py-4 text-lg font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-white"
              placeholder="username"
            />
          </div>
          {usernameError ? (
            <p className="mt-3 ml-2 text-sm font-medium text-rose-500">{usernameError}</p>
          ) : (
            <p className="mt-3 ml-2 text-sm text-zinc-500 dark:text-zinc-400">
              Lowercase letters, numbers, and underscores only.
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="group">
          <label
            htmlFor="bio"
            className="block text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-2 group-focus-within:text-brand transition-colors"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-6 py-4 text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 resize-none"
            placeholder="Tell us about yourself..."
          />
          <p className="mt-3 text-right text-sm font-medium text-zinc-400">
            {bio.length} / 500
          </p>
        </div>
        {/* Date of Birth */}
        <div className="group">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-2 group-focus-within:text-brand transition-colors"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-6 py-4 text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-100 px-6 py-4 text-lg font-medium text-zinc-500 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
          />
          <p className="mt-3 ml-2 text-sm font-medium text-zinc-400">
            Your email is managed via your authentication provider.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mt-10 mb-8" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
        <Link
          href={`/profile/${user.username}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-all"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading || !!usernameError}
          className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 rounded-full bg-brand px-10 py-4 text-base font-bold text-white transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 transition-transform group-hover:scale-110" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import Link from "next/link";
