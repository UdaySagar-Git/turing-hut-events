import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useState} from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { queryClient } from "@/actions/api";

const CreateContestModal = ({ eventId ,slug}: { eventId: string ,slug:string}) => {
  const [isAddContestOpen, setIsAddContestOpen] = useState(false);

  const [newContest, setNewContest] = useState({
    contestId: "",
    startTime: "",
    endTime: "",
  });

  const handleCreateContest = async () => {
    try {
      await axios.post(`/api/v1/events/${eventId}/contest`, newContest);
      toast.success("Contest created successfully");
      setNewContest({ contestId: "", startTime: "", endTime: "" });
      setIsAddContestOpen(false);
      queryClient.invalidateQueries({queryKey:["events",slug]});
    } catch (error) {
      toast.error("Error creating contest");
    }
  };

  return (
    <div>
      <Dialog open={isAddContestOpen} onOpenChange={setIsAddContestOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-8 w-full hover:bg-gray-200">
            Add Contest
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Contest</DialogTitle>
            <DialogDescription>
              Enter the contest details and click save to create a new contest.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contestId" className="text-right">
                Contest ID
              </Label>
              <Input
                id="contestId"
                value={newContest.contestId}
                onChange={(e) =>
                  setNewContest({
                    ...newContest,
                    contestId: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start
              </Label>
              <Input
                id="startTime"
                value={newContest.startTime}
                onChange={(e) =>
                  setNewContest({
                    ...newContest,
                    startTime: e.target.value,
                  })
                }
                className="col-span-3"
                type="datetime-local"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End
              </Label>
              <Input
                id="endTime"
                value={newContest.endTime}
                onChange={(e) =>
                  setNewContest({
                    ...newContest,
                    endTime: e.target.value,
                  })
                }
                className="col-span-3"
                type="datetime-local"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateContest}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateContestModal;
