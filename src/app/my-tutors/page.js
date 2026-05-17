"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MyTutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTutor, setCurrentTutor] = useState(null);
  
  const [formData, setFormData] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await apiFetch("/api/tutors/my-tutors/list");
      if (res.ok) {
        const data = await res.json();
        setTutors(data.tutors || []);
      }
    } catch (error) {
      toast.error("Failed to load your tutors");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (tutor) => {
    setCurrentTutor(tutor);
    
    // Format start date to YYYY-MM-DD
    let formattedDate = "";
    if (tutor.sessionStartDate) {
      formattedDate = new Date(tutor.sessionStartDate).toISOString().split("T")[0];
    }

    setFormData({
      tutorName: tutor.tutorName || "",
      photo: tutor.photo || "",
      subject: tutor.subject || "",
      availableTimeSlot: tutor.availableTimeSlot || "",
      hourlyFee: tutor.hourlyFee || "",
      totalSlot: tutor.totalSlot || "",
      sessionStartDate: formattedDate,
      institution: tutor.institution || "",
      experience: tutor.experience || "",
      location: tutor.location || "",
      teachingMode: tutor.teachingMode || "",
      description: tutor.description || ""
    });
    setSelectedDays(tutor.availableDays || []);
    setEditModalOpen(true);
  };

  const openDeleteModal = (tutor) => {
    setCurrentTutor(tutor);
    setDeleteModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    try {
      const payload = {
        ...formData,
        availableDays: selectedDays,
        hourlyFee: Number(formData.hourlyFee),
        totalSlot: Number(formData.totalSlot),
      };

      const res = await apiFetch(`/api/tutors/${currentTutor._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to update");
      
      setTutors(prev => prev.map(t => t._id === data.tutor._id ? data.tutor : t));
      toast.success("Tutor updated successfully");
      setEditModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await apiFetch(`/api/tutors/${currentTutor._id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      
      setTutors(prev => prev.filter(t => t._id !== currentTutor._id));
      toast.success("Tutor deleted successfully");
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Tutors</h1>
      
      {tutors.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No tutors found</h3>
          <p className="text-gray-500">You haven't added any tutors yet.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor._id}>
                  <TableCell className="font-medium">{tutor.tutorName}</TableCell>
                  <TableCell>{tutor.subject}</TableCell>
                  <TableCell>${tutor.hourlyFee}/hr</TableCell>
                  <TableCell>{tutor.totalSlot}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditModal(tutor)}>
                      Update
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteModal(tutor)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Tutor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tutorName">Tutor Name</Label>
                <Input id="tutorName" name="tutorName" value={formData.tutorName || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input id="photo" name="photo" value={formData.photo || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyFee">Hourly Fee</Label>
                <Input id="hourlyFee" name="hourlyFee" type="number" value={formData.hourlyFee || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subject || ""} onValueChange={(v) => handleSelectChange("subject", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
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
                <Label htmlFor="totalSlot">Total Slots</Label>
                <Input id="totalSlot" name="totalSlot" type="number" value={formData.totalSlot || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableTimeSlot">Available Time Slot</Label>
                <Input id="availableTimeSlot" name="availableTimeSlot" value={formData.availableTimeSlot || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionStartDate">Session Start Date</Label>
                <Input id="sessionStartDate" name="sessionStartDate" type="date" value={formData.sessionStartDate || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachingMode">Teaching Mode</Label>
                <Select value={formData.teachingMode || ""} onValueChange={(v) => handleSelectChange("teachingMode", v)}>
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
                <Input id="institution" name="institution" value={formData.institution || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" name="experience" value={formData.experience || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location || ""} onChange={handleEditChange} required />
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete {currentTutor?.tutorName} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
}
