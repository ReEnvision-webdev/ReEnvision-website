"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface StatusMessage {
  success: boolean | null;
  message: string | null;
}

export default function SignupPage() {
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    success: null,
    message: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage({ success: null, message: null });
    const formData = new FormData(event.target as HTMLFormElement);

    if (
      !/^[\p{L} ]+$/u.test(
        formData.get("fullname")?.toString().trim() as string | "",
      )
    ) {
      setStatusMessage({
        success: false,
        message: "Full name can only contain letters and spaces",
      });
      return;
    }

    if (formData.get("password") !== formData.get("confirm-password")) {
      setStatusMessage({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("fullname")?.toString().trim(),
        email: formData.get("email")?.toString().trim(),
        password: formData.get("password")?.toString().trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      setStatusMessage({
        success: false,
        message: data.message || "Something went wrong",
      });
      return;
    } else {
      setStatusMessage({
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-30 pb-18 px-4">
      <div className="bg-white rounded-lg shadow-lg px-8 pt-8 pb-10 w-full max-w-md relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-0 right-0 w-75 h-75 bg-[#1d588a] rounded-full -translate-y-50 translate-x-40"></div>
        <div className="absolute -top-12 right-20 w-24 h-24 bg-gray-300 rounded-full"></div>
        <div className="absolute top-11 right-12 w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="absolute top-20 right-3 w-7 h-7 bg-gray-300 rounded-full"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-[#1d588a] mb-2 mt-4">
            Welcome!
          </h1>
          <p className="text-gray-600 mb-8">
            Start your journey to free, unlimited learning.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="fullname"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Full name
              </Label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                placeholder="John Doe"
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <div>
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
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Password
              </Label>
              <input
                id="password"
                type="password"
                name="password"
                minLength={6}
                placeholder="Password123"
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Confirm password
              </Label>
              <input
                id="confirm-password"
                type="password"
                name="confirm-password"
                placeholder="Password123"
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <Button
              className="w-full bg-[#1d588a] hover:bg-[#164a73] text-white rounded-lg font-semibold text-lg py-6 mt-4"
              type="submit"
            >
              Sign Up
            </Button>

            <p
              className={`text-center text-${statusMessage.success ? "green-600" : "red-500"} text-m fade-in ${statusMessage.message ? "opacity-100" : "opacity-0"}`}
            >
              {statusMessage.message}
            </p>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Have an account?{" "}
            <Link href="/signin" className="text-blue-500 hover:text-blue-600">
              Log In Here
            </Link>
          </p>

          <p className="text-center text-gray-600 mt-2">
            Need help?{" "}
            <Link href="/contact" className="text-blue-500 hover:text-blue-600">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
