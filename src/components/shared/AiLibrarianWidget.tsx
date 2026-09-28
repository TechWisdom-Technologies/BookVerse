"use client";

import { Send, User, X, Sparkles, Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function AiLibrarianWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, dbUser } = useAuth();
  
  const userAvatar = dbUser?.avatarUrl || user?.photoURL;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for toggle events from the Navbar
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener("toggle-ai-librarian", handleToggle);
    return () => window.removeEventListener("toggle-ai-librarian", handleToggle);
  }, []);

  // Notify Navbar of state changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("ai-librarian-state", { detail: isOpen }));
  }, [isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;
    
    const userMessage = input;
    const newUserMsg = { id: Date.now().toString(), role: "user", content: userMessage };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newUserMsg] }),
      });

      if (!response.ok) throw new Error("Connection failed");
      
      const data = await response.json();
      const botMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: data.text || "I'm sorry, I couldn't generate a response." };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Maya Error:", err);
      setMessages(prev => [...prev, { 
        id: "error", 
        role: "assistant", 
        content: "I'm having trouble connecting to the library right now. Please check your internet or try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] max-h-[85vh] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/70 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-zinc-900/80"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-zinc-200/50 bg-white px-5 py-4 dark:border-zinc-800/50 dark:bg-zinc-950">
              <div className="absolute inset-0 bg-zinc-100/50 dark:bg-zinc-900/50 blur-xl mix-blend-overlay"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0">
                  <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/50 shadow-md dark:border-zinc-700/50">
                    <Image 
                      src="/Maya.jpg" 
                      alt="Maya" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900 z-10"></div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Maya
                  </h3>
                  <p className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Sparkles className="h-3 w-3 text-zinc-500 dark:text-zinc-400" /> BookVerse Librarian
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 rounded-full bg-white/50 p-2 text-zinc-500 backdrop-blur-md transition-all hover:bg-white hover:text-zinc-900 hover:shadow-sm dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!user ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-zinc-900/50">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/40 shadow-inner"
                >
                  <Lock className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />
                </motion.div>
                <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">Members Only</h3>
                <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                  Log in to get personalized book recommendations and insights from Maya.
                </p>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:bg-white dark:text-zinc-900 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10">Log in to Chat</span>
                  <div className="absolute inset-0 z-0 h-full w-full bg-zinc-800 dark:bg-zinc-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
                  {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="mb-5 relative"
                      >
                        <div className="absolute inset-0 bg-zinc-500 blur-2xl opacity-20 rounded-full scale-150"></div>
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-zinc-800">
                          <Image src="/Maya.jpg" alt="Maya" fill className="object-cover" />
                        </div>
                      </motion.div>
                      <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                        Welcome to BookVerse!
                      </h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[85%] mx-auto leading-relaxed">
                        Hi, I'm Maya! Ask me for book recommendations, describe your mood, or let's explore genres together.
                      </p>
                    </div>
                  ) : (
                    messages.map((m: any, idx: number) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={m.id || idx}
                        className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {m.role === "user" ? (
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-sm dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900 ring-1 ring-black/10 dark:ring-white/10">
                              {userAvatar ? (
                                <Image src={userAvatar} alt="User" width={32} height={32} className="object-cover h-full w-full" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                          ) : (
                            <div className="relative h-8 w-8 overflow-hidden rounded-full shadow-sm ring-2 ring-white/50 dark:ring-zinc-800/50">
                              <Image src="/Maya.jpg" alt="Maya" fill className="object-cover" />
                            </div>
                          )}
                        </div>
                        
                        {/* Bubble */}
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user"
                              ? "rounded-tr-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "rounded-tl-sm bg-white/80 backdrop-blur-sm border border-zinc-100 text-zinc-800 dark:border-zinc-800/50 dark:bg-zinc-800/80 dark:text-zinc-200 whitespace-pre-wrap"
                            }`}
                        >
                          {m.content}
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white/50 dark:ring-zinc-800/50">
                        <Image src="/Maya.jpg" alt="Maya" fill className="object-cover" />
                      </div>
                      <div className="flex max-w-[75%] items-center rounded-2xl rounded-tl-sm bg-white/80 backdrop-blur-sm border border-zinc-100 px-4 py-3.5 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-800/80">
                        <div className="flex gap-1.5">
                          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="h-2 w-2 rounded-full bg-zinc-500/60"></motion.div>
                          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-2 w-2 rounded-full bg-zinc-500/60"></motion.div>
                          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-2 w-2 rounded-full bg-zinc-500/60"></motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="bg-white/40 p-4 backdrop-blur-xl dark:bg-zinc-950/40 border-t border-zinc-200/50 dark:border-zinc-800/50">
                  <form
                    onSubmit={handleFormSubmit}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Maya..."
                      className="w-full rounded-full border border-zinc-200/80 bg-white/80 py-3 pl-5 pr-14 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-500/10 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-100 dark:focus:bg-zinc-900 transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input?.trim()}
                      className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
