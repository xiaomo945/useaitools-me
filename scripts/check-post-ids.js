const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../data/blog-posts');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));
const ids = files.map(f => parseInt(f.replace('.json', ''))).filter(id => !isNaN(id));
const maxId = Math.max(...ids);

console.log('现有文章ID:', ids.sort((a, b) => a - b));
console.log('最大文章ID:', maxId);
console.log('文章总数:', files.length);
