import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import React from "react";
import SignOutButton from "./SignOutButton";
import day from "@/lib/dayjs";
import { allActiveSessions } from "@/actions/user";
import DeleteSessionButton from "./DeleteSessionButton";
import { User, Shield, Mail } from "lucide-react";
import { SiCodeforces } from "react-icons/si";
import { RiTeamFill } from "react-icons/ri";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import BackButton from "./BackButton";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session: any = await auth();
  const sessions =
    session?.user?.id && (await allActiveSessions(session.user.id));

  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader >
          <div className="flex justify-between items-center">
            <BackButton />
            <CardTitle className="text-3xl font-bold text-[#166953] text-center">
              User Profile
            </CardTitle>
            <SignOutButton />
          </div>
        </CardHeader>

        <CardContent className="">
          {session && session.user && (
            <div className="space-y-8">
              {/* Profile Information Section */}
              <Card className="bg-gradient-to-r from-indigo-50 to-blue-50">
                {/* <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl max-sm:text-xl text-indigo-800">
                    <ImProfile className="w-6 h-6" />
                    Profile Information
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="grid grid-cols-2 pt-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {session.user.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <SiCodeforces className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Codeforces Handle</p>
                        <p className="font-medium text-gray-900">
                          {session.user.cfHandle || "Not Set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiTeamFill className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Team Name</p>
                        <p className="font-medium text-gray-900">
                          {session.user.teamName || "Not Set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions Section */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl max-sm:text-xl text-indigo-800">
                    <Shield className="w-6 h-6" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions && sessions.length > 0 ? (
                    <div className="space-y-4">
                      {sessions.map((s: any, index: number) => (
                        <Card
                          key={s.id}
                          className={`relative overflow-hidden transition-all duration-200 hover:shadow-md
                            ${s.sessionToken === session.sessionToken
                              ? "border-2 border-green-500"
                              : ""
                            }`}
                        >
                          <CardContent className="p-4">
                            {s.sessionToken === session.sessionToken && (
                              <div className="absolute max-sm:text-sm max-sm:top-1 max-sm:right-1 top-2 right-2 bg-[#0e9f59] font-semibold text-white rounded-md px-2 ">
                                Current Session
                              </div>
                            )}
                            <div className="space-y-3">
                              <div className="flex items-center flex-wrap gap-8">
                                <span className="text-sm text-gray-500">
                                  Session {index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <FaSignInAlt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Login Time
                                    </p>
                                    <p className="text-sm font-medium">
                                      {day(s.createdAt)
                                        .utc()
                                        .add(5.5, "hours")
                                        .format("DD MMM YY, hh:mm:ss A")}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FaSignOutAlt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Expires
                                    </p>
                                    <p className="text-sm font-medium">
                                      {day(s.expires)
                                        .utc()
                                        .add(5.5, "hours")
                                        .format("DD MMM YY, hh:mm:ss A")}
                                    </p>
                                  </div>
                                </div>
                                {s.sessionToken !== session.sessionToken && (
                                  <div className="ml-auto">
                                    <DeleteSessionButton sessionId={s.id} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">
                      No active sessions found.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
