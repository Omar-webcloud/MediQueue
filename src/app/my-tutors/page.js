"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function MyTutorsPage() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTutor, setCurrentTutor] = useState(null);
  
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      fetchTutors();
    }
  }, [user]);

  const fetchTutors = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/tutors?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setTutors(data);
      }
    } catch (error) {
      toast.error("Failed to load your tutors");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (tutor) => {
    setCurrentTutor(tutor);
    setFormData(tutor);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tutors/${currentTutor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to update");
      
      const updatedTutor = await res.json();
      setTutors(prev => prev.map(t => t.id === updatedTutor.id ? updatedTutor : t));
      toast.success("Tutor updated successfully");
      setEditModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tutors/${currentTutor.id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      setTutors(prev => prev.filter(t => t.id !== currentTutor.id));
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
        <div className="border rounded-md">
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
                <TableRow key={tutor.id}>
                  <TableCell className="font-medium">{tutor.name}</TableCell>
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
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleEditChange} required />
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
                <Label htmlFor="availableTime">Available Time</Label>
                <Input id="availableTime" name="availableTime" value={formData.availableTime || ""} onChange={handleEditChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Date</Label>
                <Input id="sessionDate" name="sessionDate" type="date" value={formData.sessionDate || ""} onChange={handleEditChange} required />
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
              This action cannot be undone. This will permanently delete {currentTutor?.name} from our servers.
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
