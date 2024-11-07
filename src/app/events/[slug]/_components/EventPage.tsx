"use client";

import { TfiMenuAlt } from "react-icons/tfi";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Contest, Event } from "@prisma/client";
import { IUser, Submission } from "@/interfaces/codeforces";
import FetchSubmissions from "./FetchSubmissions";
import day from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import AutoRefresh from "./AutoRefetch";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import MarkdownPreview from "@/components/MarkdownPreview";
import Loading from "@/components/common/Loading";

interface ISubmissionData {
  [key: string]: Submission[];
}

interface ILastUpdated {
  [key: string]: string;
}

const EventPageDetails = ({
  slug,
  currentUser,
}: {
  slug: string;
  currentUser: any;
}) => {
  const [event, setEvent] = useState<Event & { contests: Contest[] } | null>(null);
  const [data, setData] = useState<ISubmissionData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<ILastUpdated | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [eventEnded, setEventEnded] = useState<boolean>(false);

  const guidelines = `
# Guidelines
1)ㅤThere is **no partial scoring** in this round. 

2)ㅤIf your ranks are tied based on your score, tie will be broken based on your total penalty.

3)ㅤFor every test case after the first, a **10-minute penalty** will be added for each verdict other than "Accepted."

4)ㅤThe penalty will only be added if you are able to get an accepted verdict for that particular question in the stipulated time.

5)ㅤEach question’s penalty scoring is independent, i.e., time scoring begins from 0 for every question from the start time of that particular question.`

  const isCurrentContest = (contest: Contest) => {
    const now = new Date().toISOString();
    const startTime = new Date(contest.startTime).toISOString();
    const endTime = new Date(contest.endTime).toISOString();
    return startTime <= now && endTime > now;
  };

  const fetchData = async () => {
    const res = await axios.get(`/api/events/${slug}/leaderboard`);
    setEvent(res.data.event);
    setData(res.data.data);
    setLastUpdated(res.data.lastUpdated);

    const now = Date.now();
    const eventEndTime= day(res.data.event?.endTime).valueOf();

    const isEventEnded = ( now - eventEndTime >0) ? true : false;
    setEventEnded(isEventEnded);

    const currentContest = res.data.event.contests.find(isCurrentContest);
    if (currentContest) {
      const endTime = day(new Date(currentContest.endTime)).valueOf();
      const timeLeftInSeconds = Math.floor((endTime - now) / 1000);
      setTimeLeft(timeLeftInSeconds);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 0) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  if (!event) {
    return <Loading />
  }

  const getIndex = (problemIndex: string) => {
    return event?.problemIndices.findIndex((index) => index === problemIndex)
  }

  const contestIds = event.contests.map((contest) => contest.contestId);
  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
  };

  const hourMinSec = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
  }

  const list: IUser = {};
  let userSubmissions: IUser | null = {};

  // fix all questions
  const problems = event?.problemIndices;
  const totalAccepts: number[] = Array(problems.length).fill(0);
  const totalTries: number[] = Array(problems.length).fill(0);

  // to make req obj to print table
  Object.entries(data ?? {}).forEach(([problemIndex, submissions]) => {
    submissions.forEach((submission: Submission) => {
      if (submission?.author.participantType === "CONTESTANT") {
        const handle = submission.author.members[0].handle;
        const teamName = submission.teamName;
        const time = submission.relativeTimeSeconds;
        const verdict = submission.verdict;
        const passedTestCount = submission.passedTestCount;
        const ind: number = getIndex(problemIndex)

        // user not found
        if (!list[handle]) {
          list[handle] = {
            ranking:1,
            acceptedCount: 0,
            totalWrongs: 0,
            totalSubmissionTime: 0,
            totalPenality: 0,
            submissions: {},
            teamName: teamName,
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
      const ind: number = getIndex(ques)
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

  let rank=1;
  const users= Object.keys(userSubmissions)

  users.forEach((user:string,ind:number)=>{
    if(ind>0){
      if(userSubmissions[users[ind]].acceptedCount !== userSubmissions[users[ind-1]].acceptedCount || userSubmissions[users[ind]].totalPenality !== userSubmissions[users[ind-1]].totalPenality){
        rank++;
      }
      userSubmissions[users[ind]].ranking=rank;
    }
  })

  const myCFHandle = currentUser?.cfHandle;


  return !userSubmissions ? (
    <div>No data available.</div>
  ) : (
    <>
      <div className="px-5 ">
        <h1 className="text-center text-4xl mt-5 font-semibold mb-3 text-[#114f3e]">
          {event.name}
        </h1>
        <h1 className="text-3xl font-bold text-center mb-5">
          <MarkdownPreview content={event.announcement ?? ""} />
        </h1>

        {currentUser?.role === "ADMIN" && (
          <div className="flex gap-2 m-5">
            {contestIds.map((contestId) => (
              <span key={contestId}>
                <FetchSubmissions contestId={contestId} />
              </span>
            ))}
          </div>
        )}

        {
          eventEnded ? 
            <div className="my-4 w-full flex space-x-3 justify-center">
              <Link href={`/events/${slug}/dashboard`}>
                <Button className="">Problemset</Button>
              </Link>
              <Link href={`/events/${slug}/editorials`}>
                <Button >
                  Editorials
                </Button>
                </Link>
            </div>
          :
            <div className="flex justify-between items-center gap-8 max-w-[1172px] min-w-[892px] mx-auto ">
              <AutoRefresh onRefresh={fetchData} />
              <div className="text-xl text-gray-600 -ml-32 -mb-2">
                {timeLeft ? (
                  <span>
                    <span className="font-semibold mr-1">Time Left :</span>
                    {hourMinSec(timeLeft)}
                  </span>
                ) : "Contest Ended"}
              </div>
              <div className="flex gap-4">
                {currentUser?.role === "ADMIN" && (
                  <Link href={`/admin/${slug}`}>
                    <Button >
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href={`https://ide.geeksforgeeks.org/`} target="_blank">
                  <Button >
                    IDE
                  </Button>
                </Link>
                <Link href={`/events/${slug}/editorials`}>
                  <Button >
                    Editorials
                  </Button>
                </Link>
              </div>
            </div>
        }

        <div className="max-w-[1172px] min-w-[892px] px-[3px] pb-[3px] overflow-x-auto mx-auto mb-5 text-center bg-[#E1E1E1] rounded-lg">
          <div className="flex justify-between h-7 mr-0.5">
            <h1 className="text-left font-[400] ps-1 flex ">
              Standings
              <TfiMenuAlt className="mt-1.5 ms-1 font-semibold" />
            </h1>
            <div className="">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <DialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 mt-2 me-1 cursor-pointer hover:text-gray-800 text-gray-950 hover:bg-gray00" />
                      </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>
                      <p>Guidelines</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent className="sm:max-w-[900px]">
                  <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <MarkdownPreview content={guidelines} />
                  </div>
                </DialogContent>
              </Dialog>
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
                    className={`w-16 px-[5.2px] py-[3px] border-r ${data?.[prob] ? "text-[#0000CC]" : "text-gray-400"
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
                            {lastUpdated && lastUpdated[prob]
                              ? day(lastUpdated[prob])
                                .utc()
                                .add(5.5, "hours")
                                .format("hh:mm:ss A")
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
                    className={`text-gray-800 h-10 border-b border-[#E1E1E1] text-center ${handle === myCFHandle
                      ? "bg-[#DDEEFF]"
                      : idx % 2 !== 0
                        ? "bg-white"
                        : "bg-[#f8f6f6]"
                      } `}
                  >
                    <td className="w-9 border-r border-[#E1E1E1] text-center">
                      {userData.ranking}
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
                        problemIndex &&
                        totalAccepts[getIndex(problemIndex)]
                      }
                    </p>
                    <p className="text-xs text-neutral-500">
                      {
                        totalTries[getIndex(problemIndex)]
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
