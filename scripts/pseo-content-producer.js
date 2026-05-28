const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const BLOG_INDEX_PATH = path.join(__dirname, '..', 'data', 'blog-index.json');
const BLOG_POSTS_PATH = path.join(__dirname, '..', 'data', 'blog-posts.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'pseo-content');

const HUMANIZATION_PATTERNS = [
  { find: /In conclusion,/g, replace: 'Bottom line,' },
  { find: /Furthermore,/g, replace: 'Also,' },
  { find: /Moreover,/g, replace: 'Plus,' },
  { find: /Additionally,/g, replace: 'On top of that,' },
  { find: /It is worth noting that/g, replace: 'Here\'s the thing' },
  { find: /One of the most important/g, replace: 'A key' },
  { find: /is considered to be/g, replace: 'is' },
  { find: /This tool offers/g, replace: 'You get' },
  { find: /provides the ability to/g, replace: 'lets you' },
  { find: /utilizes/g, replace: 'uses' },
  { find: /demonstrates/g, replace: 'shows' },
  { find: /facilitates/g, replace: 'helps with' },
  { find: /The primary/g, replace: 'Main' },
  { find: /has the capability to/g, replace: 'can' },
  { find: /in order to/g, replace: 'to' },
  { find: /due to the fact that/g, replace: 'because' },
  { find: /at this point in time/g, replace: 'right now' },
  { find: /a significant number of/g, replace: 'many' },
  { find: /the vast majority of/g, replace: 'most' },
  { find: /It should be noted that/g, replace: 'Note that' },
];

const VARIABLE_OPENERS = [
  'Honestly, ',
  'After trying dozens of these tools, ',
  'If you ask me, ',
  'From my experience, ',
  'Here\'s what I\'ve found works best: ',
  'I\'ve been using these tools for a while, and ',
  'Looking at real-world usage, ',
  'When you get down to it, ',
  'The thing is, ',
  'In practice, ',
];

const HUMAN_PHRASES = [
  'tried and tested',
  'hands-on experience',
  'real-world usage',
  'from what I\'ve seen',
  'in my experience',
  'based on actual usage',
  'after testing extensively',
  'from daily use',
];

function loadData() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));
  const blogIndex = JSON.parse(fs.readFileSync(BLOG_INDEX_PATH, 'utf-8'));
  let blogPosts = [];
  if (fs.existsSync(BLOG_POSTS_PATH)) {
    blogPosts = JSON.parse(fs.readFileSync(BLOG_POSTS_PATH, 'utf-8'));
  }
  return { tools, blogIndex, blogPosts };
}

function saveData(data) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const filePath = path.join(OUTPUT_DIR, `${data.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Generated: ${data.slug}`);
}

function humanizeText(text) {
  let result = text;
  
  HUMANIZATION_PATTERNS.forEach(({ find, replace }) => {
    result = result.replace(find, replace);
  });
  
  const sentences = result.split(/([.!?]+)/);
  let humanized = [];
  sentences.forEach((sentence, i) => {
    if (sentence.trim() && Math.random() > 0.7) {
      const opener = VARIABLE_OPENERS[Math.floor(Math.random() * VARIABLE_OPENERS.length)];
      const phrase = HUMAN_PHRASES[Math.floor(Math.random() * HUMAN_PHRASES.length)];
      if (!sentence.includes(opener) && sentence.length > 30) {
        humanized.push(opener + sentence.toLowerCase());
      } else {
        humanized.push(sentence);
      }
    } else {
      humanized.push(sentence);
    }
  });
  
  result = humanized.join('');
  result = result.charAt(0).toUpperCase() + result.slice(1);
  
  return result;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateComparisonTable(toolA, toolB) {
  const comparisonPoints = [
    { label: 'Pricing', key: 'pricing' },
    { label: 'Rating', key: 'rating' },
    { label: 'Skill Level', key: 'skill_level' },
    { label: 'Needs VPN', key: 'needs_vpn' },
    { label: 'Languages', key: 'languages' },
  ];

  let html = '<div class="overflow-x-auto my-8">\n';
  html += '<table class="w-full border-collapse">\n';
  html += '<thead><tr class="bg-slate-100 dark:bg-slate-800">\n';
  html += '<th class="border border-slate-300 dark:border-slate-600 p-3 text-left">Feature</th>\n';
  html += `<th class="border border-slate-300 dark:border-slate-600 p-3 text-left">${toolA.name}</th>\n`;
  html += `<th class="border border-slate-300 dark:border-slate-600 p-3 text-left">${toolB.name}</th>\n`;
  html += '</tr></thead>\n<tbody>\n';

  comparisonPoints.forEach(point => {
    const aVal = toolA[point.key] || 'N/A';
    const bVal = toolB[point.key] || 'N/A';
    const aDisplay = Array.isArray(aVal) ? aVal.join(', ') : aVal;
    const bDisplay = Array.isArray(bVal) ? bVal.join(', ') : bVal;
    
    html += '<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">\n';
    html += `<td class="border border-slate-300 dark:border-slate-600 p-3 font-medium">${point.label}</td>\n`;
    html += `<td class="border border-slate-300 dark:border-slate-600 p-3">${aDisplay}</td>\n`;
    html += `<td class="border border-slate-300 dark:border-slate-600 p-3">${bDisplay}</td>\n`;
    html += '</tr>\n';
  });

  html += '</tbody></table></div>\n';
  return html;
}

function generateFAQBlock(questions) {
  let html = '<div class="my-8">\n';
  html += '<h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>\n';
  
  questions.forEach((q, i) => {
    html += `<details class="mb-4 border border-slate-300 dark:border-slate-600 rounded-lg">\n`;
    html += `<summary class="p-4 cursor-pointer font-medium hover:bg-slate-50 dark:hover:bg-slate-800">${i + 1}. ${q.question}</summary>\n`;
    html += `<div class="p-4 pt-0 text-slate-600 dark:text-slate-300">${q.answer}</div>\n`;
    html += '</details>\n';
  });
  
  html += '</div>\n';
  return html;
}

function generateInternalLinks(tools, currentTool) {
  const relatedTools = tools
    .filter(t => t.id !== currentTool.id && t.category === currentTool.category)
    .slice(0, 3);
  
  if (relatedTools.length === 0) return '';
  
  let html = '<div class="my-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">\n';
  html += '<h3 class="font-semibold mb-2">Related Tools</h3>\n';
  html += '<ul class="space-y-1">\n';
  
  relatedTools.forEach(tool => {
    html += `<li><a href="/tools/${slugify(tool.name)}" class="text-emerald-600 hover:underline">${tool.name}</a></li>\n`;
  });
  
  html += '</ul></div>\n';
  return html;
}

function generateAffiliateCTA(tool) {
  const affiliateText = tool.affiliate_link ? 'Try Now' : 'Learn More';
  const affiliateLink = tool.affiliate_link || tool.url;
  
  return `
<div class="my-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white">
  <h3 class="text-xl font-bold mb-2">Ready to try ${tool.name}?</h3>
  <p class="mb-4 opacity-90">Start using ${tool.name} today and experience the benefits yourself.</p>
  <a href="${affiliateLink}" class="inline-block bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
    ${affiliateText} →
  </a>
</div>`;
}

function generateVSContent(toolA, toolB) {
  const slug = `${slugify(toolA.name)}-vs-${slugify(toolB.name)}`;
  const title = `${toolA.name} vs ${toolB.name}: Which AI Tool is Better in 2026?`;
  const description = `Comprehensive comparison of ${toolA.name} and ${toolB.name}. Find out which AI tool offers better features, pricing, and value for your needs in 2026.`;
  
  const intro = `So you're trying to figure out whether ${toolA.name} or ${toolB.name} is the better choice? I've spent a lot of time with both tools, and here's my honest take.`;
  
  let content = `<p>${intro}</p>\n\n`;
  
  content += `<h2>Quick Overview</h2>\n`;
  content += `<p>${toolA.name} is a ${toolA.category.toLowerCase()} tool that ${humanizeText(toolA.description.slice(0, 200))}. `;
  content += `${toolB.name}, on the other hand, ${humanizeText(toolB.description.slice(0, 200))}.</p>\n\n`;
  
  content += `<h2>Feature Comparison</h2>\n`;
  content += generateComparisonTable(toolA, toolB);
  
  content += `<h2>${toolA.name}: Pros and Cons</h2>\n`;
  content += `<h3>Pros</h3>\n<ul>`;
  if (toolA.rating_breakdown) {
    Object.entries(toolA.rating_breakdown).forEach(([key, data]) => {
      if (data.score >= 4) {
        content += `<li>${key.replace('_', ' ')}: ${data.note}</li>\n`;
      }
    });
  }
  content += `</ul>\n`;
  content += `<h3>Cons</h3>\n<ul>`;
  if (toolA.rating_breakdown) {
    Object.entries(toolA.rating_breakdown).forEach(([key, data]) => {
      if (data.score < 4) {
        content += `<li>${key.replace('_', ' ')}: ${data.note}</li>\n`;
      }
    });
  }
  content += `</ul>\n`;
  
  content += `<h2>${toolB.name}: Pros and Cons</h2>\n`;
  content += `<h3>Pros</h3>\n<ul>`;
  if (toolB.rating_breakdown) {
    Object.entries(toolB.rating_breakdown).forEach(([key, data]) => {
      if (data.score >= 4) {
        content += `<li>${key.replace('_', ' ')}: ${data.note}</li>\n`;
      }
    });
  }
  content += `</ul>\n`;
  content += `<h3>Cons</h3>\n<ul>`;
  if (toolB.rating_breakdown) {
    Object.entries(toolB.rating_breakdown).forEach(([key, data]) => {
      if (data.score < 4) {
        content += `<li>${key.replace('_', ' ')}: ${data.note}</li>\n`;
      }
    });
  }
  content += `</ul>\n`;
  
  content += `<h2>Which Should You Choose?</h2>\n`;
  content += `<p>Here's the thing: both tools are solid choices. `;
  
  if (toolA.rating > toolB.rating) {
    content += `If you prioritize raw rating scores, ${toolA.name} has a slight edge with ${toolA.rating}/5 compared to ${toolB.name}'s ${toolB.rating}/5. `;
  } else {
    content += `If ratings matter most, ${toolB.name} edges out with ${toolB.rating}/5 versus ${toolA.name}'s ${toolA.rating}/5. `;
  }
  
  content += `But in practice, the best choice depends on your specific needs and workflow.</p>\n\n`;
  
  content += generateInternalLinks(loadData().tools, toolA);
  content += generateAffiliateCTA(toolA);
  content += generateAffiliateCTA(toolB);
  
  content += generateFAQBlock([
    {
      question: `Is ${toolA.name} better for beginners?`,
      answer: `Based on the skill level indicator, ${toolA.name} is suitable for ${toolA.skill_level || 'intermediate'} users. If you're just starting out, you might want to try the free tier first.`
    },
    {
      question: `Which tool has better pricing?`,
      answer: `Both tools offer freemium models. ${toolA.name} is ${toolA.pricing} and ${toolB.name} is ${toolB.pricing}. The best way to find value is to test both with your actual use case.`
    },
    {
      question: `Do I need a VPN for either tool?`,
      answer: `${toolA.name} ${toolA.needs_vpn ? 'requires a VPN' : 'works globally without a VPN'}, while ${toolB.name} ${toolB.needs_vpn ? 'requires a VPN' : 'is accessible worldwide'}.`
    }
  ]);
  
  return {
    title,
    slug,
    description,
    content,
    category: toolA.category,
    type: 'vs'
  };
}

function generateBestForContent(tool, useCase) {
  const slug = `best-${slugify(tool.name)}-for-${slugify(useCase)}`;
  const title = `Best ${tool.name} Alternatives for ${useCase} in 2026`;
  const description = `Discover the best ${tool.name} alternatives for ${useCase}. Compare features, pricing, and user reviews to find the perfect tool for your needs.`;
  
  const { tools } = loadData();
  const sameCategory = tools.filter(t => t.id !== tool.id && t.category === tool.category);
  const alternatives = sameCategory.slice(0, 5);
  
  let content = `<p>Looking for ${tool.name} alternatives for ${useCase}? I've tested dozens of tools in this space, and here are my top picks that might suit your needs even better.</p>\n\n`;
  
  content += `<h2>Why Consider Alternatives to ${tool.name}?</h2>\n`;
  content += `<p>${humanizeText(tool.description.slice(0, 300))}</p>\n`;
  content += `<p>That said, depending on your specific needs for ${useCase}, you might find a better fit elsewhere. Here's what I've found works best for different scenarios.</p>\n\n`;
  
  content += `<h2>Top Alternatives for ${useCase}</h2>\n`;
  
  alternatives.forEach((alt, i) => {
    content += `<h3>${i + 1}. ${alt.name}</h3>\n`;
    content += `<p>${humanizeText(alt.description.slice(0, 200))}</p>\n`;
    content += `<p><strong>Best for:</strong> ${alt.best_for ? alt.best_for.join(', ') : useCase}</p>\n`;
    content += `<p><strong>Pricing:</strong> ${alt.pricing}</p>\n`;
    content += generateAffiliateCTA(alt);
  });
  
  content += `<h2>How to Choose the Right Tool</h2>\n`;
  content += `<p>Here's my practical advice after hands-on experience with all these tools: start with your must-have features, try the free tiers, and pay attention to what actually fits into your daily workflow. The "best" tool is the one you'll actually use consistently.</p>\n\n`;
  
  content += generateFAQBlock([
    {
      question: `What makes a good ${useCase} tool?`,
      answer: `Based on real-world usage, look for: ease of use, output quality, pricing value, and how well it integrates with your existing workflow. Don't just chase features—think about what you'll actually use.`
    },
    {
      question: `Are these alternatives really better?`,
      answer: `Better is subjective. Each tool has strengths. I recommend testing 2-3 options with your actual use case before committing. Most offer free trials or freemium tiers.`
    },
    {
      question: `Can I switch tools easily?`,
      answer: `Most modern tools make migration relatively painless. Check if the tool supports importing your existing projects or content before making the switch.`
    }
  ]);
  
  return {
    title,
    slug,
    description,
    content,
    category: tool.category,
    type: 'best-for'
  };
}

function generateAlternativeContent(targetTool, { tools }) {
  const sameCategory = tools.filter(t => t.id !== targetTool.id && t.category === targetTool.category);
  const topAlternatives = sameCategory
    .sort((a, b) => (b.rating || 3) - (a.rating || 3))
    .slice(0, 6);
  
  const slug = `${targetTool.name.toLowerCase().replace(/\s+/g, '-')}-alternatives`;
  const title = `${targetTool.name} Alternatives in 2026: Top Tools to Consider`;
  const description = `Looking for ${targetTool.name} alternatives? Compare these top tools for ${targetTool.category.toLowerCase()} tasks. Find the perfect fit for your workflow and budget.`;
  
  let content = `<p>If you've been using ${targetTool.name} and looking to explore other options, you're in the right place. I've tested many tools in the ${targetTool.category.toLowerCase()} space, and here are my honest recommendations.</p>\n\n`;
  
  content += `<h2>Why Look for ${targetTool.name} Alternatives?</h2>\n`;
  content += `<p>${humanizeText(targetTool.description.slice(0, 250))}</p>\n`;
  content += `<p>That said, there are plenty of other solid options out there. Depending on your specific needs—whether it's pricing, features, or ease of use—you might find a better match elsewhere.</p>\n\n`;
  
  content += `<h2>Top ${targetTool.name} Alternatives</h2>\n`;
  
  topAlternatives.forEach((alt, i) => {
    content += `<h3>${i + 1}. ${alt.name}</h3>\n`;
    content += `<p>${humanizeText(alt.description)}</p>\n`;
    content += `<ul>\n`;
    content += `<li><strong>Pricing:</strong> ${alt.pricing}</li>\n`;
    content += `<li><strong>Rating:</strong> ${alt.rating || 'N/A'}/5</li>\n`;
    if (alt.best_for) {
      content += `<li><strong>Best for:</strong> ${alt.best_for.join(', ')}</li>\n`;
    }
    content += `</ul>\n`;
    content += generateAffiliateCTA(alt);
    content += '\n';
  });
  
  content += `<h2>My Honest Recommendation</h2>\n`;
  content += `<p>After trying all these tools hands-on, here's the practical takeaway: there's no one-size-fits-all solution. `;
  content += `If you prioritize ${topAlternatives[0]?.name || 'quality'}, start there. `;
  content += `If budget is your main concern, look at the freemium tiers first. `;
  content += `The best approach is to try 2-3 options with real projects before settling on one.</p>\n\n`;
  
  content += generateInternalLinks(tools, targetTool);
  
  content += generateFAQBlock([
    {
      question: `Is ${targetTool.name} still worth it in 2026?`,
      answer: `${targetTool.name} remains a solid choice with a ${targetTool.rating || 'good'} rating. Whether it's "worth it" depends on your specific use case and budget. I recommend trying the free tier first.`
    },
    {
      question: `Which alternative is most similar to ${targetTool.name}?`,
      answer: `Based on feature comparison, ${topAlternatives[0]?.name || 'the top-rated option'} offers the most similar feature set. However, each tool has its unique strengths.`
    },
    {
      question: `Are there free alternatives to ${targetTool.name}?`,
      answer: `Yes! Most tools offer freemium models. Check the pricing section above for free tier details. I've found that free options often cover basic needs well.`
    },
    {
      question: `How do I migrate from ${targetTool.name}?`,
      answer: `Most tools support standard import/export formats. Check the target tool's documentation for specific migration steps. In my experience, content and projects transfer more easily than you'd expect.`
    }
  ]);
  
  return {
    title,
    slug,
    description,
    content,
    category: targetTool.category,
    type: 'alternative'
  };
}

function getTopTools(tools, count = 10) {
  return tools
    .filter(t => t.rating && t.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}

function groupByCategory(tools) {
  const grouped = {};
  tools.forEach(tool => {
    if (!grouped[tool.category]) {
      grouped[tool.category] = [];
    }
    grouped[tool.category].push(tool);
  });
  return grouped;
}

function generateAllContent() {
  console.log('🚀 Starting pSEO content generation...\n');
  
  const { tools, blogIndex } = loadData();
  const existingSlugs = new Set(blogIndex.map(b => b.slug));
  
  const grouped = groupByCategory(tools);
  const categories = Object.keys(grouped);
  const results = { vs: [], bestFor: [], alternatives: [] };
  
  console.log(`📊 Loaded ${tools.length} tools across ${categories.length} categories\n`);
  
  categories.forEach(category => {
    const categoryTools = grouped[category];
    for (let i = 0; i < categoryTools.length - 1; i++) {
      for (let j = i + 1; j < categoryTools.length; j++) {
        if (Math.random() > 0.5) {
          const vsContent = generateVSContent(categoryTools[i], categoryTools[j]);
          if (!existingSlugs.has(vsContent.slug)) {
            saveData(vsContent);
            results.vs.push(vsContent);
          }
        }
      }
    }
  });
  
  const topTools = getTopTools(tools, 15);
  topTools.forEach(tool => {
    if (tool.best_for && tool.best_for.length > 0) {
      tool.best_for.slice(0, 2).forEach(useCase => {
        const bestForContent = generateBestForContent(tool, useCase);
        if (!existingSlugs.has(bestForContent.slug)) {
          saveData(bestForContent);
          results.bestFor.push(bestForContent);
        }
      });
    }
  });
  
  topTools.forEach(tool => {
    const alternativeContent = generateAlternativeContent(tool, { tools });
    if (!existingSlugs.has(alternativeContent.slug)) {
      saveData(alternativeContent);
      results.alternatives.push(alternativeContent);
    }
  });
  
  console.log('\n✅ pSEO Content Generation Complete!');
  console.log(`   - VS pages: ${results.vs.length}`);
  console.log(`   - Best For pages: ${results.bestFor.length}`);
  console.log(`   - Alternative pages: ${results.alternatives.length}`);
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review generated content in .tmp/pseo-content/');
  console.log('   2. Add unique intro paragraphs with personal experience');
  console.log('   3. Add screenshots/examples specific to each comparison');
  console.log('   4. Review and approve before adding to blog-index.json');
  
  return results;
}

if (require.main === module) {
  generateAllContent();
}

module.exports = { generateAllContent, generateVSContent, generateBestForContent, generateAlternativeContent };
