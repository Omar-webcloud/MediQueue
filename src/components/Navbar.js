"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-gray-900">
          <Image src="/logo.png" alt="MediQueue Logo" width={120} height={40} className="object-contain rounded" />
        </Link>
      </div>
      
      <ul className="hidden md:flex items-center gap-6 m-0 p-0 list-none font-medium text-gray-700">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        </li>
        <li>
          <Link href="/tutors" className="hover:text-primary transition-colors">Tutors</Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link href="/add-tutor" className="hover:text-primary transition-colors">Add Tutor</Link>
            </li>
            <li>
              <Link href="/my-tutors" className="hover:text-primary transition-colors">My Tutors</Link>
            </li>
            <li>
              <Link href="/my-sessions" className="hover:text-primary transition-colors">My Booked Sessions</Link>
            </li>
          </>
        )}
      </ul>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-medium text-gray-700 hover:text-primary">Login</Link>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        ) : (
          <div className="relative">
            <img 
              src="https://via.placeholder.com/40" 
              alt="Profile" 
              className="w-10 h-10 rounded-full cursor-pointer object-cover border border-gray-200 hover:ring-2 ring-primary transition-all" 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg flex flex-col py-1 z-50">
                <Link href="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                  Profile Page
                </Link>
                <button 
                  className="px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
