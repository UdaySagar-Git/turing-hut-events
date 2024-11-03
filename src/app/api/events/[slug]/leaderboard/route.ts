import { getAllSubmissionsByEvent } from "@/actions/codeforces";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const res = await getAllSubmissionsByEvent(params.slug);

    return NextResponse.json({ success: true, data: res.data, lastUpdated: res.lastUpdated })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
