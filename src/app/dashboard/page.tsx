
import EventManagement from "@/components/admin/event-management"
import { checkAuth } from "@/lib/check-auth"
export default async function Page() {
  // In production, you would implement proper authentication here
  const isAdmin = false // For demo purposes, always show admin interface
  await checkAuth();

  if (isAdmin) {
    return (
      <div className="container mx-auto p-6 py-25">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1f639e]">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, administrator! You have special access privileges.</p>
        </div>
        <EventManagement />
      </div>
    )
  }

  return (
    <div className="mt-30">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}

