import { db } from "@/lib/db";

export const getAllEvents = async () => {
  const events = await db.event.findMany({})

  return events
};


export const getEvent = async (slug: string) => {
  const res = await db.event.findUnique({
    where: {
      slug: slug
    },
    include: {
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

export const createEditorial = async ({
  eventSlug,
  problemIndex,
  problemLink,
  content
}: {
  eventSlug: string,
  problemIndex: string,
  problemLink?: string,
  content: string
}) => {
  const res = await db.editorial.create({
    data: {
      eventSlug,
      problemIndex,
      problemLink,
      content
    }
  })

  return res
}

export const getEditorial = async (slug: string, problemIndex: string) => {
  const res = await db.editorial.findUnique({
    where: {
      eventSlug_problemIndex: { eventSlug: slug, problemIndex: problemIndex }
    }
  })

  return res
}
