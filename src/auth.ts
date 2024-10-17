import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db";
import authConfig from "./auth.config";
 
export const { handlers:{
  GET,  
  POST,
}, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  ...authConfig,
})