import type { Metadata } from "next";
import "./globals.css";
import Logo from "@/assets/images/turinghut.png";

export const metadata: Metadata = {
  title: "Turing Hut",
  description: "Turing Hut Events",
  icons: {
    icon: Logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}