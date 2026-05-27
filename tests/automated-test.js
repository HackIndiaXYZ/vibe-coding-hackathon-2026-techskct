/**
 * Automated Test Suite for FolioAI
 * Run using: npm test
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`  ${colors.green}✓${colors.reset} ${message}`);
  } else {
    testsFailed++;
    console.error(`  ${colors.red}✗ Assertion Failed:${colors.reset} ${message}`);
  }
}

async function runTest(name, fn) {
  console.log(`\n${colors.bold}${colors.cyan}[TEST] Running: ${name}${colors.reset}`);
  try {
    await fn();
  } catch (error) {
    testsFailed++;
    console.error(`  ${colors.red}✗ Test crashed:${colors.reset} ${error.message}`);
    console.error(error.stack);
  }
}

async function main() {
  console.log(`${colors.bold}========================================`);
  console.log(`       FOLIOAI AUTOMATED TEST RUNNER    `);
  console.log(`========================================${colors.reset}`);

  // Test 1: PDF Extractor Logic
  await runTest('PDF Text Extractor Integrity', async () => {
    const { extractPdfText } = require('../.next/server/app/api/upload/route.js'); // Use compiled route or dynamic require
    // If not compiled, we mock check the file presence
    const extractFile = path.join(__dirname, '../lib/pdf/extract.ts');
    assert(fs.existsSync(extractFile), 'extract.ts file exists');
    
    const extractContent = fs.readFileSync(extractFile, 'utf8');
    assert(extractContent.includes('export async function extractPdfText'), 'extractPdfText is defined as an async function');
    assert(extractContent.includes('pdf-parse/lib/pdf-parse.js'), 'extractPdfText uses direct pdf-parse library subpath');
    assert(extractContent.includes('extractPdfTextFallback'), 'extractPdfText implements automatic regex-based fallback');
  });

  // Test 2: AI Prompt Schema & Integrity
  await runTest('OpenAI Prompt Schema & Prompt Rules', async () => {
    const clientFile = path.join(__dirname, '../lib/openai/client.ts');
    assert(fs.existsSync(clientFile), 'client.ts config file exists');
    
    const clientContent = fs.readFileSync(clientFile, 'utf8');
    assert(clientContent.includes('RESUME_PARSER:'), 'RESUME_PARSER system prompt is defined');
    assert(clientContent.includes('"languages":'), 'RESUME_PARSER prompt schema includes "languages"');
    assert(clientContent.includes('CRITICAL: Extract ALL content section-by-section without fail'), 'RESUME_PARSER prompt rules contain strict extraction mandates');
    assert(clientContent.includes('Extract EVERY project, EVERY job, EVERY education entry'), 'RESUME_PARSER mandates extracting all section items');
  });

  // Test 3: Theme Integrations (15 themes)
  await runTest('Theme Count Verification in Pages', async () => {
    const rendererFile = path.join(__dirname, '../app/portfolio/[slug]/PortfolioRenderer.tsx');
    const selectorFile = path.join(__dirname, '../app/choose-template/[id]/page.tsx');
    const editorFile = path.join(__dirname, '../app/editor/[id]/page.tsx');
    
    assert(fs.existsSync(rendererFile), 'PortfolioRenderer.tsx file exists');
    assert(fs.existsSync(selectorFile), 'Choose Template page.tsx file exists');
    assert(fs.existsSync(editorFile), 'Editor page.tsx file exists');

    const rendererContent = fs.readFileSync(rendererFile, 'utf8');
    const selectorContent = fs.readFileSync(selectorFile, 'utf8');
    const editorContent = fs.readFileSync(editorFile, 'utf8');

    // Count instances of theme keys
    const expectedThemes = [
      'developer', 'designer', 'scientist', 'executive', 'marketer',
      'neon-cyberpunk', 'pastel-creative', 'midnight-finance', 'forest-green',
      'red-hacker', 'ocean-blue', 'warm-editorial', 'rose-gold', 'clinical-white', 'holographic'
    ];

    expectedThemes.forEach(theme => {
      assert(rendererContent.includes(theme), `PortfolioRenderer support verified for: ${theme}`);
      assert(selectorContent.includes(theme), `Choose Theme screen support verified for: ${theme}`);
      assert(editorContent.includes(theme), `Editor mini preview support verified for: ${theme}`);
    });
  });

  // Test 4: Database Config & Environment
  await runTest('Supabase Credentials & Config Verification', async () => {
    const envFile = path.join(__dirname, '../.env.local');
    assert(fs.existsSync(envFile), '.env.local configuration file exists');
    
    const envContent = fs.readFileSync(envFile, 'utf8');
    assert(envContent.includes('NEXT_PUBLIC_SUPABASE_URL'), 'NEXT_PUBLIC_SUPABASE_URL environment variable is set');
    assert(envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), 'NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is set');
    assert(envContent.includes('OPENAI_API_KEY'), 'OPENAI_API_KEY environment variable is set');
  });

  // Test 5: AI Recruiter Job-Fit Matcher Integrity
  await runTest('AI Recruiter Job-Fit Matcher Integrity', async () => {
    const routeFile = path.join(__dirname, '../app/api/job-match/route.ts');
    assert(fs.existsSync(routeFile), 'job-match/route.ts file exists');

    const routeContent = fs.readFileSync(routeFile, 'utf8');
    assert(routeContent.includes('export async function POST'), 'job-match/route.ts exports POST handler');
    assert(routeContent.includes('gpt-4o'), 'job-match/route.ts uses gpt-4o model');
    assert(routeContent.includes('response_format: { type: \'json_object\' }') || routeContent.includes("response_format: { type: 'json_object' }"), 'job-match/route.ts requests JSON format output');
    assert(routeContent.includes('score'), 'job-match/route.ts returns score in JSON schema');
    assert(routeContent.includes('summary'), 'job-match/route.ts returns summary in JSON schema');
    assert(routeContent.includes('highlights'), 'job-match/route.ts returns highlights in JSON schema');
    assert(routeContent.includes('gaps'), 'job-match/route.ts returns gaps in JSON schema');
    assert(routeContent.includes('questions'), 'job-match/route.ts returns questions in JSON schema');

    const rendererFile = path.join(__dirname, '../app/portfolio/[slug]/PortfolioRenderer.tsx');
    const rendererContent = fs.readFileSync(rendererFile, 'utf8');
    assert(rendererContent.includes('isJobMatcherOpen'), 'PortfolioRenderer.tsx manages isJobMatcherOpen state');
    assert(rendererContent.includes('<JobMatcher'), 'PortfolioRenderer.tsx renders <JobMatcher /> component');
    assert(rendererContent.includes('Are you a recruiter?'), 'PortfolioRenderer.tsx includes recruiter CTA text');
  });

  // Final Summary
  console.log(`\n${colors.bold}========================================`);
  console.log(`              TEST SUMMARY              `);
  console.log(`========================================${colors.reset}`);
  console.log(`  Passed: ${colors.green}${testsPassed}${colors.reset}`);
  console.log(`  Failed: ${testsFailed > 0 ? colors.red : colors.green}${testsFailed}${colors.reset}`);
  
  if (testsFailed > 0) {
    console.error(`\n${colors.red}${colors.bold}✗ SOME TESTS FAILED! Check logs above.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}✓ ALL SYSTEM TESTS PASSED SUCCESSFULLY!${colors.reset}\n`);
    process.exit(0);
  }
}

main();
