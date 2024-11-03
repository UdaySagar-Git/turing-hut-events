import Loading from "@/components/common/Loading";
import { getAllSubmissionsByEvent } from "@/actions/codeforces";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Contest, Event } from "@prisma/client";
import { IUser } from "@/interfaces/codeforces";
import FetchSubmissions from "./FetchSubmissions";
import day from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getCurrentUser from "@/actions/getCurrentUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import Guidelines from "./Guidelines";
import MarkdownPreview from "@/components/MarkdownPreview";

const EventPageDetails = async ({
  event,
  slug,
}: {
  event: Event & { contests: Contest[] };
  slug: string;
}) => {
  const { data, lastUpdated } = await getAllSubmissionsByEvent(slug);
  const contestIds = event.contests.map((contest) => contest.contestId);

  if (!data) {
    return <Loading />;
  }

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
  };

  const list: IUser = {};
  let userSubmissions: IUser | null = {};

  // fix all questions
  const problems = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const totalAccepts: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  const totalTries: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  // to make req obj to print table
  Object.entries(data).forEach(([problemIndex, submissions]) => {
    submissions.forEach((submission: any) => {
      if (submission?.author.participantType === "CONTESTANT") {
        const handle = submission.author.members[0].handle;
        const teamName = submission.teamName;
        const time = submission.relativeTimeSeconds;
        const verdict = submission.verdict;
        const passedTestCount = submission.passedTestCount;
        const ind: number = problemIndex.charCodeAt(0) - "A".charCodeAt(0);

        // user not found
        if (!list[handle]) {
          list[handle] = {
            acceptedCount: 0,
            totalWrongs: 0,
            totalSubmissionTime: 0,
            totalPenality: 0,
            submissions: {},
            teamName: teamName
          };
        }

        // question not found
        if (!list[handle].submissions[problemIndex]) {
          list[handle].submissions[problemIndex] = {
            contestId: submission.contestId,
            accepted: false,
            wrongs: 0,
            time: 0,
          };
          totalTries[ind]++;
        }

        const userProblem = list[handle].submissions[problemIndex];
        // not accptd till now
        if (!userProblem.accepted) {
          if (verdict === "OK") {
            list[handle].totalWrongs -= userProblem.wrongs;
            userProblem.wrongs = 0;
            list[handle].acceptedCount++;
            userProblem.accepted = true;
            userProblem.time = time;
          } else {
            if (passedTestCount > 0) {
              userProblem.wrongs++;
              list[handle].totalWrongs++;
            }
          }
        } else {
          // prev accptd
          if (verdict === "OK") {
            list[handle].totalWrongs -= userProblem.wrongs;
            userProblem.wrongs = 0;
            userProblem.time = time;
          } else {
            if (passedTestCount > 0) {
              userProblem.wrongs++;
              list[handle].totalWrongs++;
            }
          }
        }
      }
    });
  });

  Object.keys(list).forEach((key) => {
    const user = list[key];
    Object.keys(user.submissions).forEach((ques) => {
      const ind: number = ques.charCodeAt(0) - "A".charCodeAt(0);
      if (user.submissions[ques].accepted) {
        totalAccepts[ind]++;
      }
    });
  });

  Object.keys(list)?.forEach((key) => {
    const user = list[key];
    // total submission time = sum of time in all questions
    user.totalSubmissionTime = Object.values(user.submissions).reduce(
      (timeSum, submission) => {
        return (
          timeSum + (submission.accepted ? Math.floor(submission.time / 60) : 0)
        );
      },
      0
    );

    user.totalWrongs = Object.values(user.submissions).reduce(
      (wrongSum, submission) => {
        return wrongSum + (submission.accepted ? submission.wrongs : 0);
      },
      0
    );
    // find totalPenality=wrongs*10+time
    user.totalPenality =
      10 * user.totalWrongs + Math.floor(user.totalSubmissionTime);
  });

  const sortedList = Object.fromEntries(
    Object.entries(list).sort(([, userA], [, userB]) => {
      if (userB.acceptedCount !== userA.acceptedCount) {
        return userB.acceptedCount - userA.acceptedCount;
      } else {
        return userA.totalPenality - userB.totalPenality;
      }
    })
  ) as IUser;
  userSubmissions = sortedList;

  const session = await getCurrentUser();
  const myCFHandle = session?.cfHandle;

  return !userSubmissions ? (
    <div>No data available.</div>
  ) : (
    <>
      <div className="px-5 ">
        <h1 className="text-center text-4xl mt-5 font-semibold mb-3 text-[#114f3e]">
          {event.name}
        </h1>
        <h1 className="text-3xl font-bold text-red-600/85 text-center mb-5">
          <MarkdownPreview content={event.announcement ?? ""} />
        </h1>

        <div className="flex justify-center gap-8">
          <Link href={`/events/${slug}/editorials`}>
            <Button className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded  z-10 shadow-md shadow-blue-500 hover:shadow-lg hover:shadow-blue-500 ">
              Editorials
            </Button>
          </Link>
          {session?.role === "ADMIN" && (
            <Link href={`/admin/${slug}`}>
              <Button className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded  z-10 shadow-md shadow-blue-500 hover:shadow-lg hover:shadow-blue-500 ">
              Admin
            </Button>
            </Link>
          )}
        </div>

        {session?.role === "ADMIN" && (
          <div className="flex gap-2 m-5">
            {contestIds.map((contestId) => (
              <span key={contestId}>
                <FetchSubmissions contestId={contestId} />
              </span>
            ))}
          </div>
        )}

        <div className="max-w-[1172px] min-w-[892px] px-[3px] pb-[3px] overflow-x-auto mx-auto my-5 text-center bg-[#E1E1E1] rounded-lg">
          <div className="flex justify-between h-7 mr-0.5">
            <h1 className="text-left font-[400] ps-1 flex ">
              Standings
              <TfiMenuAlt className="mt-1.5 ms-1 font-semibold" />
            </h1>
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full text-sm">
                    <Info className="pt-1"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Guidelines/>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <table className="w-full table-auto border-collapse border font text-sm border-gray-100 ">
            <thead className="h-[20px] bg-white">
              <tr className=" text-gray-700 border-b ">
                <th className="w-9 border-r border-[#E1E1E1] text-center">#</th>
                <th className="pe-2 ps-3 border-r border-[#E1E1E1] text-left">
                  Who
                </th>
                <th className="w-10 border-r border-[#E1E1E1] text-center">
                  =
                </th>
                <th className="w-[68px] border-r border-[#E1E1E1] text-center">
                  Penalty
                </th>
                {problems.map((prob, index: number) => (
                  <th
                    key={index}
                    className={`w-16 px-[5.2px] py-[3px] border-r ${data[prob] ? "text-[#0000CC]" : "text-gray-400"
                      } underline border-[#E1E1E1] text-center`}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <div className="flex flex-col items-center">
                            <span className="underline">{prob}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm text-white">
                            Last Updated:{" "}
                            {lastUpdated[prob]
                              ? day(lastUpdated[prob]).format("hh:mm:ss A")
                              : "null"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(userSubmissions).map(
                ([handle, userData], idx) => (
                  <tr
                    key={handle}
                    className={`text-gray-800 h-10 border-b border-[#E1E1E1] text-center ${handle === myCFHandle ? "bg-[#DDEEFF]" : idx % 2 !== 0 ? "bg-white" : "bg-[#f8f6f6]"
                      } `}
                  >
                    <td className="w-9 border-r border-[#E1E1E1] text-center">
                      {idx + 1}
                    </td>
                    <td className="pe-2 font-[600] ps-3 border-r border-[#E1E1E1] text-left">
                      <p>{userData.teamName || handle}</p>
                    </td>
                    <td className="w-10 border-r border-[#E1E1E1] text-center">
                      {userData.acceptedCount}
                    </td>
                    <td className="w-[68px] border-r border-[#E1E1E1] text-center">
                      {userData.acceptedCount ? userData.totalPenality : 0}
                    </td>
                    {problems.map((problemIndex) => (
                      <td
                        key={problemIndex}
                        className="w-16 px-[5.2px] py-0.5 border-r border-[#E1E1E1] text-xs"
                      >
                        <p className="font-bold flex justify-center items-center">
                          {userData.submissions[problemIndex]?.accepted ? (
                            <span className="text-[#0a0]">
                              <FaPlus className="inline-block pb-0.5 ps-1" />
                              {userData.submissions[problemIndex]?.wrongs > 0
                                ? userData.submissions[problemIndex]?.wrongs
                                : ""}
                            </span>
                          ) : userData.submissions[problemIndex] &&
                            userData.submissions[problemIndex]?.wrongs !== 0 ? (
                            <span className="text-[#00a] font-normal">
                              <FaMinus className="inline-block pb-0.5 ps-2" />
                              {userData.submissions[problemIndex]?.wrongs}
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                        <p className="font-[480] ">
                          {userData.submissions[problemIndex]?.time > 0
                            ? userData.submissions[problemIndex].accepted &&
                            formatTime(
                              userData.submissions[problemIndex].time
                            )
                            : " "}
                        </p>
                      </td>
                    ))}
                  </tr>
                )
              )}
              <tr className="text-gray-800 text-center bg-white">
                <td className="px-3 pb-3 border-r border-[#E1E1E1] text-center">
                  {" "}
                </td>
                <td className="pe-2 ps-3 border-r border-[#E1E1E1] text-left">
                  <p className="text-xs text-[#0a0]">Accepted</p>
                  <p className="text-xs text-neutral-500">Tried</p>
                </td>
                <td className="w-10 border-r border-[#E1E1E1] text-center"></td>
                <td className="w-[68px] border-r border-[#E1E1E1] text-center"></td>
                {problems.map((problemIndex) => (
                  <td
                    key={problemIndex}
                    className="w-16 py-0  border-r border-[#E1E1E1] text-xs"
                  >
                    <p className="text-[11px] text-[#0a0]">
                      {
                        totalAccepts[
                        problemIndex.charCodeAt(0) - "A".charCodeAt(0)
                        ]
                      }
                    </p>
                    <p className="text-xs text-neutral-500">
                      {
                        totalTries[
                        problemIndex.charCodeAt(0) - "A".charCodeAt(0)
                        ]
                      }
                    </p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EventPageDetails;
