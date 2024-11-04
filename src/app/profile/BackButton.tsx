"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" className="flex items-center gap-2"
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
}
