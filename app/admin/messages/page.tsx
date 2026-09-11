"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const BACKEND_URL = "http://localhost:8080";

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    fetchMessages(t);
  }, []);

  const fetchMessages = async (t: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center"><p className="font-extrabold text-2xl bg-white border-[3px] border-black p-6">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/dashboard" className="font-extrabold uppercase border-[3px] border-black bg-white px-4 py-2 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]">← Back</Link>
          <h1 className="text-3xl font-extrabold uppercase bg-[#00D26A] text-white px-6 py-3 border-[3px] border-black shadow-[6px_6px_0_0_#000]">📧 Messages Inbox</h1>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-white border-[3px] border-black overflow-hidden shadow-[6px_6px_0_0_#000] max-h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center font-bold">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 border-b-[2px] border-black cursor-pointer hover:bg-yellow-100 transition-colors ${selectedMessage?.id === msg.id ? 'bg-[#FFD700]' : ''} ${!msg.isRead ? 'bg-[#FFF8E7]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.isRead && <span className="w-2 h-2 bg-[#FF6B9D] rounded-full"></span>}
                    <p className="font-extrabold text-sm truncate">{msg.name}</p>
                  </div>
                  <p className="text-xs font-bold truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-600 mt-1">{new Date(msg.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white border-[3px] border-black p-6 shadow-[6px_6px_0_0_#000] min-h-[300px]">
            {selectedMessage ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold uppercase">{selectedMessage.subject}</h2>
                    <p className="font-bold mt-1">From: {selectedMessage.name} ({selectedMessage.email})</p>
                    <p className="text-sm text-gray-600">{new Date(selectedMessage.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                  <button onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2 bg-[#FF6B9D] text-white border-[3px] border-black font-extrabold uppercase text-sm shadow-[3px_3px_0_0_#000] hover:-translate-y-1 transition-transform">
                    Delete
                  </button>
                </div>
                <div className="border-t-[2px] border-black pt-6">
                  <p className="font-medium whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl font-bold text-gray-400">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}