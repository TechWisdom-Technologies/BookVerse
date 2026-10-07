import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import StorageAdminClient from "./StorageAdminClient";
import { 
  getCachedDatabaseSize, 
  getCachedR2Size, 
  getCachedRedisSize, 
  getCachedCloudinarySize 
} from "@/app/api/admin/storage/route";

export default async function StorageAdminPage() {
  const { dbUser } = await verifyToken().catch(() => ({ dbUser: null }));

  if (!dbUser || dbUser.role !== Role.ADMIN) {
    redirect("/");
  }

  const [databaseSizeBytes, r2SizeBytes, redisSizeBytes, cloudinarySizeBytes] = await Promise.all([
    getCachedDatabaseSize(),
    getCachedR2Size(),
    getCachedRedisSize(),
    getCachedCloudinarySize(),
  ]);

  const initialStats = {
    databaseSizeBytes,
    r2SizeBytes,
    redisSizeBytes,
    cloudinarySizeBytes,
  };

  return <StorageAdminClient initialStats={initialStats} />;
}
