/**
 * End-to-End (E2E) Browser Automation Test for FolioAI
 * Verifies the AI Recruiter Job-Fit Matcher CTA, Modal, and interaction.
 * Run using: node tests/e2e-test.js
 */

let puppeteer;
const { createClient } = require('@supabase/supabase-js');
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

function logStep(msg) {
  console.log(`${colors.cyan}→${colors.reset} ${msg}`);
}

function logSuccess(msg) {
  console.log(`  ${colors.green}✓${colors.reset} ${msg}`);
}

function logError(msg) {
  console.error(`  ${colors.red}✗${colors.reset} ${msg}`);
}

// Custom env loader
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.substring(0, idx).trim();
    const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  });
  return env;
}

async function runE2ETest() {
  const puppeteerModule = await import('puppeteer');
  puppeteer = puppeteerModule.default || puppeteerModule;

  console.log(`${colors.bold}========================================`);
  console.log(`     FOLIOAI E2E BROWSER AUTOMATION    `);
  console.log(`========================================${colors.reset}\n`);

  const env = loadEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    logError("Supabase environment variables are missing from .env.local.");
    process.exit(1);
  }

  global.WebSocket = class DummyWebSocket {};
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  let tempSlug = null;
  let slugToUse = null;

  try {
    logStep("Querying database to find a test portfolio...");
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('slug')
      .limit(1);

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (portfolios && portfolios.length > 0) {
      slugToUse = portfolios[0].slug;
      logSuccess(`Found existing portfolio with slug: ${slugToUse}`);
    } else {
      // Create a temporary portfolio to run tests against
      tempSlug = 'e2e-test-slug-' + Date.now();
      slugToUse = tempSlug;
      logStep(`No portfolios found. Creating temporary test portfolio: ${tempSlug}...`);
      const { error: insertError } = await supabase.from('portfolios').insert({
        slug: tempSlug,
        title: 'E2E Testing Portfolio',
        theme: 'developer',
        published: true,
        views: 0,
        data: {
          name: "E2E Test Candidate",
          title: "Senior Automated Test Engineer",
          summary: "E2E expert with deep Puppeteer, Playwright, and Jest experience.",
          skills: ["Puppeteer", "Playwright", "JavaScript", "TypeScript", "Node.js", "CI/CD"],
          experience: [
            {
              company: "Quality Assurance Ltd",
              role: "Lead QA Engineer",
              duration: "2022 - Present",
              description: "Designed robust testing frameworks for modern web apps."
            }
          ]
        }
      });

      if (insertError) {
        throw new Error(`Failed to insert temporary portfolio: ${insertError.message}`);
      }
      logSuccess(`Temporary portfolio created successfully.`);
    }

    logStep("Launching Puppeteer browser...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Enable Clipboard permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('http://localhost:3000', ['clipboard-read', 'clipboard-write']);

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Request interception to mock OpenAI API response dynamically
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      if (interceptedRequest.url().includes('/api/job-match') && interceptedRequest.method() === 'POST') {
        logStep("Intercepted /api/job-match POST request. Returning mock fit analysis response...");
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              score: 92,
              summary: "The candidate represents a stellar match. Strong fit for testing roles with comprehensive Puppeteer experience.",
              highlights: [
                "Direct expertise in browser automation and Puppeteer.",
                "TypeScript and Node.js proficiency aligns with core tech stack."
              ],
              gaps: [
                "No direct Go or Python testing frameworks mentioned.",
                "Docker infrastructure configuration detail is missing."
              ],
              questions: [
                "How do you handle flaky tests in headless browser setups?",
                "Can you discuss your strategy for parallelizing E2E test suites?"
              ]
            }
          })
        });
      } else {
        interceptedRequest.continue();
      }
    });

    const portfolioUrl = `http://localhost:3000/portfolio/${slugToUse}`;
    logStep(`Navigating to portfolio page: ${portfolioUrl}`);
    await page.goto(portfolioUrl, { waitUntil: 'networkidle2' });

    // 1. Verify page elements
    logStep("Verifying CTA button elements are present on portfolio page...");
    
    // Check for Hero CTA button
    const heroBtnText = "Are you a recruiter? Check My Job Match";
    const ctaExists = await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => btn.textContent.includes(btnText));
    }, heroBtnText);

    if (ctaExists) {
      logSuccess("Hero CTA button 'Check My Job Match' is rendered.");
    } else {
      throw new Error("Hero CTA button is missing from the portfolio page.");
    }

    // Check for bottom-left floating briefcase button
    const floatingBtnSelector = 'button.left-6';
    const floatingBtn = await page.$(floatingBtnSelector);
    if (floatingBtn) {
      logSuccess("Floating briefcase button (bottom-left) is rendered.");
    } else {
      throw new Error("Floating briefcase button is missing from the viewport.");
    }

    // 2. Open the Job-Fit Matcher modal
    logStep("Clicking the recruiter CTA button to open Job-Fit Matcher modal...");
    await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes(btnText));
      if (btn) btn.click();
    }, heroBtnText);

    // Wait for the modal content to animate in
    await page.waitForSelector('textarea', { timeout: 5000 });
    logSuccess("Job-Fit Matcher modal opened successfully (textarea visible).");

    const modalTitle = "AI Recruiter Job-Fit Matcher";
    const hasModalTitle = await page.evaluate((title) => {
      return document.body.textContent.includes(title);
    }, modalTitle);
    
    if (hasModalTitle) {
      logSuccess(`Verified modal title: "${modalTitle}"`);
    } else {
      throw new Error("Modal title is missing or incorrect.");
    }

    // 3. Paste job description and run analysis
    logStep("Entering sample job description in textarea...");
    await page.type('textarea', 'We are looking for a Senior QA Automation Engineer proficient in Puppeteer, Node.js, and TypeScript.');

    logStep("Clicking 'Analyze Fit' button...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const analyzeBtn = buttons.find(b => b.textContent.includes('Analyze Fit'));
      if (analyzeBtn) analyzeBtn.click();
    });

    // 4. Wait for analysis and results layout
    logStep("Waiting for AI analysis and results to render...");
    await page.waitForFunction(
      () => document.body.textContent.includes('Fit Assessment'),
      { timeout: 8000 }
    );
    logSuccess("AI Fit Assessment results successfully returned and rendered.");

    // 5. Verify the matched results components
    logStep("Asserting matched components contents...");

    const results = await page.evaluate(() => {
      const text = document.body.textContent;
      return {
        hasScore: text.includes('92%'),
        hasSummary: text.includes('stellar match'),
        hasHighlights: text.includes('browser automation and Puppeteer'),
        hasGaps: text.includes('flaky tests') || text.includes('Docker infrastructure'),
        hasQuestions: text.includes('parallelizing E2E test suites')
      };
    });

    if (results.hasScore) logSuccess("Circular Match Score gauge displays correct percentage (92%).");
    else throw new Error("Match Score gauge failed to render correct score.");

    if (results.hasSummary) logSuccess("Recruiter assessment summary text is displayed.");
    else throw new Error("Assessment summary is missing or incorrect.");

    if (results.hasHighlights) logSuccess("Matching highlights bullet points are present.");
    else throw new Error("Matching highlights list is missing.");

    if (results.hasGaps) logSuccess("Gap analysis bullet points are present.");
    else throw new Error("Gap analysis list is missing.");

    if (results.hasQuestions) logSuccess("Tailored interview questions are present.");
    else throw new Error("Suggested interview questions list is missing.");

    // 6. Test copying questions
    logStep("Testing copy-to-clipboard functionality...");
    const copyButtonSelector = 'button svg.lucide-copy';
    const copyButtons = await page.$$(copyButtonSelector);
    if (copyButtons.length > 0) {
      await page.evaluate(() => {
        const firstCopy = document.querySelector('button svg.lucide-copy')?.parentElement;
        if (firstCopy) firstCopy.click();
      });
      logSuccess("Clicked copy button without errors.");
    } else {
      throw new Error("Copy button is missing from interview questions card.");
    }

    // 7. Close the modal
    logStep("Closing the report modal...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeBtn = buttons.find(b => b.textContent.includes('Close Report'));
      if (closeBtn) closeBtn.click();
    });

    // Check that modal closes (textarea or close report should disappear)
    await page.waitForFunction(
      () => !document.body.textContent.includes('Fit Assessment'),
      { timeout: 5000 }
    );
    logSuccess("Report modal successfully closed.");

    logStep("Closing Puppeteer browser...");
    await browser.close();

    logSuccess("E2E browser automation test completed successfully!");
  } catch (error) {
    logError(`E2E test failed: ${error.message}`);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    // 8. Database Clean up
    if (tempSlug) {
      logStep(`Cleaning up temporary portfolio from database: ${tempSlug}...`);
      await supabase.from('portfolios').delete().eq('slug', tempSlug);
      logSuccess("Database cleaned up successfully.");
    }
  }
}

runE2ETest();
