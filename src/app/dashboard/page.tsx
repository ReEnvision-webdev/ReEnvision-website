import { checkAuth } from "@/lib/check-auth";

export default async function Page() {
  await checkAuth();

  return (
    <div className="mt-30">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}
