import { getAllEvents } from "@/actions/events" 
import Loading from "@/components/common/Loading"
import day from "@/lib/dayjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddEventDialog from "@/components/AddEventDialog"


const Events = async () => {

  const data = await getAllEvents();

  if (!data) {
    return <Loading />
  }


  return (
    <div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,150,0,0.3)_0,rgba(0,150,0,0)_50%,rgba(0,150,0,0)_100%)]"></div>
      <AddEventDialog />

      <h1 className="text-center mb-8 mt-16 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Events</h1>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((event) => (
            <Card key={event.slug} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{day(event.startTime).fromNow()}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pt-4">
                <Link href={`/events/${event.slug}`}><Button className="w-full">Details</Button></Link>
                <Link href={`/admin/${event.slug}`}><Button className="w-full">Admin</Button></Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Events