import React from "react";
import { getEditorial } from "@/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import getCurrentUser from "@/actions/getCurrentUser";
import DeleteEditorial from "../_components/DeleteEditorial";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Home } from "lucide-react";

export default async function EditorialPage({
  params,
}: {
  params: { slug: string; problemIndex: string };
}) {
  const { slug, problemIndex } = params;
  const editorial = await getEditorial(slug, problemIndex);
  const session = await getCurrentUser();

  if (!editorial) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Editorial Not Found</h1>
        <p className="mb-4">
          The editorial for Problem {problemIndex} could not be found.
        </p>
        <Button asChild>
          <Link href={`/events/${slug}/editorials`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editorials
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-7 left-4 flex space-x-8 ">
        <Link href="/">
          <Home className="h-12 w-12 hover:bg-gray-200 hover:shadow-md hover:shadow-gray-300 bg-gray-100 rounded-md p-2" />
        </Link>
      </div>
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Button variant="ghost"  asChild>
                <Link href={`/events/${slug}/editorials`}>
                  <ArrowLeft className="mr-1 h-4 w-4" />Back
                </Link>
              </Button>
              <div className="flex items-center justify-between gap-2">
                {editorial.problemLink && (
                  <Button variant="outline" asChild>
                    <a
                      href={editorial.problemLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Problem Link <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {session && session.role === "ADMIN" && (
                  <DeleteEditorial editorialId={editorial.id} />
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              Editorial for Problem {problemIndex}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <MarkdownPreview content={editorial.content || ""} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
