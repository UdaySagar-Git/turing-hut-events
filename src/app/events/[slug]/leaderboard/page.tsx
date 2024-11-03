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
          <Button className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded fixed top-4 right-40 z-10 shadow-md shadow-blue-500 hover:shadow-lg hover:shadow-blue-500 ">
            Signin
          </Button>
        </Link>
      ) : (
        <Link href="/profile" className="absolute top-0 right-4 ">
          <Button className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded fixed top-4 right-40 z-10 shadow-md shadow-blue-500 hover:shadow-lg hover:shadow-blue-500 ">
            Profile
          </Button>
        </Link>
      )}
      <EventPageDetails slug={params.slug} event={data} />
    </div>
  )
}

export default EventPage
