const fs = require('fs');
const tools = JSON.parse(fs.readFileSync('data/tools.json', 'utf8'));

// Find all affiliate links
const affiliateTools = tools.filter(t => t.affiliate_link);

let report = '# 🔗 联盟链接有效性检查报告\n\n';
report += 'Generated: 2026-05-22\n\n';
report += '## 概览\n\n';
report += '| 指标 | 数量 |\n|:---|:---|\n';
report += '| 总工具数 | ' + tools.length + ' |\n';
report += '| 有联盟链接的工具 | ' + affiliateTools.length + ' |\n';
report += '| 无联盟链接的工具 | ' + (tools.length - affiliateTools.length) + ' |\n\n';

report += '## 联盟工具列表\n\n';
report += '| ID | 工具名称 | 分类 | 联盟链接状态 |\n|:---|:---|:---|:---|\n';
affiliateTools.forEach(t => {
  const link = t.affiliate_link;
  let status = '';
  if (link.startsWith('{{AFFILIATE_') && link.endsWith('}}')) {
    status = '⚠️ 占位符（需配置环境变量）';
  } else if (link.startsWith('http')) {
    status = '✅ 已配置';
  } else {
    status = '⚠️ 非标准链接';
  }
  report += '|' + t.id + '|' + t.name + '|' + t.category + '|' + status + '|\n';
});

report += '\n## 缺失联盟链接的分类\n\n';
const categories = {};
tools.forEach(t => {
  categories[t.category] = (categories[t.category] || 0) + 1;
});
const affiliateCats = {};
affiliateTools.forEach(t => {
  affiliateCats[t.category] = (affiliateCats[t.category] || 0) + 1;
});
Object.keys(categories).forEach(cat => {
  const total = categories[cat];
  const affiliate = affiliateCats[cat] || 0;
  report += '- **' + cat + '**: ' + affiliate + '/' + total + ' 有联盟链接\n';
});

report += '\n## 建议\n\n';
report += '1. 运行 `node scripts/check-affiliate-links.js` 定期检查环境变量配置\n';
report += '2. 为 Productivity/Code/Audio 类工具拓展联盟计划\n';
report += '3. 定期检查链接有效性（HTTP 200 检查）\n';

fs.writeFileSync('.tmp/affiliate-link-check-report.md', report);
console.log('报告已保存: .tmp/affiliate-link-check-report.md');
