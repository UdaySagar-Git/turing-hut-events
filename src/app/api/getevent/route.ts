
// POST /api/event

import { getEvent } from "@/actions/events";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { slug } = await req.json();

  const event = await getEvent(slug);

  return NextResponse.json(event);
}
