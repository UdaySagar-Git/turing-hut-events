import { createContest } from "@/actions/contests";
import { db } from "@/lib/db";
import {  NextResponse } from "next/server";

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


export async function POST (req: Request){
  const { contestId,startTime,endTime, eventId } = await req.json();

  const res = await createContest(contestId,startTime,endTime,eventId);

  return NextResponse.json(res);
}