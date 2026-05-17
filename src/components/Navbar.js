"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Retrieve theme safely on client mount
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav className="flex flex-col bg-white dark:bg-card border-b dark:border-border shadow-sm sticky top-0 z-50 transition-colors">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-gray-900 dark:text-white">
            <Image src="/logo.png" alt="MediQueue Logo" width={110} height={35} className="object-contain rounded max-w-[100px] sm:max-w-[120px] dark:brightness-110" />
          </Link>
        </div>
        
        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6 m-0 p-0 list-none font-medium text-gray-700 dark:text-gray-300">
          <li>
            <Link href="/" className="hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/tutors" className="hover:text-primary dark:hover:text-primary transition-colors">Tutors</Link>
          </li>
          {user && (
            <>
              <li>
                <Link href="/add-tutor" className="hover:text-primary dark:hover:text-primary transition-colors">Add Tutor</Link>
              </li>
              <li>
                <Link href="/my-tutors" className="hover:text-primary dark:hover:text-primary transition-colors">My Tutors</Link>
              </li>
              <li>
                <Link href="/my-sessions" className="hover:text-primary dark:hover:text-primary transition-colors">My Booked Sessions</Link>
              </li>
            </>
          )}
        </ul>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              // Sun Icon
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              // Moon Icon
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {!user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/login" className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm md:text-base">Login</Link>
              <Link href="/register" className={buttonVariants({ size: "sm", className: "text-xs md:text-sm px-2.5 py-1.5 md:px-4 md:py-2" })}>Register</Link>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={user?.photo || "https://via.placeholder.com/40"} 
                alt="Profile" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer object-cover border border-gray-200 hover:ring-2 ring-primary transition-all" 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg flex flex-col py-1 z-50">
                  <Link href="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                    Profile Page
                  </Link>
                  <button 
                    className="px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 w-full"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="flex items-center justify-center p-2 text-gray-700 hover:text-primary focus:outline-none md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-gray-50 border-t shadow-inner flex flex-col gap-3 font-medium text-gray-700">
          <Link href="/" className="py-2 hover:text-primary transition-colors border-b border-gray-100" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/tutors" className="py-2 hover:text-primary transition-colors border-b border-gray-100" onClick={() => setMenuOpen(false)}>Tutors</Link>
          {user && (
            <>
              <Link href="/add-tutor" className="py-2 hover:text-primary transition-colors border-b border-gray-100" onClick={() => setMenuOpen(false)}>Add Tutor</Link>
              <Link href="/my-tutors" className="py-2 hover:text-primary transition-colors border-b border-gray-100" onClick={() => setMenuOpen(false)}>My Tutors</Link>
              <Link href="/my-sessions" className="py-2 hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>My Booked Sessions</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
