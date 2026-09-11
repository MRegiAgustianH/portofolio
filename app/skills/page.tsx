"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Skill {
  id: number;
  name: string;
  description: string;
  proficiency: number;
  isActive: boolean;
}

const BACKEND_URL = "http://localhost:8080";
const accentColors = ["#FFD700", "#FF6B9D", "#4A90FF", "#00D26A", "#FF6B35", "#9B59B6"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/skills`)
      .then((res) => res.json())
      .then((data) => {
        const list: Skill[] = Array.isArray(data) ? data : data?.data || [];
        setSkills(list.filter((s: Skill) => s.isActive));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="bg-[#FF6B9D] border-b-[4px] border-black py-20 px-4 sm:px-6 lg:px-8"
        style={{ boxShadow: "0 6px 0 0 #000" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="inline-block text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase bg-black px-4 py-2 border-[3px] border-black shadow-[3px_3px_0_0_#000]">
            My Skills & Technologies
          </h1>
          <p className="text-xl font-bold text-white/95 max-w-3xl mx-auto mt-4">
            Browse through my technical expertise and professional skills
          </p>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="font-extrabold text-2xl bg-white border-[3px] border-black p-6 inline-block">Loading skills...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-extrabold text-xl bg-white border-[3px] border-black p-6 inline-block shadow-[4px_4px_0_0_#000]">
                No skills yet. Add them from the admin panel!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} accentColor={accentColors[index % accentColors.length]} />
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

function SkillCard({ skill, accentColor }: { skill: Skill; accentColor: string }) {
  return (
    <div
      className="bg-white border-[3px] border-black p-6 hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
      style={{ boxShadow: "6px 6px 0 0 #000" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-black mb-2 uppercase">{skill.name}</h3>
          <p className="text-black font-medium text-sm mb-4">{skill.description}</p>
        </div>
        <div
          className="w-5 h-5 border-[2px] border-black shrink-0 ml-3"
          style={{ backgroundColor: accentColor, boxShadow: "3px 3px 0 0 #000" }}
        ></div>
      </div>

      <div className="mb-3 flex justify-between text-sm">
        <span className="text-black font-extrabold uppercase">Proficiency</span>
        <span className="font-extrabold text-black">{skill.proficiency}%</span>
      </div>

      <div className="w-full bg-white border-[3px] border-black h-5 overflow-hidden">
        <div
          className="h-full border-r-[3px] border-black transition-all duration-500 ease-out"
          style={{ width: `${skill.proficiency}%`, backgroundColor: accentColor }}
        ></div>
      </div>

      {skill.isActive && (
        <span
          className="inline-block mt-4 px-3 py-1 bg-[#00D26A] text-white text-xs font-extrabold uppercase border-[2px] border-black"
          style={{ boxShadow: "3px 3px 0 0 #000" }}
        >
          Active Learning ✅
        </span>
      )}
    </div>
  );
}