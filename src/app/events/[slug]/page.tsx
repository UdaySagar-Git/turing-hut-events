import { getEvent } from "@/actions/events";
import Loading from "@/components/common/Loading";
import EventPageDetails from "./EventPage";
const EventPage = async ({ params }: { params: { slug: string } }) => {

  const data = await getEvent(params.slug)

  if (!data) {
    return <Loading />
  }

  return <EventPageDetails slug={params.slug} event={data} />
}

export default EventPage