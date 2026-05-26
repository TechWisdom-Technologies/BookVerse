const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding mock DMCA notices...");
  
  // Clean up any existing notices first
  await prisma.dMCANotice.deleteMany({});
  
  await prisma.dMCANotice.createMany({
    data: [
      {
        storyId: 'cmpjwj6ht0001ju04d43i230l',
        originalWorkTitle: 'Shadows in the Dark',
        originalWorkAuthor: 'Alistair Crow',
        copyrightHolder: 'Crow Publishing House',
        description: 'The story "রক্তের দাগ" copies paragraphs verbatim from chapter 3 of Alistair Crow\'s novel "Shadows in the Dark".',
        submittedBy: 'cmoyel03y00075834mi3gvxe4',
        status: 'SUBMITTED'
      },
      {
        storyId: 'cmpjwqfm30001kv0401sxp2nu',
        originalWorkTitle: 'Mind Over Matter',
        originalWorkAuthor: 'Sarah Jenkins',
        copyrightHolder: 'Sarah Jenkins',
        description: 'The protagonist and sequence of events in "মনের কারাগার" directly mirrors my copyrighted book "Mind Over Matter" published in 2021.',
        submittedBy: 'cmoyel03y00075834mi3gvxe4',
        status: 'ACKNOWLEDGED'
      }
    ]
  });
  
  console.log("Mock DMCA notices seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding DMCA notices:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
