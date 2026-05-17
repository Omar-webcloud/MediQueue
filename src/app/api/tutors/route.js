import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import crypto from "crypto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = searchParams.get('limit');
  
  const db = getDb();
  let tutors = db.tutors;
  
  if (userId) {
    tutors = tutors.filter(t => t.userId === userId);
  }
  
  if (limit) {
    tutors = tutors.slice(0, parseInt(limit, 10));
  }
  
  return NextResponse.json(tutors);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = getDb();
    
    const newTutor = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    db.tutors.push(newTutor);
    saveDb(db);
    
    return NextResponse.json(newTutor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tutor" }, { status: 500 });
  }
}
