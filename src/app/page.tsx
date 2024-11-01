import { getAllEvents } from "@/actions/events";
import Loading from "@/components/common/Loading";
import day from "@/lib/dayjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddEventDialog from "@/components/AddEventDialog";
import { Toaster } from "@/components/ui/toaster";
import getCurrentUser from "@/actions/getCurrentUser";
import { LuClock2 } from "react-icons/lu";

const Events = async () => {
  const data = await getAllEvents();

  if (!data) {
    return <Loading />;
  }

  const session = await getCurrentUser();

  return (
    <div>
      <Toaster />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white">
        <div className="bg-desktop bg-cover h-full w-full" />
        <div className="bg-mobile bg-cover h-full w-full" />
      </div>
      {session && <AddEventDialog />}

      {session && (
        <Link href="/profile">
          <Button className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded fixed top-4 right-40 z-10 shadow-md shadow-blue-500 hover:shadow-lg hover:shadow-blue-500 ">
            Profile
          </Button>
        </Link>
      )}

      <h1 className="text-center mb-8 mt-16 text-4xl font-extrabold leading-none tracking-tight text-gray-50 md:text-5xl lg:text-6xl dark:text-white">
        Events
      </h1>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        {/* grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 */}
        <div
          className="
          flex justify-center items-center gap-4 flex-wrap max-sm:"
        >
          {data?.map((event) => (
            <Card
              key={event.slug}
              className="bg-white shadow-md shadow-neutral-400 hover:shadow-lg hover:shadow-neutral-300 transition-shadow duration-300 w-96"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(7px)",
                WebkitBackdropFilter: "blur(7px)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
            >
              <CardHeader>
                <CardTitle className="text-2xl hover:text-gray-900 font-semibold">
                  {event.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-100 flex justify-start items-center gap-2">
                  {day(event.startTime).fromNow()}{" "}
                  <LuClock2 className="w-4 h-4" />
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex space-x-2 justify-center pt-4">
                <Link href={`/events/${event.slug}`}>
                  <Button className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-300">
                    Details
                  </Button>
                </Link>
                {session && (
                  <Link href={`/admin/${event.slug}`}>
                    <Button className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-300">
                      Admin
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
