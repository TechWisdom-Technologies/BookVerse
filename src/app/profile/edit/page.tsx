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
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            Edit Profile.
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">
            Update your public persona, avatar, and personal details.
          </p>
        </header>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 sm:p-12 shadow-xl shadow-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <EditProfileForm user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}

