import { createEditorial } from "@/actions/events";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { problemIndex, problemLink, content } = await req.json();
  const eventSlug = params.slug;
  const res = await createEditorial({ eventSlug, problemIndex, problemLink, content });

  return NextResponse.json(res);
}