import { getEvent } from "@/actions/events";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/common/Loading";
import EventPageDetails from "./EventPage";
import { redirect } from "next/navigation";
const EventPage = ({ slug }: { slug: string }) => {

  const { data, isLoading } = useQuery({
    queryKey: ["events", slug],
    queryFn: () => getEvent(slug)
  })

  if (isLoading) {
    return <Loading />
  }

  if (!data) {
    redirect("/")
  }

  return <EventPageDetails slug={slug} event={data} />
}

export default EventPage