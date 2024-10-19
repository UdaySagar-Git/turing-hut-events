
import { db } from "@/lib/db";

export const allActiveSessions = async (userId: string) => {
  return await db.session.findMany({
    where: {
      expires: {
        gt: new Date(),
      },
      userId,
    },
  });
};

export const deleteSession = async (sessionId: string) => {
  return await db.session.delete({
    where: { id: sessionId },
  });
};