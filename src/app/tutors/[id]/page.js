"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function TutorDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { user } = useAuth();
  
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    studentName: "",
    phone: "",
    studentEmail: ""
  });

  // Pre-fill user data once loaded
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        studentName: user.name || "",
        studentEmail: user.email || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(`/api/tutors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTutor(data);
        } else {
          toast.error("Tutor not found");
          router.push("/tutors");
        }
      } catch (error) {
        toast.error("Error fetching tutor details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutor();
  }, [id, router]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const checkAvailability = () => {
    if (!tutor) return false;
    
    if (Number(tutor.totalSlot) <= 0) {
      toast.error("No available slots left.");
      return false;
    }
    
    const sessionDate = new Date(tutor.sessionDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (currentDate < sessionDate) {
      toast.error("Booking is not available yet for this tutor");
      return false;
    }
    
    return true;
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!checkAvailability()) return;
    
    setBookingLoading(true);
    try {
      const payload = {
        ...bookingData,
        tutorId: tutor.id,
        tutorName: tutor.name,
      };
      
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to book session");
      }
      
      toast.success("Session booked successfully!");
      setModalOpen(false);
      
      // Update local tutor state to reflect decreased slot
      setTutor(prev => ({ ...prev, totalSlot: prev.totalSlot - 1 }));
      
    } catch (error) {
      if (error.message.includes("available slots left") || error.message.includes("fully booked")) {
        toast.error("This session is fully booked. You can’t join at the moment.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tutor) return null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={tutor.photoUrl || "https://via.placeholder.com/400x400"} 
              alt={tutor.name}
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                  <p className="text-lg text-gray-600">{tutor.institution}</p>
                  <p className="text-gray-500">{tutor.location}</p>
                </div>
                <Badge variant="default" className="text-lg py-1 px-3">{tutor.subject}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Teaching Mode</p>
                  <p className="font-medium text-gray-900">{tutor.teachingMode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Hourly Fee</p>
                  <p className="font-medium text-gray-900">${tutor.hourlyFee}/hr</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Available Time</p>
                  <p className="font-medium text-gray-900">{tutor.availableTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Session Date</p>
                  <p className="font-medium text-gray-900">{new Date(tutor.sessionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Available Slots</p>
                  <p className="font-medium text-gray-900">{tutor.totalSlot}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full md:w-auto" onClick={(e) => {
                    if (!checkAvailability()) e.preventDefault();
                  }}>
                    Book Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Book Session</DialogTitle>
                    <DialogDescription>
                      Confirm your details to book a session with {tutor.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookSession} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tutorId">Tutor ID</Label>
                      <Input id="tutorId" value={tutor.id} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorName">Tutor Name</Label>
                      <Input id="tutorName" value={tutor.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input id="studentName" name="studentName" value={bookingData.studentName} onChange={handleBookingChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentEmail">Student Email</Label>
                      <Input id="studentEmail" value={bookingData.studentEmail} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={bookingData.phone} onChange={handleBookingChange} required />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={bookingLoading} className="w-full mt-4">
                        {bookingLoading ? "Booking..." : "Confirm Booking"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
