"use client";

import { useState, useRef, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  _count: {
    followers: number;
    following: number;
  };
}

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
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
          avatarUrl: avatarUrl || null,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center gap-4">
        <div
          onClick={handleAvatarClick}
          className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-2xl font-bold text-white">
              {(displayName || username)[0]?.toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Profile Photo</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Click to upload a new photo
          </p>
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={50}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          placeholder="How you want to be known"
        />
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Username
        </label>
        <div className="mt-1 flex rounded-lg shadow-sm">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            @
          </span>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className={`block w-full rounded-r-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-zinc-800 dark:text-zinc-50 ${
              usernameError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700"
                : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700"
            }`}
            placeholder="username"
          />
        </div>
        {usernameError ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{usernameError}</p>
        ) : (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Lowercase letters, numbers, and underscores only
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={500}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          placeholder="Tell us about yourself..."
        />
        <p className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
          {bio.length}/500
        </p>
      </div>

      {/* Email (read-only) */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email}
          disabled
          className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Email cannot be changed
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !!usernameError}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
        <Link
          href={`/profile/${user.username}`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <X className="h-4 w-4" />
          Cancel
        </Link>
      </div>
    </form>
  );
}

import Link from "next/link";
