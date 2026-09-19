"use client";

import { useState, useRef } from "react";
import {
  Terminal,
  Database,
  Trash2,
  UploadCloud,
  Clock,
  BarChart3,
  Crown,
  Loader2,
  ArrowLeft,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function OperationsPage() {
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [scriptOutput, setScriptOutput] = useState<{stdout?: string, stderr?: string, error?: string} | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runScript = async (scriptName: string) => {
    let args: any = {};
    
    if (scriptName === "bulk-upload") {
      const dir = prompt("Enter the absolute directory path containing the PDFs:");
      if (dir === null) return; // User clicked Cancel
      
      const email = prompt("Enter the email of the author account (leave blank for default admin):");
      if (email === null) return; // User clicked Cancel
      
      args = { dir, email };
    } else {
      if (!confirm(`Are you sure you want to run the ${scriptName} script? This may take a while.`)) return;
    }
    
    setRunningScript(scriptName);
    setScriptOutput({ stdout: `Executing ${scriptName}...\nWaiting for terminal output...` });
    
    abortControllerRef.current = new AbortController();
    
    try {
      const res = await fetch("/api/admin/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptName, ...args }),
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();
      setScriptOutput(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setScriptOutput({ error: "Script execution was cancelled by user." });
      } else {
        setScriptOutput({ error: error.message });
      }
    } finally {
      setRunningScript(null);
      abortControllerRef.current = null;
    }
  };

  const cancelScript = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">System Operations</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Direct execution of administrative scripts and maintenance tasks.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            Admin Protocol
          </div>
        </header>

        <section>
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">System Operations Registry</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => runScript("backup-db")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Backup Database</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Generates a complete snapshot of all tables as a JSON, SQL, and compressed dump file.</p>
              {runningScript === "backup-db" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("backup-media")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Backup Media Storage</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Downloads all files, PDFs, and images from Cloudflare R2 and Cloudinary into a local folder.</p>
              {runningScript === "backup-media" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("rebuild-search")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Rebuild Search Index</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Extracts text from all chapters and updates the PostgreSQL full-text search index.</p>
              {runningScript === "rebuild-search" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("cleanup-orphans")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Cleanup Orphans</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Scans Cloudflare R2 for orphaned files and removes them to save storage space.</p>
              {runningScript === "cleanup-orphans" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("bulk-upload")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <UploadCloud className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Bulk Upload Books</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Uploads multiple PDF books from a local directory into the platform automatically.</p>
              {runningScript === "bulk-upload" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("expire-promotions")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Expire Promotions</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Ends active promotions past their expiry date and resets their search ranking boost.</p>
              {runningScript === "expire-promotions" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("recalculate-stats")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Recalculate Stats</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Recomputes chapter counts, comment counts, and average ratings for all stories and books.</p>
              {runningScript === "recalculate-stats" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("upgrade-founding-users")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Upgrade Founding Users</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Grants the first 100 registered users AUTHOR role and CREATOR membership tier.</p>
              {runningScript === "upgrade-founding-users" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>
          </div>

          {scriptOutput && (
            <div className="mt-6 p-4 bg-zinc-900 rounded-md overflow-hidden border border-zinc-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Terminal Output</h3>
                <div className="flex items-center gap-3">
                  {runningScript && (
                    <button 
                      onClick={cancelScript} 
                      className="text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      Cancel Execution
                    </button>
                  )}
                  <button onClick={() => setScriptOutput(null)} className="text-xs text-zinc-500 hover:text-white">Close</button>
                </div>
              </div>
              
              {scriptOutput.error && (
                <div className="mb-4 text-red-400 text-xs font-mono whitespace-pre-wrap">
                  [ERROR] {scriptOutput.error}
                </div>
              )}
              
              {scriptOutput.stdout && (
                <div className="text-zinc-300 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {scriptOutput.stdout}
                </div>
              )}
              
              {scriptOutput.stderr && (
                <div className="mt-4 text-red-300 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto border-t border-zinc-800 pt-4">
                  [STDERR]
                  {'\n'}
                  {scriptOutput.stderr}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
