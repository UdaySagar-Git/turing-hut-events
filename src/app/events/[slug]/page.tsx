import { redirect } from "next/navigation"

const EventPage = async ({ params }: { params: { slug: string } }) => {
  redirect(`/events/${params.slug}/leaderboard`)
}

export default EventPage