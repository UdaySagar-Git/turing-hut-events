import { db } from "@/lib/db";

export const getAllEvents = async () => {
  const events = await db.event.findMany({})

  return events
};


export const getEvent = async (slug: string) => {
  const res = await db.event.findUnique({
    where:{
      slug: slug
    },
    include:{
      contests: true
    }
  })

  return res
};