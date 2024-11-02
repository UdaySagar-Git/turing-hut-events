import { getEvent } from "@/actions/events";
import Loading from "@/components/common/Loading";
import EventPageDetails from "../_components/EventPage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import getCurrentUser from "@/actions/getCurrentUser";


const EventPage = async ({ params }: { params: { slug: string } }) => {
  const data = await getEvent(params.slug)
  const currentUser = await getCurrentUser()

  if (!data) {
    return <Loading />
  }

  return (
    <div className="relative">
      {!currentUser ? (
        <Link href="/signin" className="absolute top-0 right-4 ">
          <Button>Signin</Button>
        </Link>
      ) : (
        <Link href="/profile" className="absolute top-0 right-4 ">
          <Button>Profile</Button>
        </Link>
      )}
      <EventPageDetails slug={params.slug} event={data} />
    </div>
  )
}

export default EventPage