
"use client";

import { useSession } from "@/lib/auth-client";
import { UserRound, Mail } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading profile...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Please log in to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] px-5 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <UserRound className="text-[#244c3a]" size={30} />
          <h1 className="font-serif text-3xl font-bold text-[#20392c]">
            My Profile
          </h1>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold text-[#20392c]">
              {session.user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="flex items-center gap-2 font-semibold text-[#20392c]">
              <Mail size={16} />
              {session.user.email}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
