import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  const { invitationLink } = await req.json();

  const { contestId } = params;

  const res = await db.contest.update({
    where: { contestId },
    data: {
      invitationLink,
    },
  });

  return NextResponse.json(res);
}
