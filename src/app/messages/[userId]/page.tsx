'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Send, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender: { id: string; username: string; displayName: string; avatar?: string };
  recipient: { id: string; username: string; displayName: string; avatar?: string };
  content: string;
  createdAt: string;
  read: boolean;
}

export default function MessagesPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchMessages = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/messages/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      setIsSending(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: userId,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred');
    } finally {
      setIsSending(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <p className="text-gray-600 mt-2">Select a conversation to continue</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Get the other user info from the last message
  const otherUser = messages.length > 0
    ? messages[0].sender.id === userId
      ? messages[0].sender
      : messages[0].recipient
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/messages" className="text-blue-600 hover:text-blue-700">
              ← Back
            </Link>
            {otherUser && (
              <div>
                <h2 className="font-semibold text-gray-900">{otherUser.displayName}</h2>
                <p className="text-sm text-gray-600">@{otherUser.username}</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender.id === userId ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender.id === userId
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender.id === userId
                      ? 'text-gray-600'
                      : 'text-blue-100'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isSending && <Loader className="w-4 h-4 animate-spin" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
