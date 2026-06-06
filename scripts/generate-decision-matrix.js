#!/usr/bin/env node

/**
 * Decision Matrix Data Generator
 * 
 * Reads data/tools.json and generates decision matrix data
 * for each category based on tool best_for fields and ratings.
 * 
 * Usage: node scripts/generate-decision-matrix.js
 */

const fs = require('fs');
const path = require('path');

// --- Configuration ---
const CATEGORY_SCENARIOS = {
  Writing: [
    { id: 'blog', name: 'Blog Posts', icon: '📝' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'ad_copy', name: 'Ad Copy', icon: '📢' },
    { id: 'social_media', name: 'Social Media', icon: '💬' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
  ],
  Image: [
    { id: 'logo', name: 'Logo Design', icon: '🏷️' },
    { id: 'photo', name: 'Photo Editing', icon: '📷' },
    { id: 'illustration', name: 'Illustration', icon: '🎨' },
    { id: 'book_cover', name: 'Book Cover', icon: '📖' },
    { id: 'social_media', name: 'Social Media', icon: '💬' },
  ],
  Video: [
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'instagram', name: 'Instagram Reels', icon: '📸' },
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'course', name: 'Course Content', icon: '📚' },
  ],
  Audio: [
    { id: 'podcast', name: 'Podcast', icon: '🎙️' },
    { id: 'voiceover', name: 'Voiceover', icon: '🗣️' },
    { id: 'music', name: 'Music Creation', icon: '🎶' },
    { id: 'transcription', name: 'Transcription', icon: '📋' },
    { id: 'audiobook', name: 'Audiobook', icon: '🎧' },
  ],
  Code: [
    { id: 'web_dev', name: 'Web Development', icon: '🌐' },
    { id: 'mobile', name: 'Mobile Apps', icon: '📱' },
    { id: 'data_science', name: 'Data Science', icon: '📊' },
    { id: 'devops', name: 'DevOps', icon: '⚙️' },
    { id: 'debugging', name: 'Debugging', icon: '🐛' },
  ],
  Productivity: [
    { id: 'project_mgmt', name: 'Project Management', icon: '📋' },
    { id: 'note_taking', name: 'Note Taking', icon: '📝' },
    { id: 'automation', name: 'Automation', icon: '🤖' },
    { id: 'collaboration', name: 'Collaboration', icon: '👥' },
    { id: 'scheduling', name: 'Scheduling', icon: '📅' },
  ],
};

// Scenario-to-best_for keyword mapping
const SCENARIO_KEYWORDS = {
  Writing: {
    blog: ['blog', 'content', 'seo', 'article', 'writing'],
    email: ['email', 'newsletter', 'marketing'],
    ad_copy: ['ad', 'copy', 'marketing', 'advertising', 'sales'],
    social_media: ['social', 'media', 'twitter', 'instagram', 'post'],
    academic: ['academic', 'research', 'paper', 'essay'],
  },
  Image: {
    logo: ['logo', 'brand', 'identity', 'design'],
    photo: ['photo', 'editing', 'retouch', 'enhance'],
    illustration: ['illustration', 'art', 'creative', 'drawing'],
    book_cover: ['book', 'cover', 'publishing', 'design'],
    social_media: ['social', 'media', 'thumbnail', 'graphic'],
  },
  Video: {
    youtube: ['youtube', 'video', 'long-form', 'content'],
    tiktok: ['tiktok', 'short', 'reel', 'clip'],
    instagram: ['instagram', 'reel', 'story', 'short'],
    professional: ['professional', 'business', 'corporate', 'presentation'],
    course: ['course', 'education', 'tutorial', 'training'],
  },
  Audio: {
    podcast: ['podcast', 'audio', 'recording'],
    voiceover: ['voice', 'voiceover', 'tts', 'speech'],
    music: ['music', 'song', 'beat', 'composition'],
    transcription: ['transcription', 'speech-to-text', 'convert'],
    audiobook: ['audiobook', 'narration', 'book'],
  },
  Code: {
    web_dev: ['web', 'frontend', 'backend', 'full-stack', 'javascript'],
    mobile: ['mobile', 'ios', 'android', 'app'],
    data_science: ['data', 'science', 'ml', 'ai', 'analysis'],
    devops: ['devops', 'cloud', 'deploy', 'infrastructure'],
    debugging: ['debug', 'fix', 'error', 'troubleshoot'],
  },
  Productivity: {
    project_mgmt: ['project', 'management', 'planning', 'task'],
    note_taking: ['note', 'writing', 'document', 'wiki'],
    automation: ['automation', 'workflow', 'zapier', 'integration'],
    collaboration: ['team', 'collaboration', 'shared', 'workspace'],
    scheduling: ['schedule', 'calendar', 'meeting', 'time'],
  },
};

// --- Helper Functions ---
function getRecommendationLevel(tool, scenarioId, category) {
  const rating = tool.rating || 0;
  const bestFor = (tool.best_for || []).map(b => b.toLowerCase());
  const keywords = SCENARIO_KEYWORDS[category]?.[scenarioId] || [];
  
  // Check if tool's best_for matches scenario keywords
  const isBestFit = keywords.some(keyword => 
    bestFor.some(bf => bf.includes(keyword) || keyword.includes(bf))
  );

  if (isBestFit && rating >= 4.0) {
    return 'best_fit';
  }
  
  if (rating >= 3.5) {
    return 'viable';
  }

  return 'not_recommended';
}

function getRecommendationReason(tool, level, scenarioId, category) {
  const rating = tool.rating || 0;
  const bestFor = tool.best_for || [];
  const keywords = SCENARIO_KEYWORDS[category]?.[scenarioId] || [];
  const matchedKeywords = bestFor.filter(bf => 
    keywords.some(k => bf.toLowerCase().includes(k) || k.includes(bf.toLowerCase()))
  );

  switch (level) {
    case 'best_fit':
      return `${tool.name} excels here (${rating.toFixed(1)}/5) — optimized for ${matchedKeywords.join(', ')}`;
    case 'viable':
      return `${tool.name} works well (${rating.toFixed(1)}/5) but not specifically designed for this`;
    case 'not_recommended':
      return `${tool.name} is not ideal for this scenario`;
  }
}

function generateMatrixForCategory(tools, category) {
  const scenarios = CATEGORY_SCENARIOS[category];
  if (!scenarios) return null;

  // Get top tools for this category (max 5, sorted by rating)
  const categoryTools = tools
    .filter(t => t.category === category)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  if (categoryTools.length < 2) return null;

  const matrixTools = categoryTools.map(t => ({
    id: t.id,
    name: t.name,
    rating: t.rating || 4.0,
    pricing: t.pricing,
    affiliateLink: t.affiliate_link || '',
    url: t.url,
  }));

  const matrix = {};
  for (const tool of categoryTools) {
    matrix[String(tool.id)] = {};
    for (const scenario of scenarios) {
      const level = getRecommendationLevel(tool, scenario.id, category);
      matrix[String(tool.id)][scenario.id] = {
        level,
        reason: getRecommendationReason(tool, level, scenario.id, category),
      };
    }
  }

  return {
    category,
    scenarios,
    tools: matrixTools,
    matrix,
  };
}

// --- Main ---
function main() {
  const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
  const outputPath = path.join(__dirname, '..', 'data', 'decision-matrices.json');

  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
  const categories = Object.keys(CATEGORY_SCENARIOS);

  const matrices = {};
  for (const category of categories) {
    const data = generateMatrixForCategory(tools, category);
    if (data) {
      matrices[category] = data;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(matrices, null, 2));
  console.log(`✅ Decision matrices generated for: ${Object.keys(matrices).join(', ')}`);
  console.log(`📄 Output: ${outputPath}`);
}

main();
