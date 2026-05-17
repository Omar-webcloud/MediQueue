"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    let title = "MediQueue";
    
    if (pathname === "/") {
      title = "Home | MediQueue";
    } else if (pathname === "/tutors") {
      title = "Available Tutors | MediQueue";
    } else if (pathname === "/add-tutor") {
      title = "Add Tutor | MediQueue";
    } else if (pathname === "/my-tutors") {
      title = "My Tutors | MediQueue";
    } else if (pathname === "/my-sessions") {
      title = "My Booked Sessions | MediQueue";
    } else if (pathname.startsWith("/tutors/")) {
      title = "Tutor Details | MediQueue";
    }
    
    document.title = title;
  }, [pathname]);

  return null;
}
