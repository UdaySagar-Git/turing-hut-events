import { db } from "@/lib/db";
import { auth } from "@/auth";

export default async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) return null;

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email
      },
    });

    if (!currentUser) {
      throw new Error("Not signed in");
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
}
