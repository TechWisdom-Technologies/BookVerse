import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

function extractTextFromTipTap(json: any): string {
  if (!json) return "";
  if (typeof json === "string") return json;
  if (json.type === "text" && json.text) return json.text;
  let text = "";
  if (Array.isArray(json.content)) {
    for (const child of json.content) {
      text += extractTextFromTipTap(child) + " ";
    }
  } else if (Array.isArray(json)) {
    for (const child of json) {
      text += extractTextFromTipTap(child) + " ";
    }
  }
  return text.trim();
}

async function main() {
  console.log("Rebuilding search indexes for all stories...");

  const stories = await prisma.story.findMany({
    select: { id: true, title: true }
  });

  console.log(`Found ${stories.length} stories to process.`);

  let processed = 0;
  for (const story of stories) {
    const chapters = await prisma.storyChapter.findMany({
      where: { storyId: story.id },
      select: { content: true }
    });

    let fullText = "";
    for (const chap of chapters) {
      if (chap.content) {
        fullText += extractTextFromTipTap(chap.content) + " ";
      }
    }

    // Limit size for search_index to prevent Postgres row size limits
    const safeText = fullText.trim().substring(0, 500000);

    await prisma.story.update({
      where: { id: story.id },
      data: { searchIndex: safeText }
    });

    processed++;
    if (processed % 10 === 0) {
      console.log(`Processed ${processed}/${stories.length} stories...`);
    }
  }

  console.log("Search index rebuild complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
