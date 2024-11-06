import React from "react";
import { getEventEditorials } from "@/actions/events";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, BarChart } from "lucide-react";

export default async function EventEditorialsPage({
  params,
}: {
  params: { slug: string };
}) {
  const editorials = await getEventEditorials(params.slug);

  const sortedEditorials = editorials.sort((editorial1, editorial2) => {
    if (editorial1.problemIndex < editorial2.problemIndex) {
      return -1;
    }
    if (editorial1.problemIndex > editorial2.problemIndex) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="relative">
      <div className="absolute -top-2 left-4 flex space-x-8 ">
        <Link href="/">
          <Home className="h-12 w-12 hover:bg-gray-200 hover:shadow-md hover:shadow-gray-300 bg-gray-100 rounded-md p-2" />
        </Link>
        <Link href={`/events/${params.slug}/leaderboard`}>
          <BarChart className="h-12 w-12 hover:bg-gray-200 hover:shadow-md hover:shadow-gray-300 bg-gray-100 rounded-md p-2" />
        </Link>
      </div>
      <div className="container mx-auto py-10 mt-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Editorials</CardTitle>
          </CardHeader>
          <CardContent>
            {editorials.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No editorials available yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortedEditorials.map((editorial, ind) => (
                  <Button
                    key={ind}
                    variant="outline"
                    asChild
                    className="h-auto py-4 flex flex-col items-center justify-center"
                  >
                    <Link
                      href={`/events/${params.slug}/editorials/${editorial.problemIndex}`}
                    >
                      <BookOpen className="h-10 w-10 mb-1" />
                      <span className="font-bold">
                        <span className="font-normal">Problem</span>{" "}
                        {editorial.problemIndex}
                      </span>
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
