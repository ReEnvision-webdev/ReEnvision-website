"use client"
import { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import Link from "next/link"
import PaymentModal from "@/components/PaymentModal"
import { createPayPalPayment } from "@/app/actions/create-paypal-payment"

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<string>("")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    })
  }, [])

  const donationAmounts = ["$10", "$20", "$40", "$50"]

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount("Other")
  }

  const getDonationAmount = (): number => {
    if (selectedAmount === "Other" && customAmount) {
      return Number.parseFloat(customAmount)
    } else if (selectedAmount && selectedAmount !== "Other") {
      return Number.parseFloat(selectedAmount.replace("$", ""))
    }
    return 0
  }

  const handleDonate = async () => {
    const amount = getDonationAmount()

    // Validation
    if (amount <= 0) {
      alert("Please select or enter a valid donation amount")
      return
    }

    if (amount < 1) {
      alert("Minimum donation amount is $1")
      return
    }

    setIsLoading(true)

    try {
      const result = await createPayPalPayment(amount, "Anonymous Donor")
      setApprovalUrl(result.approvalUrl)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error creating PayPal payment:", error)
      alert("There was an error processing your donation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setApprovalUrl(null)
  }

  return (
    <>
      <div className="bg-[#F0F8FF] pt-30 pb-18 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Section - Mission Statement */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-gray-50 lg:bg-white">
                <div data-aos="fade-right" data-aos-delay="200">
                  <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold text-[#1d588a] mb-4 leading-tight">
                    Power our mission to educate
                  </h1>
                  <p className="text-gray-600 text-lg md:text-lg text-center lg:text-left leading-relaxed">
                    Help us make tech education free and accessible for everyone, everywhere. Your support enables us to
                    create more cutting-edge content, enhance our platform&apos;s functionality, and reach learners
                    worldwide who lack access to quality technology resources. Every donation, no matter the size, helps
                    us build a future where tech literacy is universal and learning opportunities are available to all,
                    regardless of their circumstances.{" "}
                  </p>
                </div>
              </div>

              {/* Right Section - Donation Form */}
              <div className="p-6 sm:p-8 lg:p-12 bg-white">
                <div data-aos="fade-left" data-aos-delay="400">
                  <h2 className="text-3xl font-bold text-[#1d588a] mb-6 text-center lg:text-left">Select An Amount</h2>

                  {/* Amount Selection Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 mb-6 sm:mb-8">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleAmountSelect(amount)}
                        className={`py-3 sm:py-4 px-4 sm:px-5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
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
                  <div className="mb-6 sm:mb-8">
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      className="w-full py-3 sm:py-4 px-4 sm:px-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      min="1"
                      step="0.01"
                    />
                  </div>

                  {/* Selected Amount Display */}
                  {getDonationAmount() > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Donation Amount: </span>${getDonationAmount().toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Donate Button */}
                  <button
                    onClick={handleDonate}
                    disabled={isLoading || getDonationAmount() <= 0}
                    className="w-full bg-[#1d588a] text-white py-4 sm:py-5 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#164a73] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Donate with PayPal"
                    )}
                  </button>

                  {/* Alternative PayPal Link */}
 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal isOpen={isModalOpen} onClose={closeModal} approvalUrl={approvalUrl} />
    </>
  )
}
