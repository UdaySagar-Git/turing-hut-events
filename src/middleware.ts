import authConfig from "./auth.config";
import NextAuth from "next-auth";
export const { auth } = NextAuth(authConfig);


export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const publicRoutes = ["/public"];
  const authRoutes = ["/signin", "/signup"];

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isLoggedIn && isPublicRoute) {
    return Response.redirect(new URL("/signin", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
