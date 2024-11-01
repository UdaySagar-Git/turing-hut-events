"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const DeleteSessionButton = ({ sessionId }: { sessionId: string }) => {
  const {toast} = useToast();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/session/${sessionId}`);
      console.log("Session Deleted");
      toast({
        title: "Session Deleted",
        description: "The session has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error deleting the session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return <Button onClick={handleDelete}>Delete Session</Button>;
};

export default DeleteSessionButton;
