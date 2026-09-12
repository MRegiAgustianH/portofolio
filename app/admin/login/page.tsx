"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const BACKEND_URL = "https://portofolio-backend-production-9cb2.up.railway.app";

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Verify token by checking stats endpoint
      fetch(`${BACKEND_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          router.push("/admin/dashboard");
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
          setError("");
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token to localStorage
      localStorage.setItem("adminToken", data.accessToken);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] text-black flex items-center justify-center p-4">
      <div
        className="bg-white border-[3px] border-black p-8 w-full max-w-md shadow-[12px_12px_0_0_#000]"
        style={{ boxShadow: "12px 12px 0 0 #FFD700" }}
      >
        <h1 className="text-3xl font-extrabold mb-8 uppercase text-center bg-[#4A90FF] text-white px-6 py-3 inline-block border-[3px] border-black mx-auto">
          Admin Login
        </h1>

        {error && (
          <div
            className="mb-6 p-4 bg-[#FF6B9D] text-white border-[3px] border-black"
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-extrabold mb-2 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
              style={{ boxShadow: "4px 4px 0 0 #000" }}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block font-extrabold mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
              style={{ boxShadow: "4px 4px 0 0 #000" }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 border-[3px] border-black font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-1 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#FFD700] text-black hover:bg-[#FF6B9D] hover:text-white"
            }`}
            style={{ boxShadow: isLoading ? "none" : "6px 6px 0 0 #000" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Auto-login reminder */}
        <div className="mt-6 p-4 bg-blue-100 border-[3px] border-black rounded shadow-[3px_3px_0_0_#000]">
          <p className="text-xs font-bold text-center text-gray-700">
            🔒 Session saved automatically. You'll stay logged in until you logout.
          </p>
        </div>
      </div>
    </div>
  );
}