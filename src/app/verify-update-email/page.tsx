'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VerifyUpdateEmailPage() {
  const { update } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your new email...');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setError(true);
      setMessage('Verification token is missing.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/user/verify-update-email?token=${token}`);
        const data = await res.json();

        if (isCancelled) {
          return;
        }

        if (res.ok && data.success) {
          setMessage('Email successfully updated! Redirecting to settings...');
          await update(); // Re-fetch the session to reflect the new email
          setTimeout(() => {
            router.push('/settings');
          }, 2000);
        } else {
          setError(true);
          setMessage(data.error || 'An error occurred during verification.');
        }
      } catch (e) {
        if (!isCancelled) {
          setError(true);
          setMessage('An unexpected error occurred.');
          console.error(e);
        }
      }
    };

    verifyToken();

    return () => {
      isCancelled = true;
    };
  }, [update, router]);

  return (
    <div className="container mx-auto p-6 py-25 text-center">
      <h1 className="text-3xl font-bold text-[#1f639e]">Email Verification</h1>
      <p className={`mt-4 text-lg ${error ? 'text-red-500' : 'text-gray-600'}`}>
        {message}
      </p>
    </div>
  );
}
