"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { getStatusUrl } from "@/actions/codeforces";

const CreateManualSubmissionModal = ({ contestId }: { contestId: string }) => {
  const [isManualSubmissionsOpen, setIsManualSubmissionsOpen] = useState(false);
  const [manualSubmission, setManualSubmission] = useState<any>(null);

  const handleGetStatusUrl = async () => {
    const url = await getStatusUrl(contestId);
    window.open(url, "_blank");
  };

  const handleManualSubmission = async () => {
    try {
      toast.loading("Submitting manual data");
      const parsedSubmission = JSON.parse(manualSubmission);
      const res = await axios.post(`/api/contest/${contestId}/submissions`, {
        data: parsedSubmission.result,
      });

      toast.success("Manual submission successful");
      setIsManualSubmissionsOpen(false);
    } catch (error) {
      toast.error("Error submitting manual data");
    }
  };
  return (
    <div>
      <Dialog
        open={isManualSubmissionsOpen}
        onOpenChange={setIsManualSubmissionsOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="hover:bg-gray-200">
            Add Manual Submission
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Manual Submission</DialogTitle>
            <DialogDescription>
              Paste the submission JSON data below. from <Button variant="link" className="text-blue-500 hover:underline" onClick={handleGetStatusUrl}>here</Button>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              id="submission"
              value={manualSubmission}
              onChange={(e) => setManualSubmission(e.target.value)}
              className="col-span-3 h-32 p-2 border rounded"
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleManualSubmission}>
              Post Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateManualSubmissionModal;
