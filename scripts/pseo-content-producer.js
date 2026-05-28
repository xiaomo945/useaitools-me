const fs = require('fs');
const path = require('path');

// Load data sources
const tools = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tools.json'), 'utf-8'));
const blogPosts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'blog-posts.json'), 'utf-8'));

// Helper: Get next available ID
const getNextId = () => Math.max(...blogPosts.map(post => post.id)) + 1;

// Helper: Generate unique slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
};

// Helper: Generate unique images
const generateImages = (topic) => {
  const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);
  return [
    {
      url: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop&sig=${uniqueId}1`,
      alt: `${topic} - AI tools comparison`,
      position: 'header'
    },
    {
      url: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop&sig=${uniqueId}2`,
      alt: `${topic} - Best AI tools recommendations`,
      position: 'mid'
    },
    {
      url: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop&sig=${uniqueId}3`,
      alt: `${topic} - AI tools for productivity`,
      position: 'cta'
    }
  ];
};

// Generate "vs" page generator
const generateVsPage = (tool1, tool2) => {
  const id = getNextId();
  const title = `${tool1.name} vs ${tool2.name}: ${tool1.category} AI Tools Compared in 2026`;
  const slug = createSlug(`${tool1.name.toLowerCase().replace(/\s+/g, '-')}-vs-${tool2.name.toLowerCase().replace(/\s+/g, '-')}-2026`);
  
  const tool1Desc = tool1.description_en || tool1.description || `Powerful ${tool1.category} capabilities`;
  const tool2Desc = tool2.description_en || tool2.description || `Powerful ${tool2.category} capabilities`;
  
  return {
    id,
    title,
    slug,
    date: new Date().toISOString().split('T')[0],
    description: `${tool1.name} vs ${tool2.name}: Which ${tool1.category} AI tools head-to-head comparison. Features, pricing, pros and cons to help you decide which one's best in 2026.`,
    category: tool1.category,
    author: "Use AI Tools Team",
    reading_time: "10 min",
    featured: false,
    images: generateImages(`${tool1.name} vs ${tool2.name}`),
    content: `
<p>Choosing between ${tool1.name} and ${tool2.name}? Both are excellent ${tool1.category} tools, but they serve different needs. Let's compare them side-by-side to help you make the right choice.</p>

<h2>Quick Comparison Table</h2>
<table>
  <tr><th>Feature</th><th>${tool1.name}</th><th>${tool2.name}</th></tr>
  <tr><td>Pricing</td><td>${tool1.pricing}</td><td>${tool2.pricing}</td></tr>
  <tr><td>Rating</td><td>${tool1.rating}/5 (${tool1.rating_count || 0} reviews)</td><td>${tool2.rating}/5 (${tool2.rating_count || 0} reviews)</td></tr>
  <tr><td>Skill Level</td><td>${tool1.skill_level || 'Intermediate'}</td><td>${tool2.skill_level || 'Intermediate'}</td></tr>
  <tr><td>VPN Required</td><td>${tool1.needs_vpn ? 'Yes' : 'No'}</td><td>${tool2.needs_vpn ? 'Yes' : 'No'}</td></tr>
</table>

<h2>${tool1.name}: Pros and Cons</h2>
<p><strong>Pros:</strong></p>
<ul>
  <li>High rating of ${tool1.rating}/5 from ${tool1.rating_count || 0} users</li>
  <li>Best for: ${(tool1.best_for || ['Various use cases']).join(', ')}</li>
  <li>${tool1Desc}</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
  <li>Pricing: ${tool1.pricing}</li>
  <li>${tool1.needs_vpn ? 'May require VPN' : 'Direct access available'}</li>
</ul>

<h2>${tool2.name}: Pros and Cons</h2>
<p><strong>Pros:</strong></p>
<ul>
  <li>High rating of ${tool2.rating}/5 from ${tool2.rating_count || 0} users</li>
  <li>Best for: ${(tool2.best_for || ['Various use cases']).join(', ')}</li>
  <li>${tool2Desc}</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
  <li>Pricing: ${tool2.pricing}</li>
  <li>${tool2.needs_vpn ? 'May require VPN' : 'Direct access available'}</li>
</ul>

<h2>When to Choose ${tool1.name}</h2>
<p>Choose ${tool1.name} if you want ${(tool1.best_for || ['prioritize quality'])[0]}. It's great for ${(tool1.best_for || ['various use cases']).slice(0, 2).join(' and ')}.</p>
<p><a href="/tools/${tool1.id}" class="text-emerald-600 hover:underline">Try ${tool1.name} →</a></p>

<h2>When to Choose ${tool2.name}</h2>
<p>Choose ${tool2.name} if you want ${(tool2.best_for || ['prioritize affordability'])[0]}. It's great for ${(tool2.best_for || ['various use cases']).slice(0, 2).join(' and ')}.</p>
<p><a href="/tools/${tool2.id}" class="text-emerald-600 hover:underline">Try ${tool2.name} →</a></p>

<h2>Frequently Asked Questions</h2>
<h3>Q: Which tool is better for beginners?</h3>
<p>A: ${(tool1.skill_level || 'intermediate') === 'beginner' ? tool1.name : tool2.name} is generally better suited for beginners.</p>
<h3>Q: Which tool offers better value for money?</h3>
<p>A: Compare the pricing tiers and see which offers the features you need at the best price.</p>
<h3>Q: Can I use both tools?</h3>
<p>A: Yes! Many creators use both tools for different purposes.</p>

<h2>Final Verdict</h2>
<p>Both ${tool1.name} and ${tool2.name} are excellent choices. Your decision depends on your specific needs, budget, and preferences. Try both free plans if available!</p>
    `.trim()
  };
};

// Generate "best for" page generator
const generateBestForPage = (category, useCase, toolsInCategory) => {
  const id = getNextId();
  const title = `Best ${category} AI Tools for ${useCase} in 2026`;
  const slug = createSlug(`best-${category.toLowerCase().replace(/\s+/g, '-')}-ai-tools-${useCase.toLowerCase().replace(/\s+/g, '-')}-2026`);
  
  const toolsList = toolsInCategory.slice(0, 5).map((tool, i) => {
    const toolDesc = tool.description_en || tool.description || 'Powerful AI capabilities';
    return `
<h3>${i+1}. ${tool.name}</h3>
<p>${toolDesc}</p>
<p><strong>Best for:</strong> ${(tool.best_for || ['Various use cases']).join(', ')}</p>
<p><strong>Pricing:</strong> ${tool.pricing} | <strong>Rating:</strong> ${tool.rating}/5</p>
<p><a href="/tools/${tool.id}" class="text-emerald-600 hover:underline">Try ${tool.name} →</a></p>
`;
  }).join('');
  
  const beginnerTool = toolsInCategory.find(t => (t.skill_level || 'intermediate') === 'beginner') || toolsInCategory[0];
  
  return {
    id,
    title,
    slug,
    date: new Date().toISOString().split('T')[0],
    description: `Discover the best ${category} AI tools for ${useCase} in 2026. Our curated list helps you find the perfect tool for your needs.`,
    category: category,
    author: "Use AI Tools Team",
    reading_time: "7 min",
    featured: false,
    images: generateImages(`Best ${category} for ${useCase}`),
    content: `
<p>Looking for the best ${category} AI tools for ${useCase}? We've curated the top options available today. Each tool is handpicked for quality and suitability.</p>

<h2>Top ${category} Tools for ${useCase}</h2>
${toolsList}

<h2>How to Choose the Right Tool</h2>
<ol>
  <li>Consider your budget</li>
  <li>Evaluate your skill level</li>
  <li>Test free trials where available</li>
  <li>Read user reviews</li>
  <li>Try multiple tools to find your favorite</li>
</ol>

<h2>Frequently Asked Questions</h2>
<h3>Q: What's the best ${category} tool for beginners?</h3>
<p>A: ${beginnerTool ? beginnerTool.name : toolsInCategory[0].name} is a great starting point.</p>
<h3>Q: Are there free options available?</h3>
<p>A: Yes! Look for tools with Freemium or Free pricing.</p>
<h3>Q: Which is the most popular?</h3>
<p>A: ${toolsInCategory.sort((a, b) => ((b.rating_count || 0) - (a.rating_count || 0)))[0].name} has the most reviews.</p>

<h2>Ready to Get Started?</h2>
<p>Pick one of the tools above and start exploring today!</p>
    `.trim()
  };
};

// Generate "alternative to" page generator
const generateAlternativePage = (originalTool, alternatives) => {
  const id = getNextId();
  const title = `${originalTool.name} Alternatives: 5 Better Options in 2026`;
  const slug = createSlug(`${originalTool.name.toLowerCase().replace(/\s+/g, '-')}-alternatives-2026`);
  
  const alternativesList = alternatives.slice(0, 5).map((tool, i) => {
    const toolDesc = tool.description_en || tool.description || 'Powerful AI capabilities';
    return `
<h3>${i+1}. ${tool.name}</h3>
<p>${toolDesc}</p>
<p><strong>Pricing:</strong> ${tool.pricing} | <strong>Rating:</strong> ${tool.rating}/5</p>
<p><a href="/tools/${tool.id}" class="text-emerald-600 hover:underline">Try ${tool.name} →</a></p>
`;
  }).join('');
  
  const comparisonRows = alternatives.slice(0, 4).map(t => {
    return `<tr><td>${t.name}</td><td>${t.pricing}</td><td>${t.rating}/5</td><td>${(t.best_for || ['Various'])[0]}</td></tr>`;
  }).join('');
  
  return {
    id,
    title,
    slug,
    date: new Date().toISOString().split('T')[0],
    description: `Looking for ${originalTool.name} alternatives? We've compiled the top 5 alternatives in 2026 that might be better fits for your needs.`,
    category: originalTool.category,
    author: "Use AI Tools Team",
    reading_time: "6 min",
    featured: false,
    images: generateImages(`${originalTool.name} alternatives`),
    content: `
<p>While ${originalTool.name} is great, it's not the only option. Here are the best alternatives worth considering.</p>

<h2>Why Look for Alternatives?</h2>
<p>${originalTool.name} might not be right for you if:
<ul>
  <li>You're on a tight budget</li>
  <li>You need different features</li>
  <li>You prefer a simpler interface</li>
  <li>You want something more powerful</li>
</ul>

<h2>Top ${originalTool.name} Alternatives</h2>
${alternativesList}

<h2>Comparison Overview</h2>
<table>
  <tr><th>Tool</th><th>Pricing</th><th>Rating</th><th>Best For</th></tr>
  <tr><td>${originalTool.name}</td><td>${originalTool.pricing}</td><td>${originalTool.rating}/5</td><td>${(originalTool.best_for || ['Various'])[0]}</td></tr>
  ${comparisonRows}
</table>

<h2>Frequently Asked Questions</h2>
<h3>Q: Is there a free alternative?</h3>
<p>A: Yes! Check the alternatives with Freemium or Free pricing.</p>
<h3>Q: Which has the best features?</h3>
<p>A: Depends on your needs - compare the list above.</p>
<h3>Q: Can I switch easily?</h3>
<p>A: Most tools let you try free first, so yes!</p>

<h2>Final Thoughts</h2>
<p>Don't be afraid to try multiple tools - you might find an alternative you like better!</p>
    `.trim()
  };
};

// Main execution
console.log('🚀 Starting pSEO content generation...');

const newArticles = [];
let currentId = getNextId();

// Override getNextId to increment properly
const safeGetNextId = () => {
  return currentId++;
};

// 1. Generate "vs" pages - 5 random pairs per category
const categories = [...new Set(tools.map(t => t.category))];
categories.forEach(category => {
  const toolsInCategory = tools.filter(t => t.category === category);
  for (let i = 0; i < Math.min(toolsInCategory.length, 5); i++) {
    for (let j = i + 1; j < Math.min(toolsInCategory.length, i + 3); j++) {
      if (toolsInCategory[i] && toolsInCategory[j]) {
        // Override id temporarily
        const originalGetNextId = getNextId;
        global.getNextId = safeGetNextId;
        newArticles.push(generateVsPage(toolsInCategory[i], toolsInCategory[j]));
      }
    }
  }
});

// 2. Generate "best for" pages - common use cases
const commonUseCases = [
  'Beginners', 'Students', 'Content Creators', 'Small Businesses', 
  'Professionals', 'Marketers', 'Designers'
];
categories.forEach(category => {
  const toolsInCategory = tools.filter(t => t.category === category);
  if (toolsInCategory.length >= 3) {
    commonUseCases.slice(0, 3).forEach(useCase => {
      newArticles.push(generateBestForPage(category, useCase, toolsInCategory));
    });
  }
});

// 3. Generate "alternative to" pages - top tools with most reviews
const topTools = [...tools].sort((a, b) => ((b.rating_count || 0) - (a.rating_count || 0))).slice(0, 10);
topTools.forEach(tool => {
  const alternatives = tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 5);
  if (alternatives.length >= 3) {
    newArticles.push(generateAlternativePage(tool, alternatives));
  }
});

// Manually assign IDs since our override didn't work perfectly
for (let i = 0; i < newArticles.length; i++) {
  newArticles[i].id = getNextId() + i;
}

// Save new articles
const updatedBlogPosts = [...blogPosts, ...newArticles];
fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'blog-posts.json'),
  JSON.stringify(updatedBlogPosts, null, 2),
  'utf-8'
);

console.log(`✅ Generated ${newArticles.length} new pSEO articles!`);
console.log(`📊 Total articles now: ${updatedBlogPosts.length}`);
console.log(`📝 Categories covered: ${categories.join(', ')}`);
