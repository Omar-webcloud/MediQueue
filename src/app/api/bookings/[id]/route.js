import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const db = getDb();
    
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Update booking status
    const previousStatus = db.bookings[index].status;
    db.bookings[index].status = status;
    
    // If cancelling, we should probably restore the tutor's slot, 
    // but the requirements didn't explicitly mention it.
    // Adding it for logical completeness.
    if (status === "cancelled" && previousStatus !== "cancelled") {
      const tutorId = db.bookings[index].tutorId;
      const tutorIndex = db.tutors.findIndex(t => t.id === tutorId);
      if (tutorIndex !== -1) {
        db.tutors[tutorIndex].totalSlot = Number(db.tutors[tutorIndex].totalSlot) + 1;
      }
    }
    
    saveDb(db);
    
    return NextResponse.json(db.bookings[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
