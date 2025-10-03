"use client";

import { delay } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function VerifyUpdateEmailPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirected, setRedirected] = useState(false);
  const { update } = useSession();

  useEffect(() => {
    (async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");
        const token = urlParams.get("token");
        const userId = urlParams.get("userId");

        const res = await fetch("/api/user/verify-update-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            userId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setSuccess(true);

          // Update the session with the new user data
          if (data.data) {
            await update({
              user: {
                ...data.data
              }
            });
          }

          delay(2000).then(() => {
            setRedirected(true);
            redirect("/settings");
          });
        } else {
          const data = await res.json();
          setError(data.error);

          if (res.status === 409) {
            setError(
              "Email is already verified. You will be redirected to the settings page in 2 seconds."
            );

            delay(2000).then(() => {
              setRedirected(true);
              redirect("/settings");
            });
          }
        }
      } catch (error) {
        console.error("Error verifying email update:", error);
        setError("Something went wrong while verifying your email update.");
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 pt-20">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-8">Email Update Verification</h1>
        <div className="pt-8">
          {!success
            ? error
              ? error
              : "Verifying email..."
            : "Email updated successfully! Redirecting to settings page in 2 seconds..."}
        </div>

        {redirected && (
          <p className="mt-4">
            Click{" "}
            <Link href="/settings" className="text-blue-600 hover:underline">
              here
            </Link>{" "}
            if you are not redirected automatically.
          </p>
        )}
      </div>
    </div>
  );
}