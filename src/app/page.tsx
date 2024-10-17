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

const Events = async () => {

  const data = await getAllEvents();

  if (!data) {
    return <Loading />
  }

  return (
    <div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,150,0,0.3)_0,rgba(0,150,0,0)_50%,rgba(0,150,0,0)_100%)]"></div>
      <h1 className="text-center mb-4 mt-2 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Events</h1>
      <div className="mx-10 flex flex-wrap gap-5">
        {data?.map((event) => (
          <div key={event.slug}>
            <Card className="w-[350px] bg-gray-50">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{day(event.startTime).fromNow()}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Link href={`/${event.slug}`}><Button>Details</Button></Link>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Events