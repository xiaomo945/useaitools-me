#!/usr/bin/env node
/**
 * Auto-tweet script for Use AI Tools
 * Reads from social media bank and publishes or outputs for manual posting
 */

const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', '.tmp', 'social-media-30day-bank.md');
const HISTORY_PATH = path.join(__dirname, '..', '.tmp', 'tweet-history.json');

function main() {
  // Check if bank file exists
  if (!fs.existsSync(BANK_PATH)) {
    console.log('No social media bank found at', BANK_PATH);
    console.log('Run content generation first to create the bank.');
    process.exit(1);
  }

  // Load bank content
  const bankContent = fs.readFileSync(BANK_PATH, 'utf-8');
  
  // Parse tweets from bank (look for numbered items or bullet points)
  const tweetLines = bankContent
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Match lines that look like tweets (numbered or bulleted, not headers or empty)
      return trimmed && (
        /^\d+\.\s/.test(trimmed) || 
        /^[-*]\s/.test(trimmed) ||
        (trimmed.length > 20 && !trimmed.startsWith('#') && !trimmed.startsWith('---'))
      );
    })
    .map(line => line.replace(/^(\d+\.|[-*])\s*/, '').trim())
    .filter(line => line.length > 0 && line.length <= 280);

  if (tweetLines.length === 0) {
    console.log('No valid tweets found in bank file.');
    process.exit(1);
  }

  // Load history
  let history = [];
  if (fs.existsSync(HISTORY_PATH)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8'));
    } catch (e) {
      history = [];
    }
  }

  const postedContents = new Set(history.map(h => h.content));
  
  // Find unposted tweets
  const unposted = tweetLines.filter(t => !postedContents.has(t));
  
  if (unposted.length === 0) {
    console.log('All tweets have been posted! Generate more content.');
    process.exit(0);
  }

  // Pick a random unposted tweet
  const selected = unposted[Math.floor(Math.random() * unposted.length)];

  // Check for Twitter API credentials
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (apiKey && apiSecret && accessToken && accessSecret) {
    // Would use Twitter API v2 here
    console.log('Twitter API credentials found. Auto-publishing would happen here.');
    console.log('Tweet:', selected);
    console.log('NOTE: Actual API integration requires the twitter-api-v2 npm package.');
  } else {
    console.log('=== TWEET READY FOR MANUAL POSTING ===');
    console.log('');
    console.log(selected);
    console.log('');
    console.log('Character count:', selected.length);
    console.log('========================================');
  }

  // Record in history
  history.push({
    content: selected,
    timestamp: new Date().toISOString(),
    posted: !!(apiKey && apiSecret && accessToken && accessSecret),
  });

  const tmpDir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf-8');
  
  console.log(`\nHistory updated. Total posted: ${history.length}, Remaining: ${unposted.length - 1}`);
}

main();
