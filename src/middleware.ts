import { Role } from "@prisma/client";
import authConfig from "./auth.config";
import NextAuth, { User } from "next-auth";
export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // todo: change this type
  const user = req.auth?.user as User & { role?: Role };
  const isAdmin = user?.role === "ADMIN";

  const authRoutes = ["/signin", "/signup"];

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.includes("/admin");
  const isPublicRoute = !isAdminRoute;

  // Admin routes are only accessible to admins
  if (isAdminRoute && !isAdmin) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // API routes are not authenticated (and not admin routes)
  if (isApiAuthRoute) {
    return;
  }

  // Auth routes are not accessible if the user is already logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (isPublicRoute) {
    return;
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
