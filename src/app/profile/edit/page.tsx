import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export default async function EditProfilePage() {
  // Verify auth and get current user
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    redirect("/login?redirect=/profile/edit");
  }

  let user;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
  } catch {
    redirect("/login?redirect=/profile/edit");
  }

  if (!user) {
    redirect("/login?redirect=/profile/edit");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Edit Profile
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Update your profile information and avatar.
      </p>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <EditProfileForm user={user} />
      </div>
    </main>
  );
}

