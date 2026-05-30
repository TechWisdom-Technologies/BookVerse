import { prisma } from "@/lib/prisma";

export function extractTextFromTipTap(json: any): string {
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

export async function syncStorySearchIndex(storyId: string) {
  try {
    const chapters = await prisma.storyChapter.findMany({
      where: { storyId },
      select: { content: true }
    });
    
    let fullText = "";
    for (const chap of chapters) {
      if (chap.content) {
        fullText += extractTextFromTipTap(chap.content) + " ";
      }
    }
    
    await prisma.story.update({
      where: { id: storyId },
      data: { searchIndex: fullText.trim().substring(0, 1000000) } // Safe limit
    });
  } catch (error) {
    console.error(`Failed to sync search index for story ${storyId}:`, error);
  }
}
