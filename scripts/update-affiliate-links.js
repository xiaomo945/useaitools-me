const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// 需要补充联盟链接的工具
const affiliateConfig = {
  'Grammarly': {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'AI-powered writing assistant used by 30M+ daily active users worldwide. Checks for grammar, spelling, punctuation, and style — with tone suggestions and clarity improvements. Integrates seamlessly with Chrome, Word, Gmail, and 500+ other apps. The gold standard for professional writing.',
    category: 'Writing',
    pricing: 'Freemium',
    url: 'https://grammarly.com',
    affiliate_link: '{{AFFILIATE_GRAMMARLY}}'
  },
  'Rytr': '{{AFFILIATE_RYTR}}',
  'VEED.io': '{{AFFILIATE_VEED}}',
  'Notion AI': '{{AFFILIATE_NOTION}}',
  'ElevenLabs': '{{AFFILIATE_ELEVENLABS}}',
  'Murf AI': '{{AFFILIATE_MURF}}',
  'Synthesia': '{{AFFILIATE_SYNTHESIA}}',
  'Pictory': '{{AFFILIATE_PICTORY}}'
};

let updatedCount = 0;
let addedCount = 0;

// 更新现有工具的联盟链接
tools.forEach(tool => {
  if (affiliateConfig[tool.name] && typeof affiliateConfig[tool.name] === 'string') {
    if (!tool.affiliate_link || tool.affiliate_link === '') {
      tool.affiliate_link = affiliateConfig[tool.name];
      updatedCount++;
      console.log(`✅ 更新: ${tool.name} -> ${affiliateConfig[tool.name]}`);
    }
  }
});

// 检查是否需要添加 Grammarly
const hasGrammarly = tools.some(t => t.name === 'Grammarly');
if (!hasGrammarly) {
  const grammarly = affiliateConfig['Grammarly'];
  delete affiliateConfig['Grammarly']; // 移除字符串映射
  tools.push(grammarly);
  addedCount++;
  console.log(`✅ 添加: Grammarly`);
}

// 保存更新
fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2));

console.log(`\n🎉 联盟链接更新完成！`);
console.log(`   - 更新链接数: ${updatedCount}`);
console.log(`   - 新增工具数: ${addedCount}`);
console.log(`   - 工具总数: ${tools.length}`);
