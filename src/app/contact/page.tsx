"use client";
import type React from "react";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center pt-30 pb-18 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl py-8 md:py-2 flex flex-col lg:flex-row gap-12 items-stretch justify-center min-h-[80vh]">
        {/* Left Column - Contact Information */}
        <div className="flex-1 flex flex-col justify-center space-y-4 mx-4 lg:px-8 my-10" data-aos="fade-right">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 lg:text-left text-center text-[#1d588a]">
              Get in Touch
            </h1>
            <p className="text-gray-600 text-lg md:text-lg lg:text-left text-center leading-relaxed">
              We&apos;d love to hear from you. Reach out to us through any of
              the following ways or fill out the form.
            </p>
          </div>
          <div className="space-y-6 my-6">
            <a
              href="tel:+12815050184"
              className="flex items-start space-x-4 justify-left md:justify-start group"
            >
              <div className="w-12 h-12 bg-[#1d588a] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#164a73] transition-colors duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Phone
                </h3>
                <p className="text-gray-600 group-hover:text-[#1d588a] transition-colors duration-200">
                  +1 (281) 505-0184
                </p>
              </div>
            </a>
            <a
              href="mailto:contact@re-envision.org"
              className="flex items-start space-x-4 justify-left md:justify-start group"
            >
              <div className="w-12 h-12 bg-[#1d588a] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#164a73] transition-colors duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Email
                </h3>
                <p className="text-gray-600 group-hover:text-[#1d588a] transition-colors duration-200">
                  contact@re-envision.org
                </p>
              </div>
            </a>
          </div>
        </div>
        {/* Right Column - Contact Form */}
        <div className="flex-1 flex flex-col justify-center mx-4" data-aos="fade-left">
          {!submitted ? (
            <div className="rounded-xl p-8">
              <h2 className="text-3xl font-bold text-[#1d588a] mb-6 lg:text-left text-center">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div data-aos="fade-up" data-aos-delay="100">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                    placeholder="Enter your name here..."
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="200">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                    placeholder="Enter your email here..."
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="300">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent bg-white resize-none"
                    placeholder="Type your message here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1d588a] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#164a73] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-xl p-8" data-aos="fade-up">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-3xl md:text-4xl font-semibold text-[#1d588a] mb-2">
                Thank you!
              </div>
              <div className="text-gray-700 text-lg text-center">
                We&apos;ve received your message and will get back to you soon.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
