"use client";

import { useEffect, useState } from "react";
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

const BACKEND_URL = "http://localhost:8080";
const headerColors = ["#4A90FF", "#FF6B9D", "#00D26A", "#FFD700", "#FF6B35"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        const list: Project[] = data?.data || (Array.isArray(data) ? data : []);
        setProjects(list.filter((p: Project) => p.isLive));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="bg-[#9B59B6] border-b-[4px] border-black py-20 px-4 sm:px-6 lg:px-8"
        style={{ boxShadow: "0 6px 0 0 #000" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase bg-black inline-block px-4 py-2 border-[3px] border-black shadow-[3px_3px_0_0_#000]">
            Featured Projects
          </h1>
          <p className="text-xl font-bold text-white/95 max-w-3xl mt-4">
            Browse through my latest work and professional projects
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="font-extrabold text-2xl bg-white border-[3px] border-black p-6 inline-block">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-extrabold text-xl bg-white border-[3px] border-black p-6 inline-block shadow-[4px_4px_0_0_#000]">
                No live projects yet. Add one from the admin panel!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-white border-[3px] border-black overflow-hidden hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                  style={{ boxShadow: "6px 6px 0 0 #000" }}
                >
                  <div
                    className="h-48 border-b-[3px] border-black relative overflow-hidden"
                    style={{ backgroundColor: headerColors[index % headerColors.length] }}
                  >
                    {project.imageUrl ? (
                      <img src={`${BACKEND_URL}${project.imageUrl}`} alt={project.name}
                        className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-extrabold text-white uppercase opacity-90">PROJECT</span>
                    )}
                    {project.isLive && (
                      <span
                        className="absolute top-3 right-3 px-3 py-1 bg-[#00D26A] text-white text-xs font-extrabold uppercase border-[2px] border-black"
                        style={{ boxShadow: "3px 3px 0 0 #000" }}
                      >
                        Live ✅
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-extrabold mb-3 text-black uppercase">
                      {project.name}
                    </h3>
                    <p className="text-black font-medium mb-4">
                      {project.description}
                    </p>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[#FFD700] text-black text-xs font-extrabold uppercase border-[2px] border-black"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t-[2px] border-black pt-4">
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black font-extrabold uppercase text-sm hover:text-[#FF6B9D]"
                        >
                          View Project →
                        </a>
                      ) : (
                        <span className="text-gray-500 font-extrabold uppercase text-xs">No Link</span>
                      )}
                      <span className="text-xs font-bold text-black bg-[#FFD700] border-[2px] border-black px-2 py-1">
                        {new Date(project.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black border-[3px] border-black font-extrabold uppercase tracking-wide hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}