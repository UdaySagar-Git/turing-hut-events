import { type NextAuthConfig } from "next-auth";
// import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = credentialsSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error("Invalid input: Username and password are required");
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!user) {
          throw new Error("No user found");
        }

        if (!user.password) {
          throw new Error("User has not set a password");
        }
        // const valid = await bcryptjs.compare(password, user.password);
        const valid = password == user.password

        if (!valid) {
          throw new Error("Invalid username or password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role as Role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
