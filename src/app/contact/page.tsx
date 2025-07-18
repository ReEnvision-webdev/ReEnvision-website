"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-0 items-stretch md:items-center justify-center min-h-[70vh]">
        {/* Left Column */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:pr-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1d588a]">Get in Touch</h1>
          <p className="text-gray-600 text-base md:text-lg">
            We’d love to hear from you. Fill out the form and we’ll respond soon!
          </p>
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col justify-center">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent bg-white"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent bg-white"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent bg-white resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1d588a] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#164a73] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="text-3xl md:text-4xl font-semibold text-[#1d588a] mb-2">Thank you!</div>
              <div className="text-gray-700 text-base md:text-lg">We’ll get back to you soon.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 