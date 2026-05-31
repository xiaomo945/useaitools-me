const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../data/blog-posts');
const TOOLS_PATH = path.join(__dirname, '../data/tools.json');

const PRIORITY_SLUGS = [
  'rytr',
  'grammarly',
  'writing',
  'video-script',
  'podcast',
  'productivity',
  'free-ai-tools',
  'teachers',
  'social-media'
];

const AFFILIATE_TOOL_NAMES = [
  'Rytr',
  'Grammarly',
  'GrammarlyGO',
  'Grammarly Business',
  'VEED',
  'VEED.io',
  'Pictory',
  'Murf AI',
  'Jasper',
  'Copy.ai',
  'ElevenLabs',
  'Descript',
  'Notion AI',
  'ClickUp AI',
  'Todoist AI'
];

function stripMarkdown(text) {
  let result = text
    .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1')
    .replace(/<[^>]+>/g, '');
  let prev;
  do {
    prev = result;
    result = result.replace(/\[\[link:[^\|]*\|([^\]]*)\]\]/g, '$1');
  } while (result !== prev);
  result = result
    .replace(/\[\[link:[^\]]*\]\]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/>\s+/g, '')
    .replace(/---+/g, '')
    .replace(/\{\{AFFILIATE_[^}]*\}\}/g, '')
    .replace(/\|/g, ' ')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  return result;
}

function extractHeadingText(heading) {
  return stripMarkdown(heading.replace(/^#{1,3}\s+/, ''));
}

function isQuestionLike(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes('?') ||
    lower.startsWith('what') ||
    lower.startsWith('how') ||
    lower.startsWith('why') ||
    lower.startsWith('when') ||
    lower.startsWith('which') ||
    lower.startsWith('who') ||
    lower.startsWith('where') ||
    lower.startsWith('can') ||
    lower.startsWith('do') ||
    lower.startsWith('does') ||
    lower.startsWith('is') ||
    lower.startsWith('are') ||
    lower.startsWith('should') ||
    lower.startsWith('will')
  );
}

function convertToQuestion(headingText) {
  const text = headingText.replace(/[?.!]+$/, '').trim();
  if (isQuestionLike(text)) {
    return text.endsWith('?') ? text : text + '?';
  }
  if (text.toLowerCase().startsWith('why ')) {
    return text + '?';
  }
  if (text.includes(' vs ')) {
    return text + ': which is better?';
  }
  if (text.toLowerCase().startsWith('top ') || text.toLowerCase().startsWith('best ')) {
    return text.replace(/^(Top|Best)\s+/i, 'What are the best ') + '?';
  }
  if (text.toLowerCase().startsWith('how ')) {
    return text + '?';
  }
  return 'What is ' + text.charAt(0).toLowerCase() + text.slice(1) + '?';
}

function extractFAQs(content) {
  const lines = content.split('\n');
  const headings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);
    if (h2Match || h3Match) {
      const level = h2Match ? 2 : 3;
      const rawHeading = (h2Match || h3Match)[1];
      headings.push({ rawHeading, level, lineIndex: i });
    }
  }

  const faqs = [];

  for (const heading of headings) {
    if (faqs.length >= 5) break;

    const headingText = extractHeadingText(heading.rawHeading);

    if (
      headingText.toLowerCase().includes('final cta') ||
      headingText.toLowerCase().includes('ready to') ||
      headingText.toLowerCase().includes('start ') ||
      headingText.toLowerCase().includes('conclusion') ||
      headingText.toLowerCase().includes('summary') ||
      headingText.toLowerCase().includes('decision time') ||
      headingText.toLowerCase().includes('finding your p')
    ) {
      continue;
    }

    const answerLines = [];
    let j = heading.lineIndex + 1;
    while (j < lines.length) {
      const nextLine = lines[j].trim();
      if (nextLine.match(/^#{1,3}\s+/) || nextLine.match(/^---+$/)) break;
      if (nextLine.length > 0) {
        answerLines.push(nextLine);
      }
      j++;
      if (answerLines.length >= 6) break;
    }

    if (answerLines.length === 0) continue;

    const answerText = stripMarkdown(answerLines.join(' '));
    if (answerText.length < 20) continue;

    const question = convertToQuestion(headingText);

    faqs.push({
      question,
      answer: answerText
    });
  }

  return faqs;
}

function getSlugPriority(slug) {
  for (let i = 0; i < PRIORITY_SLUGS.length; i++) {
    if (slug.toLowerCase().includes(PRIORITY_SLUGS[i])) {
      return PRIORITY_SLUGS.length - i;
    }
  }
  return 0;
}

function mentionsAffiliateTool(content) {
  const lower = content.toLowerCase();
  for (const name of AFFILIATE_TOOL_NAMES) {
    if (lower.includes(name.toLowerCase())) {
      return true;
    }
  }
  if (/\{\{AFFILIATE_[A-Z]+\}\}/.test(content)) {
    return true;
  }
  return false;
}

function main() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
  const affiliateToolNames = new Set();

  for (const tool of tools) {
    if (tool.affiliate_link && tool.affiliate_link.trim() !== '') {
      affiliateToolNames.add(tool.name.toLowerCase());
    }
  }

  const blogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'));

  const candidates = [];

  for (const file of blogFiles) {
    const filePath = path.join(BLOG_DIR, file);
    let post;
    try {
      post = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      continue;
    }

    const category = (post.category || '').toLowerCase();
    if (category !== 'writing' && category !== 'productivity') continue;

    if (!mentionsAffiliateTool(post.content || '')) continue;

    const slug = post.slug || '';
    const priority = getSlugPriority(slug);

    candidates.push({ post, filePath, priority, slug });
  }

  candidates.sort((a, b) => b.priority - a.priority);

  const target = candidates.slice(0, 20);
  let updatedCount = 0;

  for (const { post, filePath } of target) {
    const faqs = extractFAQs(post.content || '');
    if (faqs.length < 3) continue;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    post.faq_schema = faqSchema;

    fs.writeFileSync(filePath, JSON.stringify(post, null, 2) + '\n');
    updatedCount++;
    console.log(`✅ ${post.slug} (${faqs.length} FAQs)`);
  }

  console.log(`\n📊 Total: ${updatedCount} articles updated with FAQ structured data`);
}

main();
