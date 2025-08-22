"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";

interface StatusMessage {
  success: boolean | null;
  message: string | null;
}

export default function Page() {
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    success: null,
    message: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage({ success: null, message: null });
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/reset/request-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email") as string,
      }),
    });

    setLoading(false);

    if (!res?.ok) {
      const data = await res.json();

      setStatusMessage({
        success: false,
        message: data.message || "Something went wrong",
      });
      return;
    }

    setStatusMessage({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen py-50 pt-70">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#1f639e]">
          Request a password reset
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please enter your email address to receive a password reset link.
        </p>
        <form
          className={`space-y-4 ${loading ? "!cursor-wait" : ""}`}
          onSubmit={handleSubmit}
        >
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Email
          </Label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1f639e] hover:bg-[#164a73] text-white py-2 rounded-md transition duration-200"
          >
            Send reset link
          </button>

          <p
            className={`text-center text-${statusMessage.success ? "green-600" : "red-500"} text-m fade-in ${statusMessage.message ? "opacity-100" : "opacity-0"}`}
          >
            {statusMessage.message}
          </p>
        </form>
      </div>
    </div>
  );
}
