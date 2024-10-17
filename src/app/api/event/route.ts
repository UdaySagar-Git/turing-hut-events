
// POST /api/event

import { createEvent } from "@/actions/events";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, slug, isPublic, startTime, endTime } = await req.json();

  const event = await createEvent({ name, slug, isPublic, startTime, endTime });

  return NextResponse.json(event);
}
