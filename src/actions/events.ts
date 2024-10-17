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

export const createEvent = async (data: any) => {
  const res = await db.event.create({
    data: {
      name: data.name,
      slug: data.slug,
      isPublic: data.isPublic,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    }
  })

  return res
};
