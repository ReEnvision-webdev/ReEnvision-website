import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const checkAuth = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/signin");
  }
};
