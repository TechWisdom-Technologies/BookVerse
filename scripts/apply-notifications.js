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



console.log('Done');
