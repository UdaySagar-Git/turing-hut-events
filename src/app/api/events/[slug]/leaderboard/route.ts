import { getAllSubmissionsByEvent } from "@/actions/codeforces";
import { getEvent } from "@/actions/events";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const event = await getEvent(params.slug);
    const res = await getAllSubmissionsByEvent(params.slug);

    return NextResponse.json({ success: true, data: res.data, lastUpdated: res.lastUpdated, event: event })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
