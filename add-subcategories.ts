import { matchSubcategory, getSubcategories } from './lib/subcategory-mapping';
import * as fs from 'fs';
import * as path from 'path';

// 读取工具数据
const toolsPath = path.join(__dirname, 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));

console.log('开始为工具添加子分类...\n');

// 统计信息
const stats: Record<string, Record<string, number>> = {};

// 为每个工具添加子分类
const updatedTools = tools.map((tool: any) => {
  const subcategory = matchSubcategory(tool.category, tool.description, tool.best_for);
  
  // 初始化统计
  if (!stats[tool.category]) {
    stats[tool.category] = {};
  }
  if (!stats[tool.category][subcategory]) {
    stats[tool.category][subcategory] = 0;
  }
  stats[tool.category][subcategory]++;
  
  return {
    ...tool,
    subcategory
  };
});

// 保存更新后的数据
fs.writeFileSync(toolsPath, JSON.stringify(updatedTools, null, 2), 'utf-8');

// 输出统计信息
console.log('子分类分配统计：\n');
Object.entries(stats).forEach(([category, subcats]) => {
  console.log(`\n${category} (${Object.values(subcats).reduce((a, b) => a + b, 0)} 个工具):`);
  Object.entries(subcats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subcat, count]) => {
      const percentage = ((count / Object.values(subcats).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
      console.log(`  ${subcat}: ${count} (${percentage}%)`);
    });
});

console.log('\n✅ 子分类添加完成！');
console.log(`\n总计: ${updatedTools.length} 个工具`);
console.log(`分类数: ${Object.keys(stats).length}`);
console.log(`子分类数: ${Object.values(stats).reduce((sum, subcats) => sum + Object.keys(subcats).length, 0)}`);
