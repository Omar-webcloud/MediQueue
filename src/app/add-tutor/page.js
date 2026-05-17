"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddTutorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tutorName: "",
    photo: "",
    subject: "",
    availableTimeSlot: "",
    hourlyFee: "",
    totalSlot: "",
    sessionStartDate: "",
    institution: "",
    experience: "",
    location: "",
    teachingMode: "",
    description: ""
  });

  const [selectedDays, setSelectedDays] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedDays.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        availableDays: selectedDays,
        hourlyFee: Number(formData.hourlyFee),
        totalSlot: Number(formData.totalSlot),
      };
      
      const res = await apiFetch("/api/tutors", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to add tutor");
      
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
                <Label htmlFor="tutorName">Tutor Name</Label>
                <Input id="tutorName" name="tutorName" value={formData.tutorName} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL (ImgBB/Postimage link)</Label>
                <Input id="photo" name="photo" value={formData.photo} onChange={handleChange} required />
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
                <Label htmlFor="availableTimeSlot">Available Time Slot</Label>
                <Input id="availableTimeSlot" name="availableTimeSlot" placeholder="e.g. 5:00 PM - 8:00 PM" value={formData.availableTimeSlot} onChange={handleChange} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Available Days</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {DAYS.map((day) => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm font-medium text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
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
                <Label htmlFor="sessionStartDate">Session Start Date</Label>
                <Input id="sessionStartDate" name="sessionStartDate" type="date" value={formData.sessionStartDate} onChange={handleChange} required />
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
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" name="institution" placeholder="e.g. MIT" value={formData.institution} onChange={handleChange} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" name="experience" placeholder="e.g. 5 years experience" value={formData.experience} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location (Area/City)</Label>
                <Input id="location" name="location" placeholder="e.g. New York City" value={formData.location} onChange={handleChange} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" name="description" placeholder="e.g. Friendly and experienced..." value={formData.description} onChange={handleChange} />
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
