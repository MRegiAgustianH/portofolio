import { redirect } from "next/navigation";

export default function AdminRedirect() {
  // Auto redirect to login if no token
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  if (token) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
}