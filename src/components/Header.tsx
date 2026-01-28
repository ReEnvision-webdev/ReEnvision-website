"use client";

import React, { useState, useEffect, useRef } from "react";
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

function AboutDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAboutActive = pathname.startsWith("/about");

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link href="/about">
        <Button
          variant="ghost"
          size="sm"
          className={`hover:bg-[#F0F8FF] hover:text-[#1d588a] ${isAboutActive ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"} `}
        >
          About
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
      </Link>

      {isOpen && (
        <div className="absolute left-0 mt-0 w-48 bg-[#1d588a] border border-[#00427A] shadow-lg z-50">
          <Link href="/about/mission">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/about/mission" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              Our Mission
            </Button>
          </Link>
          <Link href="/about/who-we-are">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/about/who-we-are" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              Who We Are
            </Button>
          </Link>
          <Link href="/about/values">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/about/values" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              Our Values
            </Button>
          </Link>
          <Link href="/about/teams">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/about/teams" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              Our Teams
            </Button>
          </Link>
        </div>
      )}
    </div>
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

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  const profilePictureUrl =
    user?.image ||
    (user && 'profilePicture' in user && user.profilePicture && user.profilePicture !== "skibiditoilet"
      ? user.profilePicture
      : undefined);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="h-10 w-10 rounded-full bg-gray-300 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {profilePictureUrl ? (
          <Image
            src={profilePictureUrl as string}
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src =
                "https://placehold.co/150x150/cccccc/666666?text=Profile"; // Fallback image
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1d588a] border border-[#00427A] shadow-lg z-50">
          <Link href="/settings">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none ${pathname === "/settings" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
            >
              User Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-[#F0F8FF] hover:text-[#1d588a] rounded-none text-[#F0F8FF]"
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                signOut();
              }
            }}
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
              { href: "/chapters", label: "Chapters" },
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
            {/* About Dropdown for Mobile */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                className={`justify-between w-full hover:bg-[#F0F8FF] rounded-none ${pathname.startsWith("/about") ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
              >
                About
                <svg
                  className={`h-4 w-4 transition-transform ${isAboutOpen ? "rotate-180" : ""}`}
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
              {isAboutOpen && (
                <div className="mt-1 ml-4 flex flex-col space-y-1">
                  <Link href="/about/mission">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start hover:bg-[#F0F8FF] w-full rounded-none ${pathname === "/about/mission" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                    >
                      Our Mission
                    </Button>
                  </Link>
                  <Link href="/about/who-we-are">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start hover:bg-[#F0F8FF] w-full rounded-none ${pathname === "/about/who-we-are" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                    >
                      Who We Are
                    </Button>
                  </Link>
                  <Link href="/about/values">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start hover:bg-[#F0F8FF] w-full rounded-none ${pathname === "/about/values" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                    >
                      Our Values
                    </Button>
                  </Link>
                  <Link href="/about/teams">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start hover:bg-[#F0F8FF] w-full rounded-none ${pathname === "/about/teams" ? "bg-[#F0F8FF] text-[#1d588a]" : "text-[#F0F8FF]"}`}
                    >
                      Our Teams
                    </Button>
                  </Link>
                </div>
              )}
            </div>

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
                    {session?.user && 'isAdmin' in session.user && session.user.isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`bg-transparent border-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] mt-2 ${
                      pathname === "/settings"
                        ? "bg-[#F0F8FF] text-[#1d588a]"
                        : "text-[#F0F8FF]"
                    }`}
                  >
                    User Settings
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
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/vectors/navbar.svg"
            alt="Logo"
            width={50}
            height={50}
            className="h-15 w-15"
          />
          <span className="text-xl font-bold">ReEnvision</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          <NavLink href="/" label="Home" />
          <AboutDropdown />
          <NavLink href="/chapters" label="Chapters" />
          <EventsDropdown />
          <NavLink href="/donate" label="Donate" />
          <NavLink href="/contact" label="Contact Us" />
        </nav>

        <div className="flex items-center space-x-2">
          {status === "authenticated" ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className={`bg-transparent border-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a] ${
                    pathname === "/dashboard"
                      ? "bg-[#F0F8FF] text-[#1d588a]"
                      : "text-[#F0F8FF]"
                  }`}
                >
                  {session?.user && 'isAdmin' in session.user && session.user.isAdmin ? "Admin Dashboard" : "Dashboard"}
                </Button>
              </Link>
              <ProfileDropdown />
            </div>
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
