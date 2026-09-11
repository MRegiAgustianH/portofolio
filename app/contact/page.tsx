"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";
import Link from "next/link";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await submitContact(formData);
      setSuccessMessage("Thank you! Your message has been sent successfully. I'll get back to you soon!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border-[3px] border-black font-medium text-black placeholder-gray-400 focus:outline-none focus:-translate-x-[2px] focus:-translate-y-[2px] transition-all";

  const inputStyle = { boxShadow: "4px 4px 0 0 #000" };

  return (
    <div className="min-h-screen">
      {/* Header Section - Neobrutalism */}
      <section
        className="bg-[#00D26A] border-b-[4px] border-black py-20 px-4 sm:px-6 lg:px-8"
        style={{ boxShadow: "0 6px 0 0 #000" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="inline-block text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase bg-black px-4 py-2 border-[3px] border-black">
            Get In Touch
          </h1>
          <p className="text-xl font-bold text-white max-w-3xl mx-auto mt-4">
            Have a project in mind or want to discuss something? I&apos;d love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF8E7]">
        <div className="max-w-4xl mx-auto">
          {/* Success Alert - Neobrutalism */}
          {successMessage && (
            <div
              className="mb-6 p-4 bg-[#00D26A] text-white border-[3px] border-black"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              <div className="flex items-center font-extrabold uppercase">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            </div>
          )}

          {/* Error Alert - Neobrutalism */}
          {errorMessage && (
            <div
              className="mb-6 p-4 bg-[#FF6B35] text-white border-[3px] border-black"
              style={{ boxShadow: "6px 6px 0 0 #000" }}
            >
              <div className="flex items-center font-extrabold uppercase">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Contact Form - Neobrutalism */}
          <div
            className="bg-white border-[3px] border-black p-8"
            style={{ boxShadow: "6px 6px 0 0 #000" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-extrabold text-black mb-2 uppercase">
                  Your Name <span className="text-[#FF6B35]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-extrabold text-black mb-2 uppercase">
                  Email Address <span className="text-[#FF6B35]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-extrabold text-black mb-2 uppercase">
                  Subject <span className="text-[#FF6B35]">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Project Inquiry"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-extrabold text-black mb-2 uppercase">
                  Your Message <span className="text-[#FF6B35]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              {/* Submit Button - Chunky Neobrutalism */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 border-[3px] border-black font-extrabold uppercase tracking-wide text-black transition-all flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#FFD700] hover:-translate-x-[2px] hover:-translate-y-[2px]"
                }`}
                style={{ boxShadow: isLoading ? "4px 4px 0 0 #000" : "6px 6px 0 0 #000" }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Contact Info - Neobrutalism cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div
              className="bg-white border-[3px] border-black p-6 text-center hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #4A90FF" }}
            >
              <div
                className="w-14 h-14 bg-[#4A90FF] border-[3px] border-black flex items-center justify-center mx-auto mb-4"
                style={{ boxShadow: "3px 3px 0 0 #000" }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-extrabold mb-2 text-black uppercase">Email</h3>
              <p className="text-black font-medium text-sm">muhmmad.regi@gmail.com</p>
            </div>

            {/* LinkedIn */}
            <div
              className="bg-white border-[3px] border-black p-6 text-center hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #FF6B9D" }}
            >
              <div
                className="w-14 h-14 bg-[#FF6B9D] border-[3px] border-black flex items-center justify-center mx-auto mb-4"
                style={{ boxShadow: "3px 3px 0 0 #000" }}
              >
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <h3 className="font-extrabold mb-2 text-black uppercase">LinkedIn</h3>
              <p className="text-black font-medium text-sm">linkedin.com/in/m-regi-agustian</p>
            </div>

            {/* GitHub */}
            <div
              className="bg-white border-[3px] border-black p-6 text-center hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              style={{ boxShadow: "6px 6px 0 0 #00D26A" }}
            >
              <div
                className="w-14 h-14 bg-[#00D26A] border-[3px] border-black flex items-center justify-center mx-auto mb-4"
                style={{ boxShadow: "3px 3px 0 0 #000" }}
              >
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <h3 className="font-extrabold mb-2 text-black uppercase">GitHub</h3>
              <p className="text-black font-medium text-sm">github.com/MRegiAgustianH</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
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
