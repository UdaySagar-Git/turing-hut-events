import type { Metadata } from "next";
import "./globals.css";
import Logo from "@/assets/images/turinghut.png";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Turing Hut",
  description: "Turing Hut Events",
  icons: {
    icon: Logo.src,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider
      refetchInterval={5 * 60}// 5 minutes
      session={session}>
      <Toaster />
      <html lang="en" className="bg-bg-gray-100">
        <body>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
