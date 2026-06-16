import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsPath = path.join(__dirname, '../data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// 修复所有工具的 affiliate_link
const fixedTools = tools.map(tool => {
  let affiliateLink = tool.affiliate_link;
  // 如果是模板字符串 {{AFFILIATE_*}}，就改成空字符串
  if (affiliateLink && affiliateLink.startsWith('{{') && affiliateLink.endsWith('}}')) {
    affiliateLink = '';
  }
  return {
    ...tool,
    affiliate_link: affiliateLink
  };
});

fs.writeFileSync(toolsPath, JSON.stringify(fixedTools, null, 2));

console.log(`✅ 修复了工具数据！共 ${fixedTools.length} 个工具。`);
