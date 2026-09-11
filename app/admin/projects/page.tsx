"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  description: string;
  url: string | null;
  techStack: string[];
  isLive: boolean;
  imageUrl: string | null;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    techStack: "",
    isLive: false,
    imageUrl: "",
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const BACKEND_URL = "http://localhost:8080";

  const getToken = () => localStorage.getItem("adminToken");

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects`);
      const data = await res.json();
      setProjects(data?.data || data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login");
      return;
    }
    fetchProjects();
  }, []);

  const openCreateForm = () => {
    setForm({ name: "", description: "", url: "", techStack: "", isLive: false, imageUrl: "" });
    setUploadedImage(null);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (project: Project) => {
    setForm({
      name: project.name,
      description: project.description,
      url: project.url || "",
      techStack: (project.techStack || []).join(", "),
      isLive: project.isLive,
      imageUrl: project.imageUrl || "",
    });
    setUploadedImage(null);
    setEditingId(project.id);
    setShowForm(true);
    setError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/uploads`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const body = {
      name: form.name,
      description: form.description,
      url: form.url || null,
      techStack: form.techStack.split(",").map((t: string) => t.trim()).filter(Boolean),
      isLive: form.isLive,
      imageUrl: form.imageUrl || null,
    };

    try {
      const url = editingId
        ? `${BACKEND_URL}/projects/${editingId}`
        : `${BACKEND_URL}/projects`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save project");

      setShowForm(false);
      setEditingId(null);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await fetch(`${BACKEND_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center"><p className="font-extrabold text-2xl bg-white border-[3px] border-black p-6 shadow-[4px_4px_0_0_#000]">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/dashboard" className="font-extrabold uppercase border-[3px] border-black bg-white px-4 py-2 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]">← Back</Link>
          <h1 className="text-3xl font-extrabold uppercase bg-[#4A90FF] text-white px-6 py-3 border-[3px] border-black shadow-[6px_6px_0_0_#000]">📁 Manage Projects</h1>
          <button onClick={openCreateForm} className="font-extrabold uppercase border-[3px] border-black bg-[#00D26A] text-white px-4 py-2 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]">+ New</button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-lg shadow-[12px_12px_0_0_#000] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold uppercase mb-6">{editingId ? "Edit" : "New"} Project</h2>
            {error && <div className="mb-4 p-3 bg-[#FF6B9D] text-white border-[3px] border-black font-bold shadow-[4px_4px_0_0_#000]">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]" />
              </div>
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]" />
              </div>
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">URL</label>
                <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]" placeholder="https://..." />
              </div>
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Screenshot</label>
                <input type="file" accept="image/png,image/jpeg,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700] file:mr-3 file:py-1 file:px-3 file:border-[2px] file:border-black file:bg-[#FFD700] file:font-extrabold file:text-xs file:uppercase" />
                {isUploading && <p className="text-sm font-bold mt-1 text-[#4A90FF]">Uploading...</p>}
                {form.imageUrl && (
                  <div className="mt-2">
                    <img src={`${BACKEND_URL}${form.imageUrl}`} alt="Preview" className="h-20 border-[2px] border-black shadow-[2px_2px_0_0_#000]" />
                  </div>
                )}
              </div>
              <div>
                <label className="block font-extrabold mb-1 uppercase text-sm">Tech Stack (pisah dengan koma)</label>
                <input type="text" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]" placeholder="Laravel, Vue.js, MySQL" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isLive" checked={form.isLive} onChange={e => setForm({ ...form, isLive: e.target.checked })}
                  className="w-6 h-6 border-[3px] border-black" />
                <label htmlFor="isLive" className="font-extrabold uppercase text-sm">Published / Live</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-4 bg-[#FFD700] border-[3px] border-black font-extrabold uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
                  {editingId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 bg-white border-[3px] border-black font-extrabold uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="max-w-7xl mx-auto bg-white border-[3px] border-black overflow-hidden shadow-[8px_8px_0_0_#000]">
        <table className="w-full">
          <thead className="bg-[#FFD700] border-b-[3px] border-black">
            <tr>
              <th className="p-4 text-left font-extrabold uppercase">Name</th>
              <th className="p-4 text-left font-extrabold uppercase hidden md:table-cell">Tech</th>
              <th className="p-4 text-center font-extrabold uppercase">Live</th>
              <th className="p-4 text-center font-extrabold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center font-bold">No projects yet. Click "+ New" to create one!</td></tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b-[3px] border-black hover:bg-yellow-50 transition-colors">
                  <td className="p-4">
                    <p className="font-extrabold text-lg text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-700 truncate max-w-[200px] mt-1">{project.description}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(project.techStack || []).slice(0, 3).map((t: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-[#FFD700] border-[2px] border-black text-xs font-bold text-black shadow-[1px_1px_0_0_#000]">{t}</span>
                      ))}
                      {(project.techStack || []).length > 3 && <span className="text-xs font-bold text-black ml-1">+{project.techStack.length - 3}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 border-[2px] border-black font-bold text-xs shadow-[1px_1px_0_0_#000] ${project.isLive ? 'bg-[#00D26A] text-white' : 'bg-[#9B59B6] text-white'}`}>
                      {project.isLive ? "LIVE ✅" : "DRAFT 📝"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => openEditForm(project)} className="px-3 py-1 bg-[#4A90FF] text-white border-[2px] border-black font-bold text-xs shadow-[2px_2px_0_0_#000] hover:-translate-y-[1px] transition-transform">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-[#FF6B9D] text-white border-[2px] border-black font-bold text-xs shadow-[2px_2px_0_0_#000] hover:-translate-y-[1px] transition-transform">Delete</button>
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