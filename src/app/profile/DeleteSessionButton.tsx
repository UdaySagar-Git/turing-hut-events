"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const DeleteSessionButton = ({ sessionId }: { sessionId: string }) => {

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/session/${sessionId}`);
      console.log("Session Deleted");
      toast.success("Session Deleted");
    } catch {
      toast.error("There was an error deleting the session. Please try again.");
    }
  };

  return <Button onClick={handleDelete}>Delete Session</Button>;
};

export default DeleteSessionButton;
