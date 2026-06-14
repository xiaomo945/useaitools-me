import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始添加工具截图和演示视频...');

  const tools = await prisma.tool.findMany({
    select: { id: true, name: true, url: true, screenshotUrls: true, videoUrl: true },
  });

  console.log(`找到 ${tools.length} 个工具`);

  let updated = 0;
  let skipped = 0;

  for (const tool of tools) {
    // 如果已有截图和视频，跳过
    if (tool.screenshotUrls && tool.videoUrl) {
      skipped++;
      continue;
    }

    // 生成截图URL（使用占位符服务）
    const screenshotUrls = JSON.stringify([
      `/screenshots/${tool.id}-1.jpg`,
      `/screenshots/${tool.id}-2.jpg`,
      `/screenshots/${tool.id}-3.jpg`,
    ]);

    // 生成演示视频URL（YouTube搜索链接）
    const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(tool.name + ' tutorial')}`;

    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        screenshotUrls: tool.screenshotUrls ? undefined : screenshotUrls,
        videoUrl: tool.videoUrl ? undefined : videoUrl,
      },
    });

    updated++;
    console.log(`✅ ${tool.name} - 添加截图和视频链接`);
  }

  console.log(`\n✅ 完成！`);
  console.log(`   已更新: ${updated} 个工具`);
  console.log(`   已跳过: ${skipped} 个工具（已有截图和视频）`);
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
