// GET /api/events/:slug/

import { createEvent, getEvent } from "@/actions/events";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const event = await getEvent(slug);

  return NextResponse.json(event);
}

// POST /api/events/:slug/
// create a new event

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { name, isPublic, startTime, endTime } = await req.json();
  const slug = params.slug;

  const isSlugExists = await getEvent(slug);
  if (isSlugExists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const event = await createEvent({ name, slug, isPublic, startTime, endTime });

  return NextResponse.json(event);
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { announcement } = await req.json();
  const slug = params.slug;


  const isSlugExists = await getEvent(slug);
  if (!isSlugExists) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const event = await db.event.update({
    where: { slug },
    data: { announcement },
  });

  return NextResponse.json(event);
}
