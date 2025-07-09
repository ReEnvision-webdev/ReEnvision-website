"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });
  }, []);

  const donationAmounts = ["$10", "$20", "$40", "$50"];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount("Other");
  };

  return (
    <div className="bg-[#F0F8FF] pt-20 py-4 px-4">
      <div className="container mx-auto max-w-6xl">
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          data-aos="fade-up"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Section - Mission Statement */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-gray-50 lg:bg-white">
              <div data-aos="fade-right" data-aos-delay="200">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1d588a] mb-6 leading-tight">
                  Power our mission to educate
                </h1>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  Help us keep education free and accessible for everyone,
                  everywhere. Your support allows us to create more content,
                  improve our platform&apos;s functionality, and reach learners
                  worldwide who can&apos;t afford traditional education. Every
                  donation, no matter the size, helps us build a better future
                  where knowledge knows no boundaries and learning opportunities
                  are available to all.
                </p>
              </div>
            </div>

            {/* Right Section - Donation Form */}
            <div className="p-8 lg:p-12 bg-white border-l border-gray-100">
              <div data-aos="fade-left" data-aos-delay="400">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6">
                  Select An Amount
                </h2>

                {/* Amount Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
                  {donationAmounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        selectedAmount === amount
                          ? "bg-[#1d588a] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mb-6">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={e => handleCustomAmount(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Name Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter your name here..."
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name..."
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  className="w-full bg-[#1d588a] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#164a73] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  Donate now
                </button>

                {/* PayPal Text */}
                <Link href="#">
                  <p
                    className="text-center text-gray-500 text-sm mt-4"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    Paypal
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
