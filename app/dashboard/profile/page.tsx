// dashboard/profile/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@supabase/auth-js";

export default async function ProfilePage() {
  const supabase = createClient();

  // Fetch the authenticated user
  const {
    data: { user },
  }: { data: { user: User | null } } = await supabase.auth.getUser();

  // Redirect to sign-in if the user is not authenticated
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-start p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
      <div className="text-lg mb-2">Email: {user.email}</div>
      <pre className="text-sm font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
