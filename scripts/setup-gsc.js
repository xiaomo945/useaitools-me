#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log('\n🔧 GSC Configuration Wizard — Use AI Tools');
  console.log('='.repeat(50));
  console.log('This wizard will create credentials.json for Google Search Console auto-submission.\n');

  if (fs.existsSync(CREDENTIALS_PATH)) {
    console.log('⚠️  credentials.json already exists at project root.');
    const overwrite = await question('Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Aborted. Existing credentials.json preserved.');
      rl.close();
      return;
    }
  }

  console.log('\n📋 You need the following from Google Cloud Console:');
  console.log('   1. Service account email (e.g., gsc-submit@project.iam.gserviceaccount.com)');
  console.log('   2. Private key (from the JSON key file you downloaded)');
  console.log('   3. Your site domain (e.g., useaitools.me)\n');

  const clientEmail = await question('🔑 Service account email: ');
  if (!clientEmail.trim()) {
    console.log('❌ Email is required. Aborted.');
    rl.close();
    return;
  }

  console.log('\n📎 Paste the entire private key (including -----BEGIN/END----- lines).');
  console.log('   Tip: Copy from the JSON key file\'s "private_key" field.\n');
  const privateKey = await question('🔑 Private key: ');
  if (!privateKey.trim()) {
    console.log('❌ Private key is required. Aborted.');
    rl.close();
    return;
  }

  const domain = (await question('🌐 Site domain (default: useaitools.me): ')).trim() || 'useaitools.me';

  const formattedKey = privateKey
    .replace(/\\n/g, '\n')
    .replace(/^["']|["']$/g, '')
    .trim();

  const credentials = {
    type: 'service_account',
    project_id: domain.replace(/\./g, '-'),
    private_key_id: 'auto-generated',
    private_key: formattedKey,
    client_email: clientEmail.trim(),
    client_id: '',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(clientEmail.trim())}`,
  };

  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2), 'utf8');

  console.log('\n✅ credentials.json created at project root!');
  console.log(`   Path: ${CREDENTIALS_PATH}`);
  console.log('\n📌 Next steps:');
  console.log('   1. Make sure the service account is added as a site owner in GSC:');
  console.log(`      https://search.google.com/search-console/owners?resource_id=sc-domain:${domain}`);
  console.log('   2. Run the submission script:');
  console.log('      bash scripts/run-gsc-submit.sh --days 1');
  console.log('\n🔒 credentials.json is already in .gitignore — it will NOT be committed.\n');

  rl.close();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  rl.close();
  process.exit(1);
});
