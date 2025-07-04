import React from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1d588a] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">EduGateway</span>
          </div>
          <div className="text-center">
            <p className="text-blue-200">© 2024 EduGateway. All rights reserved.</p>
          </div>
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#1d588a]"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
