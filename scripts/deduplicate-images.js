const fs = require('fs');
const path = require('path');
const { generateImagesForArticle, ensureOutputDir } = require('./generate-images');

// 确保临时目录存在
const ensureTmpDir = () => {
  const tmpDir = path.join(__dirname, '..', '.tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  return tmpDir;
};

// 扫描所有文章，找出重复图片
async function deduplicateImages() {
  console.log('🚀 开始图片去重任务...');
  
  const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');
  const imageUrlMap = new Map(); // URL => array of { articleId, position, fileName }
  const affectedArticles = new Set();
  let totalDuplicatesFound = 0;
  let totalImagesRegenerated = 0;
  const logLines = [];

  // 第一步：扫描所有文章
  if (!fs.existsSync(blogPostsDir)) {
    console.log('⚠️ 未找到 blog-posts 目录');
    return;
  }

  const files = fs.readdirSync(blogPostsDir).filter(f => f.endsWith('.json'));
  console.log(`📝 扫描 ${files.length} 篇文章...`);

  files.forEach((fileName) => {
    const filePath = path.join(blogPostsDir, fileName);
    let article;
    try {
      article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`   ❌ 无法解析 ${fileName}`);
      return;
    }

    if (!article.images || !Array.isArray(article.images)) return;

    article.images.forEach((img) => {
      if (!img.url) return;
      if (!imageUrlMap.has(img.url)) {
        imageUrlMap.set(img.url, []);
      }
      imageUrlMap.get(img.url).push({
        articleId: article.id,
        articleTitle: article.title,
        articleFile: fileName,
        position: img.position || 'unknown',
        image: img
      });
    });
  });

  console.log(`🔍 找到 ${imageUrlMap.size} 个独立图片 URL`);

  // 第二步：找出重复
  const duplicateGroups = [];
  for (const [url, occurrences] of imageUrlMap) {
    if (occurrences.length > 1) {
      duplicateGroups.push({ url, occurrences });
      totalDuplicatesFound += occurrences.length - 1;
    }
  }

  console.log(`⚠️  找到 ${duplicateGroups.length} 组重复图片，共 ${totalDuplicatesFound} 个重复项`);

  if (duplicateGroups.length === 0) {
    logLines.push('# 图片去重报告');
    logLines.push('');
    logLines.push('✅ 无重复图片！');
    const tmpDir = ensureTmpDir();
    fs.writeFileSync(path.join(tmpDir, 'image-dedup-log.md'), logLines.join('\n'), 'utf8');
    console.log('✅ 无重复图片！去重完成。');
    return { totalDuplicatesFound: 0, affectedArticles: 0, regenerated: 0 };
  }

  // 第三步：处理重复图片（保留第一个，重生成其他）
  for (const group of duplicateGroups) {
    logLines.push(`## 重复图片: ${group.url}`);
    logLines.push(`- 出现 ${group.occurrences.length} 次`);
    
    const firstOccurrence = group.occurrences[0];
    const restOccurrences = group.occurrences.slice(1);

    logLines.push(`- 保留: 文章 ID ${firstOccurrence.articleId} (${firstOccurrence.articleTitle})`);
    
    for (const occurrence of restOccurrences) {
      logLines.push(`- 重生成: 文章 ID ${occurrence.articleId} (${occurrence.articleTitle}) - ${occurrence.position}`);
      
      // 重新生成该文章的图片
      const articlePath = path.join(blogPostsDir, occurrence.articleFile);
      let article = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
      
      // 重新生成图片
      article = await generateImagesForArticle(article);
      
      // 更新文章文件
      fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
      totalImagesRegenerated++;
      affectedArticles.add(article.id);
      logLines.push(`  ✅ 文章 ${article.id} 图片已更新`);
    }
    
    logLines.push('');
  }

  // 写入日志
  const tmpDir = ensureTmpDir();
  const logPath = path.join(tmpDir, 'image-dedup-log.md');
  logLines.unshift('# 图片去重报告');
  logLines.unshift(`- 时间: ${new Date().toISOString()}`);
  logLines.unshift(`- 重复图片组: ${duplicateGroups.length}`);
  logLines.unshift(`- 重复图片总数: ${totalDuplicatesFound}`);
  logLines.unshift(`- 重新生成图片数: ${totalImagesRegenerated}`);
  logLines.unshift(`- 受影响文章数: ${affectedArticles.size}`);
  fs.writeFileSync(logPath, logLines.join('\n'), 'utf8');

  console.log('\n✅ 图片去重完成！');
  console.log(`📊 重复图片数: ${totalDuplicatesFound}`);
  console.log(`📊 重生成图片数: ${totalImagesRegenerated}`);
  console.log(`📊 受影响文章数: ${affectedArticles.size}`);
  console.log(`📄 日志已保存至: ${logPath}`);

  return {
    totalDuplicatesFound,
    affectedArticles: affectedArticles.size,
    regenerated: totalImagesRegenerated
  };
}

// 为单篇文章做即时校验
async function checkArticleForDuplicates(article, articlePath) {
  // 内部简单逻辑，确保该文章内部无重复
  const urls = new Set();
  let hasDuplicates = false;
  if (article.images) {
    for (const img of article.images) {
      if (urls.has(img.url)) {
        hasDuplicates = true;
        break;
      }
      urls.add(img.url);
    }
  }
  return hasDuplicates;
}

// 导出模块
module.exports = {
  deduplicateImages,
  checkArticleForDuplicates
};

if (require.main === module) {
  deduplicateImages().catch(console.error);
}
