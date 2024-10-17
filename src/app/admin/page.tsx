"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getEvent } from "@/actions/events";
import { getContestStatus } from "@/actions/codeforces";
import Loading from "@/components/common/Loading";
import Page from "@/components/common/Page";
import CreateContestModal from "./create-contest-modal";
import CreateManualSubmissionModal from "./create-manual-submission-modal";
import { Input } from "@/components/ui/input";

const AdminDashboard = ({ slug }: { slug: string }) => {
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = async () => {
    // await checkUser
    const isAuthenticated = accessToken === "turinghut";
    if (isAuthenticated) {
      // TODO: change this to support multiple events
      localStorage.setItem(`accessToken`, accessToken);
      window.location.reload();
    } else {
      toast.error("Invalid access token");
    }
  };

  if (localStorage.getItem(`accessToken`)) {
    return <AuthunticatedPage slug={slug} />;
  }

  return (
    <form className="p-10 flex gap-5">
      <Input
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
  );
};

export default AdminDashboard;

const AuthunticatedPage = async ({ slug }: { slug: string }) => {
  const isAuthenticated = true;
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [invitation, setInvitation] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const event = await getEvent(slug);

  if (!event) {
    return <Loading />;
  }

  const contests = event?.contests || [];
  const eventId = event?.id || "";

  if (!isAuthenticated) {
    return <div className="text-center mt-8">Authenticating...</div>;
  }

  const fetchSubmissions = async () => {
    toast.loading("Fetching submissions from Codeforces");

    if (selectedContest) {
      setIsFetching(true);
      try {
        const result = await getContestStatus(slug);
        setSubmissions(result);

        toast.dismiss();
        toast.success("Submissions fetched from Codeforces");
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch submissions");
      } finally {
        setIsFetching(false);
      }
    }
  };

  const saveData = async (submissionData: any) => {
    try {
      const response=await api.post("/submissions/code-submission",submissionData);
      console.log("Submission saved:", response.data);
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  const handleSaveButton = () => {
    // const submissionData = {
    //   relativeTimeSeconds: 123,
    //   problem: { index: "A" },
    //   author: {
    //     participantType: "CONTESTANT",
    //     members: [{ handle: "user123" }],
    //   },
    //   verdict: "OK",
    //   passedTestCount: 5,
    // };

    try {
      if (submissions.length === 0) {
        toast.error("No submissions to save");
        return;
      }
      toast.loading("Saving submissions");
      setIsSaving(true);

      submissions.forEach((submission) => {
        const submissionData = {
          relativeTimeSeconds: submission.relativeTimeSeconds,
          problem: { index: submission.problem.index },
          author: {
            participantType: submission.author.participantType,
            members: [{ handle: submission.author.members[0].handle }],
          },
          verdict: submission.verdict,
          passedTestCount: submission.passedTestCount,
        };
        saveData(submissionData);
      });

      setIsSaving(false);
      toast.dismiss();
      toast.success("Submissions saved successfully");
    } catch (error) {
      console.error("Error saving submission:", error);
      toast.error("Failed to save submissions");
    }
  };

  return (
    <Page title={event?.name || "contest"}>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <div className="w-full md:w-64 bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Contests</h2>
            {contests.map((contest: any) => (
              <div
                key={contest.contestId}
                className={`cursor-pointer p-2  ${
                  selectedContest?.contestId === contest.contestId
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => setSelectedContest(contest)}
              >
                {contest.contestId}
              </div>
            ))}
            <CreateContestModal eventId={eventId} slug={slug} />
          </div>
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center justify-between gap-3">
                <Button
                  onClick={fetchSubmissions}
                  disabled={!selectedContest || isFetching}
                >
                  {isFetching ? "Fetching..." : "Fetch"}
                </Button>
                <Button
                  onClick={handleSaveButton}
                  disabled={!selectedContest || isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            <CreateManualSubmissionModal />
          </div>

          <div className="my-8">
            <h2 className="text-xl font-semibold mb-2">
              Paste Invitation Link
            </h2>
            <input
              value={invitation}
              onChange={(e) => setInvitation(e.target.value)}
              className="w-full border p-2 mb-2"
              placeholder="Paste the contest invitation Link"
            />
            <Button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
              Show Invitation
            </Button>
          </div>

          {/* <pre>{JSON.stringify(submissions, null, 2)}</pre> */}

          {selectedContest && submissions.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-4">
                Submissions for Contest {selectedContest?.contestId}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-blue-200">
                    <tr>
                      <th className="px-4 py-2 border border-blue-300">
                        Problem
                      </th>
                      <th className="px-4 py-2 border border-blue-300">
                        Author
                      </th>
                      <th className="px-4 py-2 border border-blue-300">
                        Time (s)
                      </th>
                      <th className="px-4 py-2 border border-blue-300">
                        Verdict
                      </th>
                      <th className="px-4 py-2 border border-blue-300">
                        Passed Tests
                      </th>
                      <th className="px-4 py-2 border border-blue-300">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission: any, index: number) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="px-4 py-2">
                          {submission.problem.index}
                        </td>
                        <td className="px-4 py-2">
                          {submission.author.members[0].handle}
                        </td>
                        <td className="px-4 py-2">
                          {submission.relativeTimeSeconds}
                        </td>
                        <td className="px-4 py-2">{submission.verdict}</td>
                        <td className="px-4 py-2">
                          {submission.passedTestCount}
                        </td>
                        <td className="px-4 py-2">
                          {submission.author.participantType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};
