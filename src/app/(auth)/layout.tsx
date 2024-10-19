import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  if (user.role === "ADMIN") {
    return (
      <>
        {children}
      </>
    );
  }
}
