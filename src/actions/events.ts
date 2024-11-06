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
  problemName,
  content
}: {
  eventSlug: string,
  problemIndex: string,
  problemLink?: string,
  problemName?:string,
  content: string
}) => {
  const res = await db.editorial.create({
    data: {
      eventSlug,
      problemIndex,
      problemLink,
      problemName,
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

export const getEventEditorials = async (slug: string) => {
  const res = await db.editorial.findMany({
    where: {
      eventSlug: slug
    }
  })

  return res
}


export const deleteEditorial=async (id:string)=>{
  const res= await db.editorial.delete({
    where:{
      id:id
    }
  })
  return res
}


export const getProblemsData= async (slug:string)=>{
  const res= await db.event.findFirst({
    where:{
      slug
    },
    select:{
      editorials:true
    }
  })
  console.log(res)
  return res
}
