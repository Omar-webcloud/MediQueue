"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("/api/tutors");
        if (res.ok) {
          const data = await res.json();
          setTutors(data);
        }
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Tutors</h1>
        <p className="text-lg text-gray-600">Find the perfect tutor and book your session today.</p>
      </div>

      {tutors.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No tutors available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="flex flex-col h-full">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <img 
                  src={tutor.photoUrl || "https://via.placeholder.com/400x200"} 
                  alt={tutor.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{tutor.name}</CardTitle>
                    <CardDescription>{tutor.institution}</CardDescription>
                  </div>
                  <Badge variant="secondary">{tutor.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm text-gray-600">
                <p><strong>Mode:</strong> {tutor.teachingMode}</p>
                <p><strong>Time:</strong> {tutor.availableTime}</p>
                <p><strong>Fee:</strong> ${tutor.hourlyFee}/hr</p>
                <p><strong>Slots:</strong> {tutor.totalSlot}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/tutors/${tutor.id}`}>Book Session</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
