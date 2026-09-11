"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Interface data dari backend
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

interface Skill {
  id: number;
  name: string;
  proficiency: number;
}

const BACKEND_URL = "https://portofolio-backend-production-9cb2.up.railway.app";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, skillRes] = await Promise.all([
          fetch(`${BACKEND_URL}/projects`),
          fetch(`${BACKEND_URL}/skills`),
        ]);

        const projData = await projRes.json();
        const skillData = await skillRes.json();

        // Projects: bisa bentuk paginated {data: [...]} atau array langsung
        const projList: Project[] = projData?.data || (Array.isArray(projData) ? projData : []);
        const skillList: Skill[] = Array.isArray(skillData) ? skillData : skillData?.data || [];

        setProjects(projList.filter((p: Project) => p.isLive).slice(0, 6));
        setSkills(skillList);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Stats dari database real
  const totalProjects = projects.length;
  const totalSkills = skills.length;

  const stats = [
    { label: "Projects Completed", value: totalProjects > 0 ? `${totalProjects}+` : "0", color: "#FFD700" },
    { label: "Skills & Technologies", value: totalSkills > 0 ? `${totalSkills}+` : "0", color: "#FF6B9D" },
    { label: "Years Experience", value: "2025+", color: "#00D26A" },
  ];

  // Warna header bergantian untuk project cards
  const headerColors = ["#4A90FF", "#FF6B9D", "#00D26A", "#FFD700", "#FF6B35", "#9B59B6"];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section
        className="bg-[#4A90FF] border-b-[4px] border-black py-20 px-4 sm:px-6 lg:px-8"
        style={{ boxShadow: "0 6px 0 0 #000" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-none uppercase">
            Hi, I&apos;m{" "}
            <span className="bg-black text-white px-3 py-1 inline-block border-[3px] border-black" style={{ boxShadow: "6px 6px 0 0 #FFD700" }}>
              ALING
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-bold uppercase tracking-wide text-white">
            Full Stack Developer | Laravel & Node.js Enthusiast
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto font-medium text-white/95">
            I build modern web applications with clean code and great user experiences.
            Let&apos;s create something amazing together!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B9D] text-white border-[3px] border-black font-extrabold uppercase tracking-wide hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              View Projects
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black border-[3px] border-black font-extrabold uppercase tracking-wide hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - dari database real */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white border-[3px] border-black hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                style={{ boxShadow: `6px 6px 0 0 ${stat.color}` }}
              >
                <div className="text-5xl font-extrabold text-black mb-2 uppercase">
                  {stat.value}
                </div>
                <div className="font-bold uppercase text-sm tracking-wide text-black">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - dari database */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="inline-block text-3xl md:text-4xl font-extrabold uppercase bg-[#4A90FF] text-white px-6 py-3 border-[3px] border-black"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              Featured Projects
            </h2>
            <p className="text-lg font-bold mt-6 text-black">
              Some of my recent work from the database
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="font-extrabold text-2xl bg-white border-[3px] border-black p-6 inline-block">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-extrabold text-xl bg-white border-[3px] border-black p-6 inline-block shadow-[4px_4px_0_0_#000]">
                No projects yet. Add one from the admin panel!
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
                    className="h-40 border-b-[3px] border-black flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: headerColors[index % headerColors.length] }}
                  >
                    {project.imageUrl ? (
                      <img src={`${BACKEND_URL}${project.imageUrl}`} alt={project.name}
                        className="w-full h-full object-cover border-b-[3px] border-black" />
                    ) : (
                      <span className="text-4xl font-extrabold text-white uppercase">PROJECT</span>
                    )}
                    {project.isLive && (
                      <span className="absolute ml-44 mt-16 px-3 py-1 bg-[#00D26A] text-white text-xs font-extrabold uppercase border-[2px] border-black shadow-[2px_2px_0_0_#000]">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold mb-2 text-black uppercase">
                      {project.name}
                    </h3>
                    <p className="text-black font-medium mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.techStack || []).map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#FFD700] text-black text-xs font-extrabold uppercase border-[2px] border-black">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-black font-extrabold uppercase text-sm hover:text-[#FF6B9D]"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] text-white border-[3px] border-black font-extrabold uppercase tracking-wide hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              View All Projects
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-[#FF6B9D] border-t-[4px] border-black py-16 px-4 sm:px-6 lg:px-8"
        style={{ boxShadow: "0 -6px 0 0 #000" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 uppercase">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-white font-bold mb-8 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#FFD700] text-black border-[3px] border-black font-extrabold uppercase text-lg tracking-wide hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
            style={{ boxShadow: "6px 6px 0 0 #000" }}
          >
            Let&apos;s Talk
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}