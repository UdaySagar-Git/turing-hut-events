import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import Link from "next/link"
import React from "react"
import SignOutButton from "./SignOutButton"
import day from "@/lib/dayjs"
import { allActiveSessions } from "@/actions/user"
import DeleteSessionButton from "./DeleteSessionButton"

const ProfilePage = async () => {
  const session: any = await auth()
  const sessions = session?.user?.id && await allActiveSessions(session.user.id)

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">User Profile</h1>
          {session && session.user ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-1">Name: {session.user.name}</p>
                <p className="text-sm text-gray-500 mt-1">User ID: {session.user.id}</p>
                <p className="text-lg text-gray-600"> Email: {session.user.email}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Active Sessions</h3>
                {sessions && sessions.length > 0 ? (
                  <ul className="space-y-4">
                    {sessions.map((s: any) => (
                      <li key={s.id} className={`bg-white p-4 rounded-lg shadow ${s.sessionToken === session.sessionToken ? "border-2 border-green-500" : ""}`}>
                        <p className="text-sm text-gray-600">Session Token: <span className="font-mono bg-gray-100 p-1 rounded">{s.sessionToken}</span></p>
                        <p className="text-sm text-gray-600 mt-2">Login Time: <span className="font-semibold">{day(s.createdAt).format("DD MMM YY, hh:mm:ss A")}</span></p>
                        <p className="text-sm text-gray-600 mt-2">Expires: <span className="font-semibold">{day(s.expires).format("DD MMM YY, hh:mm:ss A")}</span></p>
                        {s.sessionToken === session.sessionToken ? (
                          <p className="text-sm text-green-600 font-semibold mt-2">Current Session</p>
                        ) : (
                          <DeleteSessionButton sessionId={s.id} />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No active sessions found.</p>
                )}
              </div>
              <div className="mt-6">
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-4">Please sign in to view your profile</p>
              <Button className="w-full max-w-xs mx-auto">
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
