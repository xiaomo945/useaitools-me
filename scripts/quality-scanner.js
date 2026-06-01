const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');
const tmpDir = path.join(__dirname, '..', '.tmp');

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const colorReport = [];
const fontReport = [];
const roundedReport = [];
const darkModeReport = [];
const touchAreaReport = [];
const truncationReport = [];

function scanFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...scanFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const tsxFiles = scanFiles(appDir);

console.log(`📁 Found ${tsxFiles.length} TSX files`);

const standardColors = ['emerald-', 'slate-', 'gray-', 'white', 'black'];
const nonStandardColors = ['blue-', 'purple-', 'red-', 'green-', 'pink-', 'orange-', 'indigo-', 'teal-', 'cyan-'];

tsxFiles.forEach(file => {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  const content = fs.readFileSync(file, 'utf-8');
  
  // Color consistency check
  nonStandardColors.forEach(color => {
    if (content.includes(`text-${color}600`) || content.includes(`bg-${color}600`)) {
      colorReport.push(`${relativePath}: uses non-standard color ${color}600`);
    }
  });
  
  // Font consistency check
  if (content.includes('font-serif') && !content.includes('Playfair') && !content.includes('title')) {
    fontReport.push(`${relativePath}: font-serif used (should be Playfair Display for titles)`);
  }
  if (content.includes('font-mono') && !content.includes('JetBrains')) {
    fontReport.push(`${relativePath}: font-mono used (should be JetBrains Mono for code)`);
  }
  
  // Rounded consistency check
  const roundedPatterns = [
    { pattern: 'rounded-xl', expected: 'rounded-2xl', type: 'card' },
    { pattern: 'rounded-md', expected: 'rounded-lg', type: 'button' }
  ];
  roundedPatterns.forEach(p => {
    if (content.includes(p.pattern) && !content.includes('badge') && !content.includes('tag')) {
      roundedReport.push(`${relativePath}: ${p.pattern} used (should be ${p.expected} for ${p.type})`);
    }
  });
  
  // Dark mode check
  const lightPatterns = ['bg-white', 'bg-slate-50', 'text-slate-900', 'border-slate-200', 'border-slate-300'];
  lightPatterns.forEach(pattern => {
    if (content.includes(pattern)) {
      const darkEquiv = pattern.includes('white') ? 'dark:bg-gray-900' : 
                        pattern.includes('slate-50') ? 'dark:bg-gray-950' : 
                        pattern.includes('text-slate-900') ? 'dark:text-slate-100' :
                        pattern.includes('border-slate-200') ? 'dark:border-gray-800' :
                        pattern.includes('border-slate-300') ? 'dark:border-gray-700' : null;
      if (darkEquiv && !content.includes(darkEquiv.replace('dark:', ''))) {
        darkModeReport.push(`${relativePath}: missing dark mode equivalent for ${pattern} (should be ${darkEquiv})`);
      }
    }
  });
  
  // Touch area check
  if (content.includes('button') || content.includes('onClick')) {
    if (!content.includes('min-h-[44px]') && !content.includes('h-11') && !content.includes('h-12')) {
      if (content.includes('icon') || content.includes('text-2xl')) {
        touchAreaReport.push(`${relativePath}: interactive element may need min-h-[44px]`);
      }
    }
  }
  
  // Truncation check
  if (content.includes('overflow-hidden') && !content.includes('text-overflow')) {
    truncationReport.push(`${relativePath}: overflow-hidden without text-overflow: ellipsis`);
  }
});

// Write reports
fs.writeFileSync(path.join(tmpDir, 'color-inconsistency-report.md'), [
  '# Color Inconsistency Report',
  '',
  `Total files: ${tsxFiles.length}`,
  `Issues found: ${colorReport.length}`,
  '',
  '## Issues:',
  ...colorReport.map(l => '- ' + l)
].join('\n'), 'utf-8');

fs.writeFileSync(path.join(tmpDir, 'font-consistency-report.md'), [
  '# Font Consistency Report',
  '',
  `Total files: ${tsxFiles.length}`,
  `Issues found: ${fontReport.length}`,
  '',
  '## Issues:',
  ...fontReport.map(l => '- ' + l)
].join('\n'), 'utf-8');

fs.writeFileSync(path.join(tmpDir, 'rounded-consistency-report.md'), [
  '# Rounded Consistency Report',
  '',
  `Total files: ${tsxFiles.length}`,
  `Issues found: ${roundedReport.length}`,
  '',
  '## Issues:',
  ...roundedReport.map(l => '- ' + l)
].join('\n'), 'utf-8');

fs.writeFileSync(path.join(tmpDir, 'dark-mode-report.md'), [
  '# Dark Mode Report',
  '',
  `Total files: ${tsxFiles.length}`,
  `Issues found: ${darkModeReport.length}`,
  '',
  '## Issues:',
  ...darkModeReport.map(l => '- ' + l)
].join('\n'), 'utf-8');

console.log('✅ Reports written to .tmp/ directory');
console.log(`   Color: ${colorReport.length}, Font: ${fontReport.length}, Rounded: ${roundedReport.length}`);
console.log(`   Dark Mode: ${darkModeReport.length}, Touch Area: ${touchAreaReport.length}`);
