"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AddTutorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
    subject: "",
    availableTime: "",
    hourlyFee: "",
    totalSlot: "",
    sessionDate: "",
    institution: "",
    location: "",
    teachingMode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        userId: user?.id || 'u1',
        userEmail: user?.email || 'student1@example.com'
      };
      
      const res = await fetch("/api/tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to add tutor");
      
      toast.success("Tutor added successfully!");
      router.push("/tutors");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-bold">Add Tutor</CardTitle>
          <CardDescription>Enter details to add a new tutor to the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tutor Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL (ImgBB/Postimage link)</Label>
                <Input id="photoUrl" name="photoUrl" value={formData.photoUrl} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Category</Label>
                <Select onValueChange={(value) => handleSelectChange("subject", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availableTime">Available Days & Time Slot</Label>
                <Input id="availableTime" name="availableTime" placeholder="e.g. Sun - Thu 5:00 PM - 8:00 PM" value={formData.availableTime} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourlyFee">Hourly Fee ($)</Label>
                <Input id="hourlyFee" name="hourlyFee" type="number" min="0" value={formData.hourlyFee} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalSlot">Total Slot Limit</Label>
                <Input id="totalSlot" name="totalSlot" type="number" min="1" value={formData.totalSlot} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Start Date</Label>
                <Input id="sessionDate" name="sessionDate" type="date" value={formData.sessionDate} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teachingMode">Teaching Mode</Label>
                <Select onValueChange={(value) => handleSelectChange("teachingMode", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="institution">Institution & Experience</Label>
                <Input id="institution" name="institution" placeholder="e.g. MIT, 5 years experience" value={formData.institution} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location (Area/City)</Label>
                <Input id="location" name="location" placeholder="e.g. New York City" value={formData.location} onChange={handleChange} required />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Add Tutor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
