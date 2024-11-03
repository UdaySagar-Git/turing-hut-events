"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Page from "@/components/common/Page";
import CreateContestModal from "../_components/create-contest-modal";
import CreateManualSubmissionModal from "../_components/create-manual-submission-modal";
import axios from "axios";
import FetchSubmissions from "@/app/events/[slug]/_components/FetchSubmissions";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import { getCodeString } from 'rehype-rewrite';
import katex from "katex";
import 'katex/dist/katex.css';

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
      toast.loading("Sending announcement");
      await axios.put(`/api/events/${slug}`, {
        announcement,
      });
      setAnnouncement("");
      toast.success("Announcement sent successfully");
    } catch (error) {
      toast.error("Failed to send the announcement");
    }
  };

  const handleInvitation = async () => {
    try {
      setIsInvitationLoading(true);
      await axios.put(`/api/contest/${selectedContestId}`, {
        invitationLink: invitation,
      });
      setIsInvitationLoading(false);
      toast.success("Invitation link updated successfully");
    } catch (error) {
      console.error("Error updating invitation link:", error);
      setIsInvitationLoading(false);
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
                className={`cursor-pointer p-2 ${selectedContestId === contest.contestId
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-300"
                  }`}
                onClick={() => {
                  setSelectedContestId(contest.contestId);
                  setInvitation(contest.invitationLink);
                }}
              >
                {contest.contestId}
              </div>
            ))}
            <CreateContestModal eventId={eventId} slug={slug} />
            <div className="py-4">
              <Link href={`/admin/${slug}/new-editorial`}>
                <Button className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded">
                  Create Editorial
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              {selectedContestId && (
                <FetchSubmissions contestId={selectedContestId} />
              )}
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
                className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded"
                onClick={handleInvitation}
                disabled={!selectedContestId}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg mx-auto mt-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Make an Announcement
              </h2>
              <div data-color-mode="light" className="border rounded-md overflow-hidden w-full">
                <MDEditor
                  value={announcement}
                  onChange={(newValue) => setAnnouncement(newValue || "")}
                  height={400}
                  preview="edit"
                  previewOptions={{
                    components: {
                      code: ({ children = [], className, ...props }) => {
                        if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
                          const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
                            throwOnError: false,
                          });
                          return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />;
                        }
                        const code = props.node && props.node.children ? getCodeString(props.node.children) : children;
                        if (
                          typeof code === 'string' &&
                          typeof className === 'string' &&
                          /^language-katex/.test(className.toLocaleLowerCase())
                        ) {
                          const html = katex.renderToString(code, {
                            throwOnError: false,
                          });
                          return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                        }
                        return <code className={String(className)}>{children}</code>;
                      },
                    },
                  }}
                />
              </div>

              <button
                onClick={handleAnnouncementSubmit}
                className="mt-4 font-semibold w-full bg-[#26755F] text-white py-2 px-4 rounded-md hover:bg-[#26755F]/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              >
                Send Announcement !
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
