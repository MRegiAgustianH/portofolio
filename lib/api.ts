// Ini kayak "Service" di Laravel yang handle HTTP requests ke API
// Di Laravel biasanya ada app/Http/Client/ApiClient.php

// TEMPORARY DEBUG - REPLACE WITH ENV VAR AFTER VERIFICATION
const BACKEND_URL = 'https://portofolio-backend-production-9cb2.up.railway.app';
// const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Interface = tipe data TypeScript (seperti type hinting di Laravel)
export interface Project {
  id: number;
  name: string;
  description: string;
  url: string | null;
  techStack: string[] | null;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  proficiency: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

// Get all projects dengan pagination (mirip Laravel's paginate())
export async function getProjects(page: number = 1, limit: number = 10): Promise<{
  data: Project[];
  meta: { currentPage: number; itemsPerPage: number; totalItems: number };
}> {
  const response = await fetch(`${BACKEND_URL}/projects?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

// Get single project by ID
export async function getProject(id: number): Promise<Project> {
  const response = await fetch(`${BACKEND_URL}/projects/${id}`);
  if (!response.ok) throw new Error('Project not found');
  return response.json();
}

// GET all skills (untuk halaman Skills)
export async function getSkills(): Promise<Skill[]> {
  const response = await fetch(`${BACKEND_URL}/skills`);
  if (!response.ok) throw new Error('Failed to fetch skills');
  return response.json();
}

// POST contact form submission
export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactMessage> {
  const response = await fetch(`${BACKEND_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
}