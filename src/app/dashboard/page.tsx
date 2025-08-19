
import EventManagement from "@/components/admin/event-management"

export default async function Page() {
  // In production, you would implement proper authentication here
  const isAdmin = true // For demo purposes, always show admin interface

  if (isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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

