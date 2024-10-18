import { db } from "@/lib/db"
import { InputJsonValue } from "@prisma/client/runtime/library";
import crypto from 'crypto'


export const getLatestSubmissionsByContest = async (contestId: string) => {
  const latestSubmissions = await db.codeSubmission.findFirst({
    where: { contestId: contestId },
    orderBy: { createdAt: "desc" },
  });

  return latestSubmissions?.data
}

export const getAllSubmissionsByEvent = async (slug: string) => {
  const event = await db.contest.findMany({
    where: {
      Event: {
        slug: slug
      }
    }
  })

  const contestIds = event.map(contest => contest.contestId);

  let submissionsByProblemIndex: {
    [key: string]: any[]
  } = {};

  for (const contestId of contestIds) {
    const submissions = await db.codeSubmission.findFirst({
      where: { contestId: contestId },
      orderBy: { createdAt: "desc" },
    });

    if (submissions && submissions.data && Array.isArray(submissions.data)) {
      for (const submission of submissions.data) {
        const problemIndex = (submission as any).problem.index;

        if (!submissionsByProblemIndex[problemIndex]) {
          submissionsByProblemIndex[problemIndex] = [];
        }

        submissionsByProblemIndex[problemIndex].push(submission);
      }
    }
  }

  return submissionsByProblemIndex;
}

export const getContestStandingsAsManager = async (contestId: string) => {
  const statusBaseUrl = 'https://codeforces.com/api/contest.status';
  const apiKey = process.env.CODEFORCES_API_KEY;
  const apiSecret = process.env.CODEFORCES_API_SECRET;

  const time = Math.floor(Date.now() / 1000);
  const rand = time.toString().slice(-6);

  const params: any = {
    contestId: contestId,
    asManager: true,
    apiKey: apiKey,
    time: time,
    showUnofficial: true,
  };

  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const statusSigStr = `${rand}/contest.status?${sortedParams}#${apiSecret}`;
  const statusApiSig = crypto.createHash('sha512').update(statusSigStr).digest('hex');

  params.apiSig = `${rand}${statusApiSig}`;
  const statusUrl = `${statusBaseUrl}?${new URLSearchParams(params).toString()}`;
  try {
    const statusResponse = await fetch(statusUrl);
    const statusData = await statusResponse.json();

    return { statusData, statusUrl };
  } catch (error) {
    return { statusData: "Codeforces Error", statusUrl };
  }
};


export const addCodeSubmissions = async (contestId: string, data: InputJsonValue) => {
  try {
    const newSubmission = await db.codeSubmission.create({
      data: {
        contestId: contestId,
        data: data
      }
    })

    return { message: "Submissions added successfully", newSubmission }

  } catch (err: any) {

    return { message: "Failed to add submissions", error: err.message }
  }
};