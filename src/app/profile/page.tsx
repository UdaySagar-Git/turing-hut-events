import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import Link from "next/link";
import React from "react";
import SignOutButton from "./SignOutButton";
import day from "@/lib/dayjs";
import { allActiveSessions } from "@/actions/user";
import DeleteSessionButton from "./DeleteSessionButton";
import { ImProfile } from "react-icons/im";
import { User, Clock, Shield, Mail, Key } from "lucide-react";

const ProfilePage = async () => {
  const session: any = await auth();
  const sessions =
    session?.user?.id && (await allActiveSessions(session.user.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          {session && session.user ? (
            <div className="space-y-8">
              {/* Profile Information Section */}
              <Card className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-indigo-800">
                    <ImProfile className="w-6 h-6" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Key className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-mono text-sm bg-white/50 rounded px-2 py-1">
                        {session.user.id}
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
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Codeforces Handle</p>
                      <p className="font-medium text-gray-900">
                        {session.user.cfHandle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Team Name</p>
                      <p className="font-medium text-gray-900">
                        {session.user.teamName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions Section */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-purple-800">
                    <Shield className="w-6 h-6" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions && sessions.length > 0 ? (
                    <div className="space-y-4">
                      {sessions.map((s: any) => (
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
                              <div className="absolute top-2 right-2 bg-[#0e9f59] font-semibold text-white rounded-md px-2 ">
                                Current Session
                              </div>
                            )}
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">
                                  Session Token
                                </p>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                  {s.sessionToken}
                                </code>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Login Time
                                    </p>
                                    <p className="text-sm font-medium">
                                      {day(s.createdAt).format(
                                        "DD MMM YY, hh:mm:ss A"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Expires
                                    </p>
                                    <p className="text-sm font-medium">
                                      {day(s.expires).format(
                                        "DD MMM YY, hh:mm:ss A"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {s.sessionToken !== session.sessionToken && (
                                <div className="mt-4">
                                  <DeleteSessionButton sessionId={s.id} />
                                </div>
                              )}
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

              <div className="flex justify-end">
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-8">
                <p className="text-xl text-gray-600 mb-6">
                  Please sign in to view your profile
                </p>
                <Button className="w-full max-w-xs mx-auto">
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
