// GET /api/contest/:contestId/submissions

import {
  addCodeSubmissions,
  getContestStandingsAsManager,
} from "@/actions/codeforces";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  const { contestId } = params;

  const submissions = await getContestStandingsAsManager(contestId);

  return NextResponse.json(submissions);
}

// POST /api/contest/:contestId/submissions
// create a new submission

export async function POST(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  const { contestId } = params;
  const { data } = await req.json();

  

  const newSubmission = await addCodeSubmissions(contestId, data);

  return NextResponse.json(newSubmission);
}
