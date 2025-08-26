import EventManagement from "@/components/admin/event-management";
import { checkAuth } from "@/lib/check-auth";
import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth/next";

export default async function Page() {
  // In production, you would implement proper authentication here
  await checkAuth();
  const session = await getServerSession(authOptions);

  if (session?.user?.isAdmin) {
    return (
      <div className="container mx-auto p-6 py-25">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1f639e]">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, administrator! You have special access privileges.
          </p>
        </div>
        <EventManagement />
      </div>
    );
  }

  return (
    <div className="mt-30">
      <h1>Dashboard</h1>
      <p>Comming soon, hang tight!</p>
    </div>
  );
}
