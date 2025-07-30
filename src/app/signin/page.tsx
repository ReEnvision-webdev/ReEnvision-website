"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function SigninPage() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      email: login.email,
      password: login.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (!res?.ok) {
      return setError(
        res?.error || "An unexpected error occurred. Please try again later."
      );
    }

    redirect("/dashboard");
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
          <h1 className="text-5xl font-bold text-[#1d588a] mb-2 mt-8">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8">
            Continue expanding your skills and knowledge.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="john.doe@example.com"
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                onChange={e => {
                  setLogin({ ...login, email: e.target.value });
                }}
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
                placeholder="Password123"
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                onChange={e => {
                  setLogin({ ...login, password: e.target.value });
                }}
              />
            </div>

            <Button className="w-full bg-[#1d588a] hover:bg-[#164a73] text-white rounded-lg font-semibold text-lg py-6 mt-4">
              Log In
            </Button>

            <p
              className={`text-center text-red-500 text-sm fade-in ${error ? "opacity-100" : "opacity-0"}`}
            >
              {error}
            </p>
          </form>

          <div>
            <p className="text-center text-gray-600 mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-center text-gray-600 mt-2">
              <Link href="/reset" className="text-blue-500 hover:text-blue-600">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
