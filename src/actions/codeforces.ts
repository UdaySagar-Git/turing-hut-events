import { db } from "@/lib/db"

export const getContestStatus = async (slug: string) => {
  const submissions = await db.codeSubmission.findMany({
    where: {
      contestId: slug
    }
  })

  const mergedSubmissions = submissions.map(submission => {
    const merged = {
      ...submission,
      problem: submission.data
    }
    return merged
  })

  return mergedSubmissions
}