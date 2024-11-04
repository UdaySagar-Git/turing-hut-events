"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const DeleteSessionButton = ({ sessionId }: { sessionId: string }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/session/${sessionId}`);
      toast.success("Session Deleted Successfully");
    } catch {
      toast.error("There was an error deleting the session. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDelete}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
    >
      <Trash2 className="w-4 h-4" />
      <span>Delete Session</span>
    </Button>
  );
};

export default DeleteSessionButton;
