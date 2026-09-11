"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Skill {
  id: number;
  name: string;
  description: string;
  proficiency: number;
  isActive: boolean;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", proficiency: 75, isActive: true });

  const router = useRouter();
  const BACKEND_URL = "http://localhost:8080";
  const getToken = () => localStorage.getItem("adminToken");

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/skills`);
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) { router.push("/admin/login"); return; }
    fetchSkills();
  }, []);

  const openCreateForm = () => {
    setForm({ name: "", description: "", proficiency: 75, isActive: true });
    setEditingId(null); setShowForm(true); setError("");
  };

  const openEditForm = (skill: Skill) => {
    setForm({ name: skill.name, description: skill.description, proficiency: skill.proficiency, isActive: skill.isActive });
    setEditingId(skill.id); setShowForm(true); setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const url = editingId ? `${BACKEND_URL}/skills/${editingId}` : `${BACKEND_URL}/skills`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save skill");
      setShowForm(false); setEditingId(null); fetchSkills();
    } catch (err: any) { setError(err.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    await fetch(`${BACKEND_URL}/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  };

  if (isLoading) return <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center"><p className="font-extrabold text-2xl bg-white border-[3px] border-black p-6 shadow-[4px_4px_0_0_#000]">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/dashboard" className="font-extrabold uppercase border-[3px] border-black bg-white px-4 py-2 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]">← Back</Link>
          <h1 className="text-3xl font-extrabold uppercase bg-[#FF6B9D] text-white px-6 py-3 border-[3px] border-black shadow-[6px_6px_0_0_#000]">⭐ Manage Skills</h1>
          <button onClick={openCreateForm} className="font-extrabold uppercase border-[3px] border-black bg-[#4A90FF] text-white px-4 py-2 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]">+ New</button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-md shadow-[12px_12px_0_0_#000]">
            <h2 className="text-2xl font-extrabold uppercase mb-6">{editingId ? "Edit" : "New"} Skill</h2>
            {error && <div className="mb-4 p-3 bg-[#FF6B9D] text-white border-[3px] border-black font-bold">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]" />
              </div>
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]" />
              </div>
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Proficiency (0-100)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={100} value={form.proficiency}
                    onChange={e => setForm({ ...form, proficiency: Number(e.target.value) })}
                    className="flex-1 accent-[#FFD700]" />
                  <span className="font-extrabold text-lg w-10">{form.proficiency}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-6 h-6 border-[3px] border-black" />
                <label htmlFor="isActive" className="font-extrabold uppercase">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-4 bg-[#FFD700] border-[3px] border-black font-extrabold uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
                  {editingId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 bg-white border-[3px] border-black font-extrabold uppercase shadow-[4px_4px_0_0_#000]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white border-[3px] border-black overflow-hidden shadow-[8px_8px_0_0_#000]">
        <table className="w-full">
          <thead className="bg-[#FF6B9D] text-white border-b-[3px] border-black">
            <tr>
              <th className="p-4 text-left font-extrabold uppercase">Name</th>
              <th className="p-4 text-center font-extrabold uppercase">Proficiency</th>
              <th className="p-4 text-center font-extrabold uppercase">Status</th>
              <th className="p-4 text-center font-extrabold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center font-bold">No skills yet. Click "+ New" to create one!</td></tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill.id} className="border-b-[2px] border-black hover:bg-gray-100">
                  <td className="p-4"><p className="font-extrabold">{skill.name}</p></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-32 bg-gray-200 border-[2px] border-black h-4 overflow-hidden">
                        <div className="bg-[#00D26A] h-full" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                      <span className="font-bold text-sm">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 border-[2px] border-black font-bold text-xs ${skill.isActive ? 'bg-[#00D26A] text-white' : 'bg-gray-200'}`}>
                      {skill.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => openEditForm(skill)} className="px-3 py-1 bg-[#4A90FF] text-white border-[2px] border-black font-bold text-xs shadow-[2px_2px_0_0_#000]">Edit</button>
                      <button onClick={() => handleDelete(skill.id)} className="px-3 py-1 bg-[#FF6B9D] text-white border-[2px] border-black font-bold text-xs shadow-[2px_2px_0_0_#000]">Del</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}