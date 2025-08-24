"use client"

import { useEffect, useRef } from "react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  approvalUrl: string | null
}

export default function PaymentModal({ isOpen, onClose, approvalUrl }: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const redirectToPayPal = () => {
      if (approvalUrl && isOpen) {
        window.location.href = approvalUrl
      }
    }

    redirectToPayPal()
  }, [approvalUrl, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d588a] mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Redirecting to PayPal</h3>
          <p className="text-gray-600 text-sm">Please wait while we redirect you to PayPal for secure payment...</p>
        </div>
      </div>
    </div>
  )
}
