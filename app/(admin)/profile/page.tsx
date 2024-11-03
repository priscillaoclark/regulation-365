import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@supabase/auth-js";
import { Clock, Mail, Calendar, Shield } from "lucide-react";

interface Identity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
  email: string;
}

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  }: { data: { user: User | null } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const {
    email,
    email_confirmed_at,
    last_sign_in_at,
    created_at,
    app_metadata,
    user_metadata,
    identities,
  } = user as User & { identities: Identity[] };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold dark:text-white">Profile Details</h2>

      {/* Key Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-2xl font-semibold dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-lime-500" />
            Account Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {created_at ? new Date(created_at).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email Verified
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {email_confirmed_at
                    ? new Date(email_confirmed_at).toLocaleString()
                    : "Not Verified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Sign-In
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {last_sign_in_at
                    ? new Date(last_sign_in_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Details Section */}
        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-2xl font-semibold dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-lime-500" />
            Authentication Details
          </h3>

          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Provider
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {identities?.[0]?.provider || "Email"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                User ID
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white break-all">
                {user.id}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Technical Details Section */}
      <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-2xl font-semibold dark:text-white">
          Technical Details
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Full Profile Data
            </h4>
            <pre className="text-sm font-mono p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 overflow-auto max-h-96 text-gray-900 dark:text-white">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
