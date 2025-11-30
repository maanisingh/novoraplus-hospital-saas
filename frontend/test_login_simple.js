const { chromium } = require('@playwright/test');

async function runTest() {
  console.log('='.repeat(60));
  console.log('SIMPLE LOGIN PAGE TEST');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[PAGE ERROR]', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('[PAGE CRASH]', err.message);
  });

  try {
    console.log('\n=== Loading login page ===');
    await page.goto('https://hospital.alexandratechlab.com/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for any JS to execute
    console.log('Page loaded, waiting for JS hydration...');
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/login_page.png', fullPage: true });
    console.log('Screenshot saved to /tmp/login_page.png');

    // Check if inputs are disabled
    const emailInput = page.locator('input[type="email"]');
    const isDisabled = await emailInput.isDisabled().catch(() => 'N/A');
    console.log('Email input disabled:', isDisabled);

    // Check for any error text
    const bodyText = await page.textContent('body');
    if (bodyText.includes('Application error') || bodyText.includes('exception')) {
      console.log('FOUND ERROR ON PAGE:', bodyText.substring(0, 300));
    } else {
      console.log('No error text found on page');
    }

    // Try to get page title
    const title = await page.title();
    console.log('Page title:', title);

    // Check URL
    console.log('Final URL:', page.url());

  } catch (error) {
    console.log('TEST ERROR:', error.message);
    await page.screenshot({ path: '/tmp/login_error.png', fullPage: true });
    console.log('Error screenshot saved to /tmp/login_error.png');
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(60));
}

runTest().catch(console.error);
