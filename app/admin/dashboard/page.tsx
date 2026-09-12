"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  totalProjects: number;
  totalSkills: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalSkills: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const BACKEND_URL = "https://portofolio-backend-production-9cb2.up.railway.app";

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      fetchStats(token);
    }
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <p className="text-black font-extrabold text-2xl uppercase bg-white border-[3px] border-black p-6 shadow-[4px_4px_0_0_#000]">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Navbar */}
      <nav className="bg-[#FFD700] border-b-[4px] border-black py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-black uppercase tracking-tight">
            My<span className="text-[#FF6B9D]">Portfolio</span> Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#FF6B9D] text-white border-[3px] border-black font-extrabold uppercase hover:-translate-y-1 transition-transform"
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold mb-8 uppercase text-center bg-[#4A90FF] text-white px-8 py-4 inline-block border-[3px] border-black mx-auto">
          📊 Dashboard Overview
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Projects", value: stats.totalProjects, color: "#FFD700" },
            { label: "Total Skills", value: stats.totalSkills, color: "#FF6B9D" },
            { label: "Messages", value: stats.totalMessages, color: "#00D26A" },
            { label: "Unread", value: stats.unreadMessages, color: "#4A90FF" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white border-[3px] border-black p-8 text-center hover:-translate-y-2 transition-transform"
              style={{ boxShadow: "8px 8px 0 0 " + stat.color }}
            >
              <p className="text-gray-600 font-bold uppercase mb-2">{stat.label}</p>
              <p className="text-5xl font-extrabold text-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-3xl font-extrabold mb-6 uppercase bg-[#FFD700] text-black px-6 py-3 inline-block border-[3px] border-black">
          Quick Actions
        </h3>

        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { label: "Manage Projects", icon: "📁", color: "#FFD700", href: "/admin/projects" },
            { label: "Manage Skills", icon: "⭐", color: "#FF6B9D", href: "/admin/skills" },
            { label: "Inbox Messages", icon: "📧", color: "#00D26A", href: "/admin/messages" },
            { label: "View Site", icon: "🌐", color: "#4A90FF", href: "/" },
          ].map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="flex items-center gap-3 px-8 py-4 bg-white border-[3px] border-black font-extrabold uppercase hover:-translate-y-1 transition-transform group min-w-[250px]"
              style={{ boxShadow: "6px 6px 0 0 " + action.color }}
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}