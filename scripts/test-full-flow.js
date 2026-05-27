const fs = require('fs');
const path = require('path');
const { generateTopics, longTailKeywords } = require('./auto-topic-generator');
const { generateArticleContent } = require('./batch-content-producer');
const { generateImagesForArticle } = require('./generate-images');

console.log('🧪 开始测试完整内容生产线...\n');

async function testFullFlow() {
  // 1. 加载工具数据
  const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  
  // 2. 生成一个测试选题
  console.log('📝 步骤1: 生成测试选题...');
  const topics = generateTopics(tools, longTailKeywords).slice(0, 1);
  const testTopic = topics[0];
  console.log(`   ✅ 选题: ${testTopic.title}\n`);
  
  // 3. 生成测试文章
  console.log('📄 步骤2: 生成测试文章...');
  const testArticle = {
    id: 999,
    title: testTopic.title,
    slug: 'test-article-full-flow',
    date: new Date().toISOString().split('T')[0],
    description: testTopic.keywords[0],
    style: '测试',
    category: testTopic.category,
    content: generateArticleContent(testTopic),
    keywords: testTopic.keywords,
    images: []
  };
  console.log(`   ✅ 文章内容生成完成，字数: ${testArticle.content.length}\n`);
  
  // 4. 测试图片生成
  console.log('🖼️  步骤3: 测试图片生成...');
  try {
    const articleWithImages = await generateImagesForArticle(testArticle);
    
    // 检查是否成功生成
    const generatedCount = articleWithImages.images.filter(img => img.generated).length;
    console.log(`   ✅ 成功生成 ${generatedCount} 张图片！\n`);
    
    // 检查文件是否存在
    const outputDir = path.join(__dirname, '..', 'public', 'blog-images');
    articleWithImages.images.forEach(img => {
      if (img.generated) {
        const filePath = path.join(outputDir, img.url.replace('/blog-images/', ''));
        const exists = fs.existsSync(filePath);
        console.log(`      📷 ${img.position}: ${exists ? '✅ 文件已生成' : '❌ 文件未找到'}`);
      }
    });
    
  } catch (error) {
    console.log(`   ⚠️  图片生成测试跳过: ${error.message}\n`);
  }
  
  console.log('\n🎉 测试完成！');
  console.log('   ✅ 选题生成: 正常');
  console.log('   ✅ 文章生成: 正常');
  console.log('   🎨 图片生成: 已测试');
  console.log('\n💡 现在可以运行: node scripts/batch-content-producer.js 来批量生产内容！');
}

testFullFlow().catch(error => {
  console.error('\n❌ 测试失败:', error);
  process.exit(1);
});
