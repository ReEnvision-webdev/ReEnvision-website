"use client";

import { delay } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: new URLSearchParams(window.location.search).get("email"),
            token: new URLSearchParams(window.location.search).get("token"),
          }),
        });

        if (res.ok) {
          setSuccess(true);

          delay(2000).then(() => {
            setRedirected(true);

            redirect("/signin");
          });
        } else {
          const data = await res.json();

          setError(data.error);

          if (res.status === 409) {
            setError("Email is already verified. You will be redirected to the signin page in 2 seconds.");

            delay(2000).then(() => {
              setRedirected(true);

              redirect("/signin");
            });
          }
        }
      } catch (error) {
        console.error("Error verifying email:", error);

        setError("Something went wrong while verifying your email.");
      }
    })();
  }, []);

  return (
    <h1 className="mt-30">
      {!success
        ? error
          ? error
          : "Verifying email..."
        : `Email verified successfully! Redirecting to signin page in 2 seconds...`}

      {redirected && (
        <p>
          Click <Link href="/signin">here</Link> if you are not redirected
          automatically.
        </p>
      )}
    </h1>
  );
}
