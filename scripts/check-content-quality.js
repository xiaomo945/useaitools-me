import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_POSTS_DIR = path.join(__dirname, '..', 'data', 'blog-posts');
const OUTPUT_DIR = path.join(__dirname, '..', '.tmp');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'content-quality-spot-check.md');
const SAMPLE_SIZE = 20;
const VALID_CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
const MIN_CONTENT_LENGTH = 200;

function main() {
  // Ensure .tmp directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read all JSON files from blog-posts directory
  const files = fs.readdirSync(BLOG_POSTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(BLOG_POSTS_DIR, f));

  if (files.length === 0) {
    console.error('No JSON files found in', BLOG_POSTS_DIR);
    process.exit(1);
  }

  console.log(`Found ${files.length} blog post files. Randomly selecting ${SAMPLE_SIZE}...`);

  // Randomly select 20 posts (Fisher-Yates shuffle)
  const shuffled = [...files];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, Math.min(SAMPLE_SIZE, shuffled.length));

  // Analyze each post
  const results = [];
  for (const filePath of selected) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const post = JSON.parse(raw);
      const issues = [];

      // Check content field
      const contentLength = typeof post.content === 'string' ? post.content.length : 0;
      if (!post.content || contentLength < MIN_CONTENT_LENGTH) {
        issues.push(`Content is empty or too short (${contentLength} chars, minimum ${MIN_CONTENT_LENGTH})`);
      }

      // Check images field
      const hasImages = Array.isArray(post.images);
      if (!post.images) {
        issues.push('Missing "images" field');
      } else if (!hasImages) {
        issues.push('"images" field is not an array');
      } else if (post.images.length === 0) {
        issues.push('"images" array is empty');
      }

      // Check category field
      const categoryDisplay = post.category || '(missing)';
      if (!post.category) {
        issues.push('Missing "category" field');
      } else if (!VALID_CATEGORIES.includes(post.category)) {
        issues.push(`Invalid category "${post.category}" (valid: ${VALID_CATEGORIES.join(', ')})`);
      }

      // Check author field
      if (!post.author) {
        issues.push('Missing "author" field');
      }

      // Check slug field
      if (!post.slug) {
        issues.push('Missing "slug" field');
      }

      results.push({
        id: post.id ?? path.basename(filePath, '.json'),
        title: post.title ?? '(untitled)',
        contentLength,
        hasImages: hasImages ? (post.images.length > 0 ? 'Yes' : 'Empty') : (post.images ? 'Not array' : 'No'),
        category: categoryDisplay,
        author: post.author || '(missing)',
        slug: post.slug || '(missing)',
        issues,
      });
    } catch (err) {
      results.push({
        id: path.basename(filePath, '.json'),
        title: '(parse error)',
        contentLength: 0,
        hasImages: 'Error',
        category: 'Error',
        author: 'Error',
        slug: 'Error',
        issues: [`Failed to parse JSON: ${err.message}`],
      });
    }
  }

  // Generate report
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const postsWithIssues = results.filter(r => r.issues.length > 0);
  const issueBreakdown = {};
  for (const r of results) {
    for (const issue of r.issues) {
      const key = issue.split('(')[0].trim();
      issueBreakdown[key] = (issueBreakdown[key] || 0) + 1;
    }
  }

  let report = '';
  report += '# Content Quality Spot Check Report\n\n';
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Total blog posts on disk**: ${files.length}\n`;
  report += `**Posts sampled**: ${results.length}\n`;
  report += `**Posts with issues**: ${postsWithIssues.length} / ${results.length}\n`;
  report += `**Total issues found**: ${totalIssues}\n\n`;

  report += '---\n\n';
  report += '## Summary of Issues\n\n';

  if (totalIssues === 0) {
    report += 'No issues found in the sampled posts.\n\n';
  } else {
    report += '| Issue Type | Count |\n';
    report += '|---|---|\n';
    for (const [key, count] of Object.entries(issueBreakdown).sort((a, b) => b[1] - a[1])) {
      report += `| ${key} | ${count} |\n`;
    }
    report += '\n';
  }

  report += '---\n\n';
  report += '## Per-Post Quality Table\n\n';
  report += '| ID | Title | Content Length | Has Images | Category | Author | Issues |\n';
  report += '|---|---|---|---|---|---|---|\n';
  for (const r of results) {
    const titleTruncated = r.title.length > 50 ? r.title.slice(0, 47) + '...' : r.title;
    const issuesCell = r.issues.length > 0 ? r.issues.length + ' issue(s)' : 'None';
    report += `| ${r.id} | ${titleTruncated} | ${r.contentLength} | ${r.hasImages} | ${r.category} | ${r.author} | ${issuesCell} |\n`;
  }
  report += '\n';

  report += '---\n\n';
  report += '## Specific Issues & Recommendations\n\n';

  if (postsWithIssues.length === 0) {
    report += 'All sampled posts passed quality checks.\n';
  } else {
    for (const r of postsWithIssues) {
      report += `### Post ${r.id}: ${r.title}\n\n`;
      for (const issue of r.issues) {
        report += `- **${issue}**\n`;
      }
      report += '\n**Recommendations:**\n';
      for (const issue of r.issues) {
        if (issue.includes('Content is empty or too short')) {
          report += '- Expand the content to at least 200 characters. Consider adding an introduction, detailed sections, and a conclusion.\n';
        } else if (issue.includes('Missing "images"')) {
          report += '- Add an `images` array with at least one header image. Each image should have `url`, `alt`, and `caption` fields.\n';
        } else if (issue.includes('"images" field is not an array')) {
          report += '- Convert the `images` field to an array format. Each image should be an object with `url`, `alt`, and `caption`.\n';
        } else if (issue.includes('"images" array is empty')) {
          report += '- Add at least one image to the `images` array. A header image improves visual appeal and SEO.\n';
        } else if (issue.includes('Missing "category"')) {
          report += '- Add a `category` field. Must be one of: ' + VALID_CATEGORIES.join(', ') + '.\n';
        } else if (issue.includes('Invalid category')) {
          report += `- Change the category to one of the valid values: ${VALID_CATEGORIES.join(', ')}.\n`;
        } else if (issue.includes('Missing "author"')) {
          report += '- Add an `author` field to attribute the post to a writer.\n';
        } else if (issue.includes('Missing "slug"')) {
          report += '- Add a `slug` field for URL-friendly identification (e.g., "best-ai-writing-tools-2026").\n';
        } else if (issue.includes('Failed to parse JSON')) {
          report += '- Fix the JSON syntax error in this file. Check for missing commas, brackets, or invalid escape sequences.\n';
        } else {
          report += '- Review and fix this issue.\n';
        }
      }
      report += '\n';
    }
  }

  fs.writeFileSync(OUTPUT_FILE, report, 'utf-8');
  console.log(`\nReport written to ${OUTPUT_FILE}`);
  console.log(`Summary: ${postsWithIssues.length}/${results.length} posts have issues (${totalIssues} total issues)`);
}

main();
