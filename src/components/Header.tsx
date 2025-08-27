"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        size="sm"
        className={`hover:bg-[#F0F8FF] hover:text-[#1d588a] ${isActive ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
      >
        {label}
      </Button>
    </Link>
  );
}

function EventsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isEventsActive =
    pathname === "/events" || pathname === "/events/search";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`hover:bg-[#F0F8FF] hover:text-[#1d588a] ${isEventsActive ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"} `}
      >
        Events
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-0 w-48 bg-[#1d588a] border border-[#00427A] shadow-lg z-50">
          <Link href="/events">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/events" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              Overview
            </Button>
          </Link>
          <Link href="/events/search">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/events/search" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              All Events
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="text-[#F0F8FF] hover:bg-[#00427A] p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1d588a] border-t border-[#00427A] shadow-lg z-40">
          <div className="flex flex-col space-y-2 p-4">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/courses", label: "Courses" },
              { href: "/donate", label: "Donate" },
              { href: "/contact", label: "Contact Us" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`justify-start hover:bg-[#F0F8FF] ${
                    pathname === href
                      ? "bg-[#F0F8FF] text-[#1d588a]"
                      : "text-[#F0F8FF]"
                  }`}
                >
                  {label}
                </Button>
              </Link>
            ))}
            {/* Events Dropdown for Mobile */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                className={`justify-between w-full hover:bg-[#F0F8FF] rounded-none ${pathname.startsWith("/events") ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                onClick={() => setIsEventsOpen(!isEventsOpen)}
              >
                Events
                <svg
                  className={`h-4 w-4 transition-transform ${isEventsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
              {isEventsOpen && (
                <div className="mt-1 ml-4 flex flex-col space-y-1">
                  <Link href="/events">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start hover:bg-[#F0F8FF] w-full rounded-none ${pathname === "/events" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                    >
                      Overview
                    </Button>
                  </Link>
                  <Link href="/events/search">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start hover:bg-[#F0F8FF] w-full rounded-none ${pathname === "/events/search" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                    >
                      All Events
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {status === "authenticated" ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`bg-transparent border-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] mt-2 ${
                      pathname === "/dashboard"
                        ? "bg-[#F0F8FF] text-[#1d588a]"
                        : "text-[#F0F8FF]"
                    }`}
                  >
                    {session?.user?.isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-[#F0F8FF] text-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] mt-2 w-full"
                  onClick={() => {
                    if (confirm("Are you sure you want to sign out?")) {
                      signOut();
                    }
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-[#F0F8FF] text-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] mt-2"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="bg-[#1d588a] text-[#F0F8FF] px-4 py-3 fixed top-0 left-0 right-0 z-50">
      {/* Added `fixed`, `top-0`, `left-0`, `right-0` */}
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/vectors/favicon.svg" // Path to your favicon.png
            alt="Logo"
            width={50} // Specify the width (in pixels)
            height={50} // Specify the height (in pixels)
            className="h-15 w-15" // Optional: Add any additional styles
          />
          <span className="text-xl font-bold">ReEnvision</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
          <NavLink href="/courses" label="Courses" />
          <EventsDropdown />
          <NavLink href="/donate" label="Donate" />
          <NavLink href="/contact" label="Contact Us" />
        </nav>

        <div className="flex items-center space-x-2">
          {status === "authenticated" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className={`bg-transparent border-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] hidden md:block ${
                  pathname === "/dashboard"
                    ? "bg-[#F0F8FF] text-[#1d588a]"
                    : "text-[#F0F8FF]"
                }`}
              >
                <Link href="/dashboard">
                  {session?.user?.isAdmin ? "Admin Dashboard" : "Dashboard"}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#F0F8FF] text-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] hidden md:block"
                onClick={() => {
                  if (confirm("Are you sure you want to sign out?")) {
                    signOut();
                  }
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={`bg-transparent border-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] hidden md:block ${
                pathname === "/signin"
                  ? "bg-[#F0F8FF] text-[#1d588a]"
                  : "text-[#F0F8FF]"
              }`}
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
