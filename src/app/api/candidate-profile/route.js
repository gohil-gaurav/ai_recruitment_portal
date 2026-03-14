import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/candidate-profile?email=xxx
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  try {
    const candidate = await prisma.candidate.findUnique({ where: { email } });
    if (!candidate) return NextResponse.json({ notFound: true }, { status: 200 });
    return NextResponse.json(candidate, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/candidate-profile  { email, name, skills, experienceYears, location, phone }
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { email, ...data } = body;
    if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

    const allowed = ["name", "skills", "experienceYears", "location", "phone", "education", "summary", "linkedin", "github", "portfolio"];
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([k]) => allowed.includes(k))
    );
    if (updateData.experienceYears !== undefined) {
      updateData.experienceYears = parseInt(updateData.experienceYears) || 0;
    }

    const candidate = await prisma.candidate.update({
      where: { email },
      data: updateData,
    });
    return NextResponse.json(candidate, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
