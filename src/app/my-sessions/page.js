"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export default function MySessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await apiFetch("/api/bookings/my-bookings");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.bookings || []);
      }
    } catch (error) {
      toast.error("Failed to load your sessions");
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (session) => {
    setCurrentSession(session);
    setCancelModalOpen(true);
  };

  const handleCancel = async () => {
    try {
      const res = await apiFetch(`/api/bookings/${currentSession._id}/cancel`, {
        method: "PATCH",
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to cancel session");
      
      setSessions(prev => prev.map(s => s._id === currentSession._id ? { ...s, bookStatus: "cancelled" } : s));
      toast.success("Session cancelled successfully");
      setCancelModalOpen(false);
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
      <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Booked Sessions</h1>
      
      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-500">You haven't booked any sessions yet.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor Name</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Session Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell className="font-medium">{session.tutorName}</TableCell>
                  <TableCell>{session.studentName}</TableCell>
                  <TableCell>{session.studentEmail}</TableCell>
                  <TableCell>{new Date(session.sessionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={session.bookStatus === "cancelled" ? "destructive" : "default"}>
                      {session.bookStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                      disabled={session.bookStatus === "cancelled"}
                      onClick={() => openCancelModal(session)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your session with {currentSession?.tutorName}? 
              This action will update the booking status to "cancelled".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>Back</Button>
            <Button variant="destructive" onClick={handleCancel}>Confirm Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
}
