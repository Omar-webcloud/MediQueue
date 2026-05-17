"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTutors = async (searchVal = "", startVal = "", endVal = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchVal.trim()) params.append("search", searchVal.trim());
      if (startVal) params.append("startDate", startVal);
      if (endVal) params.append("endDate", endVal);
      
      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await apiFetch(`/api/tutors${queryStr}`);
      if (res.ok) {
        const data = await res.json();
        // The backend returns an object { count, tutors, message }
        setTutors(data.tutors || []);
      }
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Available Tutors</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Find the perfect tutor and book your session today.</p>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-white dark:bg-card border dark:border-border rounded-lg p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Tutor Name</label>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-background dark:border-border dark:text-foreground text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-44 space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-background dark:border-border dark:text-foreground text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-44 space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-background dark:border-border dark:text-foreground text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => fetchTutors(search, startDate, endDate)}
            className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-md text-sm transition-colors cursor-pointer"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
              fetchTutors("", "", "");
            }}
            className="flex-1 md:flex-none border dark:border-border dark:hover:bg-gray-800 hover:bg-gray-50 font-semibold px-4 py-2 rounded-md text-sm transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No tutors found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <Card key={tutor._id} className="flex flex-col h-full bg-white dark:bg-card dark:border-border">
              <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-gray-50 dark:bg-background">
                <img 
                  src={tutor.photo || "https://via.placeholder.com/400x400"} 
                  alt={tutor.tutorName}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1 text-gray-900 dark:text-white">{tutor.tutorName}</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">{tutor.institution}</CardDescription>
                  </div>
                  <Badge variant="secondary">{tutor.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Mode:</strong> {tutor.teachingMode}</p>
                <p><strong>Days:</strong> {tutor.availableDays?.join(", ")}</p>
                <p><strong>Time:</strong> {tutor.availableTimeSlot}</p>
                <p><strong>Fee:</strong> ${tutor.hourlyFee}/hr</p>
                <p><strong>Slots:</strong> {tutor.totalSlot}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/tutors/${tutor._id}`} className={buttonVariants({ className: "w-full" })}>Book Session</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
