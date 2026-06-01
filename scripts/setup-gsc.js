#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log('\n🔧 GSC Configuration Wizard — Use AI Tools');
  console.log('='.repeat(50));
  console.log('This wizard will help you configure Google Search Console auto-submission.');
  console.log('Credentials are now managed via GOOGLE_CREDENTIALS_JSON environment variable.\n');

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

  const credentialsJson = JSON.stringify(credentials, null, 2);

  console.log('\n✅ Configuration complete!');
  console.log('='.repeat(50));
  console.log('\n📌 Set the following environment variable in Vercel:');
  console.log('   Variable Name: GOOGLE_CREDENTIALS_JSON');
  console.log('   Variable Value: (paste the JSON below)\n');
  console.log(credentialsJson);
  console.log('\n🔒 Important:');
  console.log('   - This JSON contains sensitive credentials.');
  console.log('   - Never commit this to version control.');
  console.log('   - Set this in Vercel Dashboard > Settings > Environment Variables\n');

  console.log('\n📌 Next steps:');
  console.log('   1. Make sure the service account is added as a site owner in GSC:');
  console.log(`      https://search.google.com/search-console/owners?resource_id=sc-domain:${domain}`);
  console.log('   2. Run the submission script:');
  console.log('      bash scripts/run-gsc-submit.sh --days 1');
  console.log('   3. For GitHub Actions, add the env var to your workflow\n');

  rl.close();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  rl.close();
  process.exit(1);
});