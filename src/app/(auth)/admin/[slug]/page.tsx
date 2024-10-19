"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Page from "@/components/common/Page";
import CreateContestModal from "../_components/create-contest-modal";
import CreateManualSubmissionModal from "../_components/create-manual-submission-modal";
import axios from "axios";
import FetchSubmissions from "@/app/events/[slug]/FetchSubmissions";
import Link from "next/link";

const AdminDashboard = ({ params }: { params: { slug: string } }) => {
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [invitation, setInvitation] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [announcement, setAnnouncement] = useState("");
  const [isInvitationLoading, setIsInvitationLoading] = useState(false);
  const slug = params.slug;

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await axios.get(`/api/events/${slug}`);
      setEvent(response.data);
      setAnnouncement(response.data.announcement);
    };
    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (selectedContestId) {
      const fetchSubmissions = async () => {
        const response = await axios.get(
          `/api/contest/${selectedContestId}/submissions`
        );
        setSubmissions(response.data);
      };
      fetchSubmissions();
    }
  }, [selectedContestId]);

  const contests = event?.contests || [];
  const eventId = event?.id || "";

  const handleAnnouncementSubmit = async () => {
    if (!announcement.trim()) {
      toast.error("Announcement cannot be empty");
      return;
    }
    try {
      const res = await axios.put(`/api/events/${slug}`, {
        announcement,
      });
      setAnnouncement("");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send the announcement");
    }
  };

  const handleInvitation = async () => {
    try {
      setIsInvitationLoading(true);
      toast.loading("Posting invitation link");
      const response = await axios.put(`/api/contest/${selectedContestId}`, {
        invitationLink: invitation,
      });
      toast.dismiss();
      toast.success("Invitation link updated successfully");
      setIsInvitationLoading(false);
    } catch (error) {
      console.error("Error updating invitation link:", error);
      toast.error("Failed to update invitation link");
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
                className={`cursor-pointer p-2 ${
                  selectedContestId === contest.contestId
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => setSelectedContestId(contest.contestId)}
              >
                {contest.contestId}
              </div>
            ))}
            <CreateContestModal eventId={eventId} slug={slug} />
            <div className="py-4">
              <Link href={`/admin/${slug}/new-editorial`}>
                <Button>Create Editorial</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <FetchSubmissions contestId={selectedContestId} />
            </div>
            {selectedContestId && (
              <CreateManualSubmissionModal contestId={selectedContestId} />
            )}
          </div>

          {selectedContestId ? (
            <div className="my-8 flex flex-row items-center gap-6">
              <h2 className="text-xl font-semibold mb-2 md:mb-0">
                Invitation Link
              </h2>
              <input
                value={invitation}
                onChange={(e) => setInvitation(e.target.value)}
                className="w-full md:flex-1 border p-2 mb-2 md:mb-0"
                placeholder="Paste the contest invitation Link"
              />
              <Button
                className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded"
                onClick={handleInvitation}
                disabled={!selectedContestId}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Make an Announcement
              </h2>

              <input
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Write your announcement here..."
                className="w-full h-20 p-4 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />

              <button
                onClick={handleAnnouncementSubmit}
                className="mt-4 w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              >
                Send Announcement
              </button>
            </div>
          )}

          {selectedContestId && submissions?.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-4">
                Submissions for Contest {selectedContestId}
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

export default AdminDashboard;
