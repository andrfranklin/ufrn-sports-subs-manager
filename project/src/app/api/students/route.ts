import { NextResponse } from "next/server";
import { createStudent } from "@/actions/student/create";
import { listStudents } from "@/actions/student/list";

export async function POST(request: Request) {
  const data = await request.json();
  const result = await createStudent(data);

  if (result.success) {
    return NextResponse.json({ success: true, student: result.student });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const result = await listStudents(page, limit);

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
}