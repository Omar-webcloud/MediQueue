import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const db = getDb();
  const tutor = db.tutors.find(t => t.id === id);
  
  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }
  
  return NextResponse.json(tutor);
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const db = getDb();
    
    const index = db.tutors.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }
    
    db.tutors[index] = { ...db.tutors[index], ...data };
    saveDb(db);
    
    return NextResponse.json(db.tutors[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tutor" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    
    const index = db.tutors.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }
    
    db.tutors.splice(index, 1);
    saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tutor" }, { status: 500 });
  }
}
