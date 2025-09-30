"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-lg">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your payment. Your enrollment is complete.
        </p>
        <Link href="/courses">
          <a className="text-white bg-[#1d588a] hover:bg-[#1f639e] font-bold py-2 px-4 rounded">
            Return to Courses
          </a>
        </Link>
      </div>
    </div>
  );
}
