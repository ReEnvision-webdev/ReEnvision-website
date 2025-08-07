"use client";

import { delay } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [redirected, setRedirected] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    const token = new URLSearchParams(window.location.search).get("token");

    if (!email || !token) {
      setStatusMessage({
        success: false,
        message: "Invalid or missing email or token in the URL.",
      });

      return;
    }

    (async () => {
      const res = await fetch("/api/auth/reset/validate-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      });

      if (res.ok) {
        setValidated(true);
        return;
      }

      const data = await res.json();

      setStatusMessage({
        success: false,
        message: data.message || "Validation failed. Please try again.",
      });
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage({ success: null, message: null });

    const formData = new FormData(e.currentTarget);

    if (formData.get("password") !== formData.get("confirm-password")) {
      setStatusMessage({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: new URLSearchParams(window.location.search).get("email"),
        password: formData.get("password") as string,
        token: new URLSearchParams(window.location.search).get("token"),
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
        "Password has been reset successfully! You will be redirected to the signin page in 2 seconds.",
    });

    delay(2000).then(() => {
      setRedirected(true);

      redirect("/signin");
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {validated && (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Please enter your new password to reset your password.
            </p>
            <form
              className={`space-y-4 ${loading ? "!cursor-wait" : ""}`}
              onSubmit={handleSubmit}
            >
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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Reset password
              </button>

              <p
                className={`text-center text-${statusMessage.success ? "green-600" : "red-500"} text-m fade-in ${statusMessage.message ? "opacity-100" : "opacity-0"}`}
              >
                {statusMessage.message}
              </p>
            </form>
          </>
        )}

        {!validated && (
          <>
            <p className="text-center text-gray-800">
              {statusMessage.message || "Validating your request..."}
            </p>
          </>
        )}

        {redirected && (
          <p className="text-center text-gray-600 mt-2">
            <Link href="/signin" className="text-blue-600 hover:underline">
              here
            </Link>{" "}
            if you are not redirected automatically.
          </p>
        )}
      </div>
    </div>
  );
}
