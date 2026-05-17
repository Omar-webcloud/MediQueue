import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import crypto from "crypto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentEmail = searchParams.get('studentEmail');
  
  const db = getDb();
  let bookings = db.bookings;
  
  if (studentEmail) {
    bookings = bookings.filter(b => b.studentEmail === studentEmail);
  }
  
  return NextResponse.json(bookings);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = getDb();
    
    // Find tutor to decrease slots
    const tutorIndex = db.tutors.findIndex(t => t.id === data.tutorId);
    if (tutorIndex === -1) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }
    
    const tutor = db.tutors[tutorIndex];
    if (Number(tutor.totalSlot) <= 0) {
      return NextResponse.json({ error: "No available slots left." }, { status: 400 });
    }
    
    const sessionDate = new Date(tutor.sessionDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Ignore time part for comparison
    
    if (currentDate < sessionDate) {
      return NextResponse.json({ error: "Booking is not available yet for this tutor" }, { status: 400 });
    }

    // Decrease slot
    db.tutors[tutorIndex].totalSlot = Number(tutor.totalSlot) - 1;
    
    const newBooking = {
      ...data,
      id: crypto.randomUUID(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    db.bookings.push(newBooking);
    saveDb(db);
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to book session" }, { status: 500 });
  }
}
