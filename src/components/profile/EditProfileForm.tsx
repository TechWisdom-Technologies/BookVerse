"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
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
  description?: string | null;
  mood?: string | null;
  subGenres?: string[];
  tags?: string[];
  phoneNumber?: string | null;
  address?: string | null;
  nationality?: string | null;
  socialLinks?: { platform: string; url: string }[] | null;
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
  const [description, setDescription] = useState(user.description || "");
  const [mood, setMood] = useState(user.mood || "");
  const [subGenres, setSubGenres] = useState(user.subGenres ? user.subGenres.join(", ") : "");
  const [tags, setTags] = useState(user.tags ? user.tags.join(", ") : "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [address, setAddress] = useState(user.address || "");
  const [nationality, setNationality] = useState(user.nationality || "");
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>(
    user.socialLinks || []
  );
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [usernameError, setUsernameError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSocialLinks(user.socialLinks || []);
  }, [user.socialLinks]);

  const PLATFORMS = [
    { id: "facebook", name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_de_Facebook.png" },
    { id: "x", name: "X (Twitter)", logo: "https://images.seeklogo.com/logo-png/49/2/twitter-x-logo-png_seeklogo-492396.png" },
    { id: "instagram", name: "Instagram", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: "youtube", name: "YouTube", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" },
    { id: "tiktok", name: "TikTok", logo: "https://img.magnific.com/premium-psd/tiktok-logo_1131634-487.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: "linkedin", name: "LinkedIn", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: "portfolio", name: "Portfolio", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: "other", name: "Other", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
  ];

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "facebook", url: "" }]);
  };

  const handleUpdateSocialLink = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

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

    const subGenresArray = subGenres.split(",").map(s => s.trim()).filter(Boolean);
    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

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
          description: description || null,
          mood: mood || null,
          subGenres: subGenresArray,
          tags: tagsArray,
          phoneNumber: phoneNumber || null,
          address: address || null,
          nationality: nationality || null,
          socialLinks: socialLinks.filter(l => l.url.trim() !== ""),
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-8 p-8 border border-zinc-100 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10">
        <div
          onClick={handleAvatarClick}
          className="group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full shadow-sm border-4 border-white dark:border-zinc-900 transition-transform hover:scale-[1.02]"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 text-4xl font-black text-white dark:text-zinc-900">
              {(displayName || username)[0]?.toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0 flex flex-col items-center gap-1.5">
              <Camera className="h-5 w-5 text-white" />
              <span className="text-[9px] font-bold text-white tracking-widest uppercase">Change</span>
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
        <div className="text-center sm:text-left space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Profile Photo</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium max-w-xs uppercase">
            Recommended size: 400x400px.<br/>Maximum size: 5MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Name */}
        <div className="space-y-3">
          <label
            htmlFor="displayName"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="How you want to be known"
          />
        </div>

        {/* Username */}
        <div className="space-y-3">
          <label
            htmlFor="username"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">@</span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full pl-9 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
              placeholder="username"
            />
          </div>
          {usernameError ? (
            <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase">{usernameError}</p>
          ) : (
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Letters, numbers, underscores</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-3">
        <label
          htmlFor="bio"
          className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
        >
          <span>Short Bio</span>
          <span className="text-zinc-400">{bio.length} / 500</span>
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          maxLength={500}
          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
          placeholder="Tell us about yourself briefly..."
        />
      </div>

      {/* Extended Description */}
      <div className="space-y-3">
        <label
          htmlFor="description"
          className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
        >
          <span>Extended Description</span>
          <span className="text-zinc-400">{description.length} / 1000</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={1000}
          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
          placeholder="Write a longer description about your background, projects, or genres..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood */}
        <div className="space-y-3">
          <label
            htmlFor="mood"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Current Status / Mood
          </label>
          <input
            type="text"
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="e.g. 📚 Reading intensively"
          />
        </div>

        {/* Subgenres */}
        <div className="space-y-3">
          <label
            htmlFor="subGenres"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Favorite Subgenres
          </label>
          <input
            type="text"
            id="subGenres"
            value={subGenres}
            onChange={(e) => setSubGenres(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="Comma separated"
          />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label
            htmlFor="tags"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Profile Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="Comma separated"
          />
        </div>
        
        {/* Date of Birth */}
        <div className="space-y-3">
          <label
            htmlFor="dateOfBirth"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-mono font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-3">
          <label
            htmlFor="phoneNumber"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-mono font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="e.g. +88017XXXXXXXX"
          />
        </div>

        {/* Nationality */}
        <div className="space-y-3">
          <label
            htmlFor="nationality"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="e.g. Bangladeshi"
          />
        </div>

        {/* Address */}
        <div className="space-y-3 md:col-span-2">
          <label
            htmlFor="address"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Location / Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            placeholder="e.g. Dhaka, Bangladesh"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-3">
          <label
            htmlFor="email"
            className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-500 cursor-not-allowed transition-all"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Social Links
          </label>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Link
          </button>
        </div>
        {socialLinks.map((link, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-1/3 relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none flex items-center justify-between transition-all"
              >
                <span className="capitalize">{PLATFORMS.find(p => p.id === link.platform)?.name || "Other"}</span>
                <span className="text-[10px] text-zinc-400">▼</span>
              </button>
              
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <img 
                  src={PLATFORMS.find(p => p.id === link.platform)?.logo || PLATFORMS.find(p => p.id === 'other')?.logo} 
                  alt="" 
                  className="w-5 h-5 object-cover rounded-full bg-white"
                />
              </div>

              {openDropdown === index && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto py-1">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        handleUpdateSocialLink(index, "platform", p.id);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs text-zinc-900 dark:text-white text-left"
                    >
                      <img src={p.logo} alt={p.name} className="w-5 h-5 object-cover rounded-full bg-white shadow-sm" />
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="url"
              value={link.url}
              onChange={(e) => handleUpdateSocialLink(index, "url", e.target.value)}
              placeholder="https://..."
              className="w-full flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
            <button
              type="button"
              onClick={() => handleRemoveSocialLink(index)}
              className="p-3 text-zinc-400 hover:text-rose-500 transition-colors"
              title="Remove link"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-end gap-3 mt-8">
        <Link
          href={`/profile/${user.username}`}
          className="w-full sm:w-auto px-6 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-100 dark:border-zinc-800 transition-all text-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading || !!usernameError}
          className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}

import Link from "next/link";
