import { api } from "@/actions/api";
import { IEvent } from "@/interfaces/events";

export const getAllEvents = async () => {
  try {
    const res = await api.get<{
      events: IEvent[];
    }>("/events/");
    return res.data.events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};


export const getEvent = async (slug: string) => {
  const res = await api.get<{
    event: IEvent;
  }>(`/events/${slug}/`);
  return res.data.event;
};

// export const createSubmission = async (contestId: string, data) => {
//     const res = await api.post(
//       `/api/v1/contests/${contestId}/submissions`,
//       JSON.parse(data)
//     );
// }