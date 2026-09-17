"use client";

import { useEffect, useState } from "react";
import { Database, HardDrive, RefreshCw, Loader2, Server, ArrowLeft, BarChart3, Info, Image as ImageIcon, Zap, File, FileText, Video, ChevronDown, ChevronUp, TableProperties } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import Link from "next/link";

interface StorageStats {
  databaseSizeBytes: number;
  r2SizeBytes: number;
  redisSizeBytes: number;
  cloudinarySizeBytes: number;
}

interface StorageFile {
  id: string;
  name: string;
  sizeBytes: number;
  type: "image" | "video" | "document" | "database" | "other";
  source: "r2" | "cloudinary" | "postgres";
  lastModified?: string;
}

const DB_QUOTA_BYTES = 500 * 1024 * 1024; // 500 MB
const R2_QUOTA_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB
const REDIS_QUOTA_BYTES = 256 * 1024 * 1024; // 256 MB
const CLOUDINARY_QUOTA_BYTES = 25 * 1024 * 1024 * 1024; // 25 GB

export default function StorageAdminPage() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<StorageFile[] | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filesExpanded, setFilesExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [filesError, setFilesError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/storage");
      if (!response.ok) {
        throw new Error("Failed to fetch storage stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchFiles = async (pageNum = 1) => {
    setLoadingFiles(true);
    setFilesError(null);
    try {
      const response = await fetch(`/api/admin/storage/files?page=${pageNum}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        if (pageNum === 1) {
          setFiles(data.files || []);
        } else {
          setFiles(prev => [...(prev || []), ...(data.files || [])]);
        }
        setTotalFiles(data.total || 0);
      } else {
        const errText = await response.text();
        console.error("API error:", response.status, errText);
        setFilesError(`API Error (${response.status}): ${errText}`);
      }
    } catch (err: any) {
      console.error(err);
      setFilesError(`Network Error: ${err.message}`);
    } finally {
      setLoadingFiles(false);
    }
  };

  const toggleFiles = () => {
    if (!filesExpanded && !files) {
      fetchFiles(1);
    }
    setFilesExpanded(!filesExpanded);
  };

  const totalStorage = stats ? stats.databaseSizeBytes + stats.r2SizeBytes + stats.redisSizeBytes + stats.cloudinarySizeBytes : 0;

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              System Oversight
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Storage Dashboard</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Monitor your database and file storage usage across the platform.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Refresh
            </button>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
              <Database className="w-3.5 h-3.5" />
              Storage Protocol
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Stats Registry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 mb-16">
          {/* Total Storage */}
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Total Used
              </span>
              <Server className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">
                {formatBytes(totalStorage)}
              </p>
              <div className="w-8 h-0.5 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all" />
            </div>
          </div>

          {/* Database Storage */}
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Supabase DB
              </span>
              <Database className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">
                {formatBytes(stats?.databaseSizeBytes || 0)}
              </p>
              <div className="w-8 h-0.5 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all" />
            </div>
          </div>

          {/* File Storage */}
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Cloudflare R2
              </span>
              <HardDrive className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">
                {formatBytes(stats?.r2SizeBytes || 0)}
              </p>
              <div className="w-8 h-0.5 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all" />
            </div>
          </div>

          {/* Redis Storage */}
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Upstash Redis
              </span>
              <Zap className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">
                {formatBytes(stats?.redisSizeBytes || 0)}
              </p>
              <div className="w-8 h-0.5 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all" />
            </div>
          </div>

          {/* Cloudinary Storage */}
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Cloudinary
              </span>
              <ImageIcon className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">
                {formatBytes(stats?.cloudinarySizeBytes || 0)}
              </p>
              <div className="w-8 h-0.5 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all" />
            </div>
          </div>
        </div>

        {/* Quota Usage */}
        <section>
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Quota Usage</h2>
          </div>
          
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
            <div className="space-y-8">
              {/* Database */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Database (500 MB Limit)</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {stats
                      ? Math.min(100, Math.round((stats.databaseSizeBytes / DB_QUOTA_BYTES) * 100 * 100) / 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats
                          ? Math.min(100, (stats.databaseSizeBytes / DB_QUOTA_BYTES) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold text-zinc-400">
                  {formatBytes(stats?.databaseSizeBytes || 0)} / {formatBytes(DB_QUOTA_BYTES, 0)}
                </div>
              </div>
              
              {/* Files */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Files (10 GB Limit)</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {stats
                      ? Math.min(100, Math.round((stats.r2SizeBytes / R2_QUOTA_BYTES) * 100 * 100) / 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats
                          ? Math.min(100, (stats.r2SizeBytes / R2_QUOTA_BYTES) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold text-zinc-400">
                  {formatBytes(stats?.r2SizeBytes || 0)} / {formatBytes(R2_QUOTA_BYTES, 0)}
                </div>
              </div>

              {/* Redis */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Redis Cache (256 MB Limit)</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {stats
                      ? Math.min(100, Math.round((stats.redisSizeBytes / REDIS_QUOTA_BYTES) * 100 * 100) / 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats
                          ? Math.min(100, (stats.redisSizeBytes / REDIS_QUOTA_BYTES) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold text-zinc-400">
                  {formatBytes(stats?.redisSizeBytes || 0)} / {formatBytes(REDIS_QUOTA_BYTES, 0)}
                </div>
              </div>

              {/* Cloudinary */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cloudinary (25 GB Limit)</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {stats
                      ? Math.min(100, Math.round((stats.cloudinarySizeBytes / CLOUDINARY_QUOTA_BYTES) * 100 * 100) / 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats
                          ? Math.min(100, (stats.cloudinarySizeBytes / CLOUDINARY_QUOTA_BYTES) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold text-zinc-400">
                  {formatBytes(stats?.cloudinarySizeBytes || 0)} / {formatBytes(CLOUDINARY_QUOTA_BYTES, 0)}
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500">
              <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="font-bold text-zinc-700 dark:text-zinc-300">Notice:</strong> Storage calculations are cached for 5 minutes to prevent rate limiting and reduce load on the database. 
                The numbers displayed may take up to 5 minutes to reflect recent uploads or deletions.
              </p>
            </div>
          </div>
        </section>

        {/* Storage Files */}
        <section className="mt-16">
          <div 
            className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900 cursor-pointer group"
            onClick={toggleFiles}
          >
            <div className="flex items-center gap-2">
              <TableProperties className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Storage Files & Breakdown {totalFiles > 0 ? `(${totalFiles})` : ''}</h2>
            </div>
            {filesExpanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            )}
          </div>
          
          {filesExpanded && (
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-x-auto">
              {loadingFiles && (!files || files.length === 0) ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                </div>
              ) : files && files.length > 0 ? (
                <>
                  <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-900">
                      <th className="pb-3 pl-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">File</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Source</th>
                      <th className="pb-3 pr-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
                    {files.map((file) => (
                      <tr key={file.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="py-4 pl-4 flex items-center gap-3">
                          {file.type === "image" && <ImageIcon className="w-4 h-4 text-blue-500" />}
                          {file.type === "video" && <Video className="w-4 h-4 text-purple-500" />}
                          {file.type === "document" && <FileText className="w-4 h-4 text-amber-500" />}
                          {file.type === "database" && <Database className="w-4 h-4 text-emerald-500" />}
                          {file.type === "other" && <File className="w-4 h-4 text-zinc-400" />}
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-sm md:max-w-md">
                            {file.name}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                            {file.source}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right text-sm font-medium text-zinc-900 dark:text-white">
                          {formatBytes(file.sizeBytes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {files && files.length < totalFiles && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchFiles(nextPage);
                      }}
                      disabled={loadingFiles}
                      className="px-6 py-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50"
                    >
                      {loadingFiles ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        `Load More (${totalFiles - files.length} remaining)`
                      )}
                    </button>
                  </div>
                )}
                </>
            ) : filesError ? (
                <div className="py-12 text-center text-sm text-red-500 font-medium">
                  Failed to load files: {filesError}
                </div>
            ) : (
                <div className="py-12 text-center text-sm text-zinc-500">
                  No files found.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
