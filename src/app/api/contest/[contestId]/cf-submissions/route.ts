// GET /api/contest/:contestId/submissions

import { getContestStandingsAsManager } from "@/actions/codeforces";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  const { contestId } = params;

  const submissions = await getContestStandingsAsManager(contestId);

  return NextResponse.json(submissions);
}