const { chromium } = require('@playwright/test');

const BASE_URL = 'https://hospital.alexandratechlab.com';

const SUPERADMIN = {
  email: 'admin@novoraplus.com',
  password: 'NovoraPlus@2024!',
};

const DOCTOR = {
  email: 'doctor@citygeneralhospital.com',
  password: 'Staff@2024!',
};

async function waitForEnabled(page, selector, timeout = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const disabled = await page.$eval(selector, el => el.disabled).catch(() => true);
    if (!disabled) return true;
    await page.waitForTimeout(500);
  }
  return false;
}

async function runTest() {
  console.log('='.repeat(60));
  console.log('PLAYWRIGHT AUTH ISOLATION TEST');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Login as SuperAdmin
    console.log('\n=== Step 1: Login as SuperAdmin ===');
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    // Clear storage first
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload to apply clear storage
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });

    // Wait for form to be enabled (after checkAuth completes)
    console.log('Waiting for form to be enabled...');
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 30000 });
    console.log('Form is enabled');

    // Fill credentials
    await page.fill('input[type="email"]', SUPERADMIN.email);
    await page.fill('input[type="password"]', SUPERADMIN.password);

    console.log('Filled SuperAdmin credentials, clicking login...');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});

    // Wait a bit more for redirect
    await page.waitForTimeout(3000);

    let url = page.url();
    console.log('After SuperAdmin login, URL:', url);

    if (url.includes('/superadmin')) {
      console.log('✅ SuperAdmin correctly redirected to /superadmin');
    } else {
      console.log('⚠️  SuperAdmin got URL:', url);
    }

    // Check localStorage for auth info
    const authState1 = await page.evaluate(() => {
      const auth = localStorage.getItem('novoraplus_auth_session');
      return auth ? JSON.parse(auth) : null;
    });
    console.log('Auth session user_id:', authState1?.user_id || 'N/A');

    // Step 2: Logout
    console.log('\n=== Step 2: Logout ===');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Cleared storage, navigated to login');

    // Wait for form to be enabled
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 30000 });

    // Step 3: Login as Doctor
    console.log('\n=== Step 3: Login as Doctor ===');

    await page.fill('input[type="email"]', DOCTOR.email);
    await page.fill('input[type="password"]', DOCTOR.password);

    console.log('Filled Doctor credentials, clicking login...');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});

    // Wait a bit more for redirect
    await page.waitForTimeout(3000);

    url = page.url();
    console.log('After Doctor login, URL:', url);

    // Check auth state
    const authState2 = await page.evaluate(() => {
      const auth = localStorage.getItem('novoraplus_auth_session');
      return auth ? JSON.parse(auth) : null;
    });
    console.log('Auth session user_id:', authState2?.user_id || 'N/A');

    // CRITICAL CHECK
    console.log('\n=== CRITICAL VERIFICATION ===');
    if (url.includes('/superadmin')) {
      console.log('❌ FAIL: Doctor redirected to /superadmin (showing old user!)');
      console.log('   The session isolation bug is NOT fixed');
    } else if (url.includes('/dashboard')) {
      console.log('✅ PASS: Doctor correctly redirected to /dashboard');
      console.log('   Session isolation is WORKING!');

      // Extra check: user_ids should be different
      if (authState1?.user_id && authState2?.user_id) {
        if (authState1.user_id !== authState2.user_id) {
          console.log('✅ User IDs are different (correct!)');
          console.log('   SuperAdmin ID:', authState1.user_id);
          console.log('   Doctor ID:', authState2.user_id);
        } else {
          console.log('⚠️  User IDs are the same (unexpected)');
        }
      }
    } else {
      console.log('⚠️  UNEXPECTED: Got URL:', url);
    }

    console.log('\n' + '='.repeat(60));
    console.log('TEST COMPLETE');
    console.log('='.repeat(60));

  } catch (error) {
    console.log('❌ TEST ERROR:', error.message);
    // Take screenshot on error
    await page.screenshot({ path: '/tmp/auth_test_error.png' });
    console.log('Screenshot saved to /tmp/auth_test_error.png');
  } finally {
    await browser.close();
  }
}

runTest().catch(console.error);
