import { checkAuth } from "@/lib/check-auth";
import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth/next";
import { type Session } from "next-auth";
import SettingsForm from "@/components/settings/settings-form";

export default async function Page() {
  await checkAuth();
  const session = await getServerSession(authOptions) as Session | null;

  return <SettingsForm user={session?.user} />;
}
