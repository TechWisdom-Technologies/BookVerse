const fs = require('fs');

// 1. stories/[id]/route.ts
let storiesFile = fs.readFileSync('src/app/api/stories/[id]/route.ts', 'utf8');

const storiesTarget = `      const updated = await prisma.story.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });`;

const storiesReplacement = `      const updated = await prisma.story.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      
      // Milestone check
      const milestones = [100, 500, 1000, 5000, 10000];
      if (milestones.includes(updated.viewCount)) {
        void createNotification({
          userId: updated.authorId,
          type: 'MILESTONE',
          title: 'Story Milestone reached!',
          message: \`Congratulations! Your story "\${updated.title}" just reached \${updated.viewCount} views.\`,
          link: \`/stories/\${id}\`,
        });
      }`;
      
if (!storiesFile.includes('MILESTONE')) {
  storiesFile = storiesFile.replace(storiesTarget, storiesReplacement);
  fs.writeFileSync('src/app/api/stories/[id]/route.ts', storiesFile);
}

// 2. stripe/webhook/route.ts
let webhookFile = fs.readFileSync('src/app/api/stripe/webhook/route.ts', 'utf8');

if (!webhookFile.includes('createNotification')) {
  webhookFile = webhookFile.replace('import { prisma } from "@/lib/prisma";', 'import { prisma } from "@/lib/prisma";\nimport { createNotification } from "@/lib/notifications";');
  
  const webhookTarget = `        await prisma.tip.update({
          where: { id: tipId },
          data: { status: "COMPLETED" },
        });`;
        
  const webhookReplacement = `        const completedTip = await prisma.tip.update({
          where: { id: tipId },
          data: { status: "COMPLETED" },
          include: { sender: true }
        });
        
        if (completedTip) {
          void createNotification({
            userId: completedTip.receiverId,
            type: "TIP",
            title: "You received a Tip!",
            message: \`\${completedTip.sender?.displayName || completedTip.sender?.username || 'Someone'} sent you a tip of $\${(completedTip.amount / 100).toFixed(2)}!\`,
            link: \`/profile\`,
          });
        }`;
        
  webhookFile = webhookFile.replace(webhookTarget, webhookReplacement);
  fs.writeFileSync('src/app/api/stripe/webhook/route.ts', webhookFile);
}

console.log('Done');
