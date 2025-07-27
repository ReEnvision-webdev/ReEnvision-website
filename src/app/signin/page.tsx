import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
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
          <h1 className="text-5xl font-bold text-[#1d588a] mb-2 mt-8">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">Continue expanding your skills and knwoledge.</p>
          
          <form className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Name
              </Label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name here..."
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </Label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password here..."
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d588a] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            
            <Button className="w-full bg-[#1d588a] hover:bg-[#164a73] text-white rounded-lg font-semibold text-lg py-6 mt-4">
              Sign Up
            </Button>
          </form>
          
          <p className="text-center text-gray-600 mt-4">
            Have an account?{" "}
            <Link href="/signi" className="text-blue-500 hover:text-blue-600">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}