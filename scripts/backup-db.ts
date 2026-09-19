import { PrismaClient, Prisma } from "../src/generated/client";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

// Helper to escape SQL strings
const escapeSql = (val: any): string => {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
};

async function main() {
  console.log("Starting full database extraction...");

  // Generate folder name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
  // Create root backups directory if it doesn't exist
  const backupRoot = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupRoot)) fs.mkdirSync(backupRoot);

  // Create the timestamped specific folder
  const currentBackupDir = path.join(backupRoot, timestamp);
  fs.mkdirSync(currentBackupDir);

  const jsonFilename = path.join(currentBackupDir, `database.json`);
  const sqlFilename = path.join(currentBackupDir, `database.sql`);
  const dumpFilename = path.join(currentBackupDir, `database.dump`);

  const backupData: Record<string, any[]> = {};
  let sqlContent = `-- Database Backup Generated at ${new Date().toISOString()}\n\n`;
  
  const models = Prisma.dmmf.datamodel.models;
  console.log(`Found ${models.length} tables to backup. Saving to folder: /backups/${timestamp}`);

  for (const model of models) {
    const modelName = model.name;
    const prismaProp = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    
    console.log(`Backing up table: ${modelName}...`);
    
    try {
      // @ts-ignore
      const rows = await prisma[prismaProp].findMany();
      backupData[modelName] = rows;
      
      // Generate SQL INSERT statements
      if (rows.length > 0) {
        sqlContent += `-- Table: ${modelName}\n`;
        const columns = Object.keys(rows[0]);
        const colsSql = columns.map(c => `"${c}"`).join(", ");
        
        for (const row of rows) {
          const valuesSql = columns.map(c => escapeSql(row[c])).join(", ");
          sqlContent += `INSERT INTO "${modelName}" (${colsSql}) VALUES (${valuesSql});\n`;
        }
        sqlContent += `\n`;
      }
      
      console.log(`  -> Saved ${rows.length} records.`);
    } catch (err) {
      console.error(`  -> Failed to backup ${modelName}:`, err);
    }
  }

  // Write JSON file
  console.log(`\nWriting JSON file...`);
  const jsonString = JSON.stringify(backupData, null, 2);
  fs.writeFileSync(jsonFilename, jsonString, "utf8");
  
  // Write SQL file
  console.log(`Writing SQL file...`);
  fs.writeFileSync(sqlFilename, sqlContent, "utf8");

  // Write DUMP file (we will create a raw compressed binary dump of the JSON for storage efficiency)
  console.log(`Writing DUMP file...`);
  import("adm-zip").then(AdmZip => {
    const zip = new AdmZip.default();
    zip.addFile("database.json", Buffer.from(jsonString, "utf8"));
    zip.addFile("database.sql", Buffer.from(sqlContent, "utf8"));
    zip.writeZip(dumpFilename);
    
    const sizeMB = (fs.statSync(dumpFilename).size / (1024 * 1024)).toFixed(2);
    console.log(`\nBackup completed successfully!`);
    console.log(`Files stored in: /backups/${timestamp}`);
    console.log(`- database.json`);
    console.log(`- database.sql`);
    console.log(`- database.dump (${sizeMB} MB)`);
    process.exit(0);
  }).catch(err => {
    console.error("Failed to create dump zip:", err);
    process.exit(1);
  });
}

main().catch((e) => {
  console.error("Backup failed!", e);
  process.exit(1);
});
