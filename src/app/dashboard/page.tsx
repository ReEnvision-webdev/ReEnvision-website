import EventManagement from "@/components/admin/event-management";
import ChapterManagement from "@/components/admin/chapter-management";
import StudentDashboard from "@/components/student-dashboard";
import AdminApprovalWorkflow from "@/components/admin-approval-workflow";
import UserManagementModal from "@/components/admin/user-management-modal";
import { checkAuth } from "@/lib/check-auth";
import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth/next";
import { type Session } from "next-auth";
import { MessageCircle, Bell } from "lucide-react"; // Corrected import
import Link from "next/link";

// Unverified user component
function UnverifiedUser({ name }: { name: string }) {
  return (
    <div className="bg-[#F0F8FF] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-[#1d588a] mb-4">
            Hey, {name}!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your member verification has been sent. While you wait, please join
            our Discord and Remind to get important updates and connect with the
            community.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="https://discord.gg/XWVJadkn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-[#1d588a] hover:text-[#00427A] transition-colors"
            >
              <MessageCircle className="w-12 h-12 mb-2" />
              <span>Discord</span>
            </Link>
            <Link
              href="https://www.remind.com/join/reenvision"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-[#1d588a] hover:text-[#00427A] transition-colors"
            >
              <Bell className="w-12 h-12 mb-2" />
              <span>Remind</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Page() {
  await checkAuth();
  const session = await getServerSession(authOptions) as Session | null;

  if (session?.user?.isAdmin) {
    return (
      <div className="container mx-auto p-6 py-8 pt-30">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1f639e]">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, administrator! You have special access privileges.
          </p>
        </div>

        {/* User Management Modal - at the top */}
        <div className="mb-12">
          <UserManagementModal />
        </div>

        <div className="mt-12">
          <EventManagement />
        </div>
        <div className="mt-12">
          <ChapterManagement />
        </div>

        {/* Admin Approval Workflow Section - at the bottom */}
        <div className="mt-12">
          <AdminApprovalWorkflow />
        </div>
      </div>
    );
  }

  if (session?.user?.isVerified) {
    return <StudentDashboard />;
  }

  return <UnverifiedUser name={session?.user?.name || "Member"} />;
}
