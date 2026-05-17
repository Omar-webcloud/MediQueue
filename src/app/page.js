"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    title: "Unlock Your Potential with Expert Tutors",
    description: "Find the best educators to guide you through your academic journey.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Flexible Learning Schedules",
    description: "Book sessions that fit perfectly into your busy life.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Master New Skills Faster",
    description: "One-on-one personalized sessions for optimized learning.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HomePage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("/api/tutors?limit=6");
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

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Banner Section */}
      <section className="w-full">
        <Carousel
          plugins={[Autoplay({ delay: 5000 })]}
          className="w-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[600px] w-full">
                  <div className="absolute inset-0 bg-black/50 z-10" />
                  <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl">{slide.title}</h1>
                    <p className="text-xl mb-8 max-w-2xl">{slide.description}</p>
                    <Link href="/tutors" className={buttonVariants({ size: "lg", className: "text-lg px-8 py-6" })}>Find Tutors Now</Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-8 z-30" />
            <CarouselNext className="right-8 z-30" />
          </div>
        </Carousel>
      </section>

      {/* Extra Section 1: Stats */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-4">
            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
            <p className="text-gray-600 font-medium">Expert Tutors</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold text-primary mb-2">10k+</h3>
            <p className="text-gray-600 font-medium">Active Students</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold text-primary mb-2">50k+</h3>
            <p className="text-gray-600 font-medium">Sessions Completed</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold text-primary mb-2">4.9/5</h3>
            <p className="text-gray-600 font-medium">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Available Tutors Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Tutors</h2>
          <p className="text-lg text-gray-600">Discover our top-rated educators ready to help you succeed.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No tutors available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
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
                  <Link href={`/tutors/${tutor.id}`} className={buttonVariants({ className: "w-full" })}>Book Session</Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {tutors.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/tutors" className={buttonVariants({ variant: "outline", size: "lg" })}>View All Tutors</Link>
          </div>
        )}
      </section>

      {/* Extra Section 2: How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Booking a session on MediQueue is simple, fast, and secure. Follow these simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Find a Tutor</h3>
              <p className="text-gray-600">Browse through our extensive list of verified and highly-rated tutors.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Book a Session</h3>
              <p className="text-gray-600">Select an available time slot that fits your schedule and book instantly.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Start Learning</h3>
              <p className="text-gray-600">Connect with your tutor and start mastering your subject today.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
