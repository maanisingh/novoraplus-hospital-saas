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

async function runTest() {
  console.log('='.repeat(60));
  console.log('PLAYWRIGHT AUTH ISOLATION TEST (v2)');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[PAGE ERROR]', msg.text());
    }
  });

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

    // Wait for form to be enabled
    console.log('Waiting for form to be enabled...');
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 30000 });
    console.log('Form is enabled');

    // Fill credentials
    await page.fill('input[type="email"]', SUPERADMIN.email);
    await page.fill('input[type="password"]', SUPERADMIN.password);

    console.log('Filled SuperAdmin credentials, clicking login...');
    await page.click('button[type="submit"]');

    // Wait for URL to change from /login using polling
    console.log('Waiting for redirect...');
    let url = '';
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000);
      url = page.url();
      if (!url.includes('/login')) {
        console.log('Redirected after', i + 1, 'seconds');
        break;
      }
    }

    console.log('After SuperAdmin login, URL:', url);

    if (url.includes('/superadmin')) {
      console.log('✅ SuperAdmin correctly redirected to /superadmin');
    } else if (url.includes('/login')) {
      console.log('❌ SuperAdmin stayed on /login - login may have failed');
      // Check for error message
      const errorText = await page.textContent('body').catch(() => '');
      if (errorText.includes('error') || errorText.includes('Error')) {
        console.log('Error found on page');
      }
    } else {
      console.log('⚠️ SuperAdmin got unexpected URL:', url);
    }

    // Check localStorage for auth info
    const authState1 = await page.evaluate(() => {
      const auth = localStorage.getItem('novoraplus_auth_session');
      return auth ? JSON.parse(auth) : null;
    });
    console.log('Auth session user_id:', authState1?.user_id || 'N/A');

    // Take screenshot
    await page.screenshot({ path: '/tmp/superadmin_after_login.png' });

    // Step 2: Logout and clear session
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

    // Wait for URL to change from /login using polling
    console.log('Waiting for redirect...');
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000);
      url = page.url();
      if (!url.includes('/login')) {
        console.log('Redirected after', i + 1, 'seconds');
        break;
      }
    }

    console.log('After Doctor login, URL:', url);

    // Check auth state
    const authState2 = await page.evaluate(() => {
      const auth = localStorage.getItem('novoraplus_auth_session');
      return auth ? JSON.parse(auth) : null;
    });
    console.log('Auth session user_id:', authState2?.user_id || 'N/A');

    // Take screenshot
    await page.screenshot({ path: '/tmp/doctor_after_login.png' });

    // CRITICAL CHECK
    console.log('\n' + '='.repeat(60));
    console.log('CRITICAL VERIFICATION');
    console.log('='.repeat(60));

    // Check user ID isolation
    if (authState1?.user_id && authState2?.user_id) {
      if (authState1.user_id !== authState2.user_id) {
        console.log('✅ SESSION ISOLATION WORKING: User IDs are different');
        console.log('   SuperAdmin ID:', authState1.user_id);
        console.log('   Doctor ID:', authState2.user_id);
      } else {
        console.log('❌ SESSION ISOLATION FAILED: User IDs are the same');
        console.log('   Both have ID:', authState1.user_id);
      }
    } else {
      console.log('⚠️ Could not verify user IDs');
      console.log('   SuperAdmin session:', authState1 ? 'exists' : 'missing');
      console.log('   Doctor session:', authState2 ? 'exists' : 'missing');
    }

    // Check URL routing
    if (url.includes('/superadmin')) {
      console.log('❌ ROUTING BUG: Doctor redirected to /superadmin (seeing old user!)');
    } else if (url.includes('/dashboard')) {
      console.log('✅ ROUTING CORRECT: Doctor redirected to /dashboard');
    } else if (url.includes('/login')) {
      console.log('⚠️ STAYED ON LOGIN: Both logins may have failed to redirect');
      console.log('   But session user IDs show different users (auth is working)');
    } else {
      console.log('⚠️ UNEXPECTED URL:', url);
    }

    console.log('\n' + '='.repeat(60));
    console.log('TEST COMPLETE');
    console.log('='.repeat(60));

  } catch (error) {
    console.log('❌ TEST ERROR:', error.message);
    await page.screenshot({ path: '/tmp/auth_test_error.png' });
    console.log('Screenshot saved to /tmp/auth_test_error.png');
  } finally {
    await browser.close();
  }
}

runTest().catch(console.error);
