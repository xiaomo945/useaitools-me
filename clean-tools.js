
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取文件
const rawData = fs.readFileSync(path.join(__dirname, 'data/tools.json'), 'utf8');
const tools = JSON.parse(rawData);

// 任务1: 需要删除的分类
const categoriesToDelete = [
  'Government',
  'Law',
  'Agriculture',
  'Logistics',
  'Transportation',
  'Energy',
  'Environment',
  'Manufacturing',
  'Retail',
  'Travel'
];

// 任务2: 保留的中国工具白名单
const keepChineseTools = [
  'DeepSeek',
  '通义千问',
  'Kimi',
  '智谱清言',
  '文心一言'
];

// 过滤工具
const filteredTools = tools.filter(tool => {
  // 如果需要VPN，保留所有（这是国际工具）
  if (tool.needs_vpn) {
    return true;
  }
  
  // 不需要VPN的工具
  
  // 如果在要删除的分类中，删除
  if (categoriesToDelete.includes(tool.category)) {
    return false;
  }
  
  // 只保留白名单中的中国工具
  if (keepChineseTools.includes(tool.name)) {
    return true;
  }
  
  // 删除其他中国本土工具
  return false;
});

console.log(`原始工具数量: ${tools.length}`);
console.log(`过滤后工具数量: ${filteredTools.length}`);

// 写回文件
fs.writeFileSync(path.join(__dirname, 'data/tools.json'), JSON.stringify(filteredTools, null, 2));
console.log('文件已更新');
