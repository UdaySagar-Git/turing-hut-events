import { db } from "@/lib/db";

export const createContest = async (
  contestId: string,
  startTime: string,
  endTime: string,
  eventId: string
) => {
  try {
    const prevEvent = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!prevEvent) {
      console.log("Event not found");
      throw new Error("Event not found");
    }

    const res = await db.contest.create({
      data: {
        contestId,
        startTime,
        endTime,
        eventId,
      },
    });

    return res;
  } catch (error) {
    console.error(error);
  }
};
