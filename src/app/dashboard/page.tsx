import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/signin");
  }

  const user = session.user;

  // Check if user is admin
  if (user.isAdmin) {
    return (
      <div className="mt-30">
        <h1>Admin Dashboard</h1>
        <p>Welcome, administrator! You have special access privileges.</p>
        {/* Add admin-specific content here */}
      </div>
    );
  }

  return (
    <div className="mt-30">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}
