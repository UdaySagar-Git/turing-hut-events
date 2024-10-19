import NextAuth, { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { v4 as uuid } from "uuid"
import { encode as defaultEncode } from "next-auth/jwt"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const adapter = PrismaAdapter(prisma)

export const authConfig: NextAuthConfig = {
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
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true
      }
      return token;
    },
  },
}

export const { handlers: {
  GET,
  POST
}, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
  },
  adapter,
  secret: process.env.NEXTAUTH_SECRET as string,
  ...authConfig,
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
  },
})
