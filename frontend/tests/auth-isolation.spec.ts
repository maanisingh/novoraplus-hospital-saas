import { test, expect } from '@playwright/test';

const BASE_URL = 'https://hospital.alexandratechlab.com';

// Test credentials
const SUPERADMIN = {
  email: 'admin@novoraplus.com',
  password: 'NovoraPlus@2024!',
  expectedRole: 'Administrator',
  expectedRedirect: '/superadmin',
};

const DOCTOR = {
  email: 'doctor@citygeneralhospital.com',
  password: 'Staff@2024!',
  expectedRole: 'Doctor',
  expectedRedirect: '/dashboard',
};

const NURSE = {
  email: 'nurse@citygeneralhospital.com',
  password: 'Staff@2024!',
  expectedRole: 'Nurse',
  expectedRedirect: '/dashboard',
};

test.describe('Authentication Session Isolation', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all cookies and storage before each test
    await context.clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('Login as SuperAdmin shows correct role', async ({ page }) => {
    await page.goto(BASE_URL + '/login');

    // Wait for page to load
    await page.waitForSelector('input[type="email"]');

    // Fill in credentials
    await page.fill('input[type="email"]', SUPERADMIN.email);
    await page.fill('input[type="password"]', SUPERADMIN.password);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL(`**${SUPERADMIN.expectedRedirect}**`, { timeout: 15000 });

    // Verify we're on the SuperAdmin dashboard
    expect(page.url()).toContain('/superadmin');

    console.log('✅ SuperAdmin login successful, redirected to /superadmin');
  });

  test('Login as Doctor shows correct role', async ({ page }) => {
    await page.goto(BASE_URL + '/login');

    // Wait for page to load
    await page.waitForSelector('input[type="email"]');

    // Fill in credentials
    await page.fill('input[type="email"]', DOCTOR.email);
    await page.fill('input[type="password"]', DOCTOR.password);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL(`**${DOCTOR.expectedRedirect}**`, { timeout: 15000 });

    // Verify we're on the dashboard (not superadmin)
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/superadmin');

    console.log('✅ Doctor login successful, redirected to /dashboard');
  });

  test('CRITICAL: Login SuperAdmin → Logout → Login Doctor → Should show Doctor not SuperAdmin', async ({ page }) => {
    // Step 1: Login as SuperAdmin
    console.log('Step 1: Login as SuperAdmin');
    await page.goto(BASE_URL + '/login');
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', SUPERADMIN.email);
    await page.fill('input[type="password"]', SUPERADMIN.password);
    await page.click('button[type="submit"]');

    // Wait for SuperAdmin redirect
    await page.waitForURL(`**${SUPERADMIN.expectedRedirect}**`, { timeout: 15000 });
    expect(page.url()).toContain('/superadmin');
    console.log('✅ Step 1 passed: SuperAdmin logged in, on /superadmin');

    // Step 2: Logout
    console.log('Step 2: Logout');
    // Find and click logout button (usually in navigation/header)
    const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Sign Out")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
    } else {
      // Try clicking user menu first
      const userMenu = page.locator('[aria-label="User menu"], button:has-text("admin")');
      if (await userMenu.count() > 0) {
        await userMenu.first().click();
        await page.click('button:has-text("Logout"), a:has-text("Logout")');
      } else {
        // Navigate directly to login (simulating logout via URL)
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        await page.goto(BASE_URL + '/login');
      }
    }

    // Wait for login page
    await page.waitForURL(`**/login**`, { timeout: 15000 });
    console.log('✅ Step 2 passed: Logged out, on /login');

    // Clear storage to be sure
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Step 3: Login as Doctor
    console.log('Step 3: Login as Doctor');
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', DOCTOR.email);
    await page.fill('input[type="password"]', DOCTOR.password);
    await page.click('button[type="submit"]');

    // Wait for Doctor redirect (should be /dashboard, NOT /superadmin)
    await page.waitForURL(`**/**`, { timeout: 15000 });

    // CRITICAL CHECK: Must be on /dashboard, NOT /superadmin
    const currentUrl = page.url();
    console.log('Final URL:', currentUrl);

    // This is the bug test - if fixed, Doctor should NOT be on /superadmin
    expect(currentUrl).not.toContain('/superadmin');
    expect(currentUrl).toContain('/dashboard');

    console.log('✅ Step 3 passed: Doctor logged in, on /dashboard (NOT /superadmin)');
    console.log('🎉 CRITICAL TEST PASSED: Session isolation is working!');
  });

  test('CRITICAL: Multiple user switches maintain correct sessions', async ({ page }) => {
    // This test verifies back-and-forth switching works

    // 1. Login as Doctor
    console.log('1. Login as Doctor');
    await page.goto(BASE_URL + '/login');
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', DOCTOR.email);
    await page.fill('input[type="password"]', DOCTOR.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/dashboard**`, { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');
    console.log('✅ Doctor on /dashboard');

    // 2. Logout (clear everything and navigate)
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(BASE_URL + '/login');
    await page.waitForSelector('input[type="email"]');

    // 3. Login as SuperAdmin
    console.log('2. Login as SuperAdmin');
    await page.fill('input[type="email"]', SUPERADMIN.email);
    await page.fill('input[type="password"]', SUPERADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/superadmin**`, { timeout: 15000 });
    expect(page.url()).toContain('/superadmin');
    console.log('✅ SuperAdmin on /superadmin');

    // 4. Logout again
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(BASE_URL + '/login');
    await page.waitForSelector('input[type="email"]');

    // 5. Login as Nurse
    console.log('3. Login as Nurse');
    await page.fill('input[type="email"]', NURSE.email);
    await page.fill('input[type="password"]', NURSE.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/dashboard**`, { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/superadmin');
    console.log('✅ Nurse on /dashboard (NOT /superadmin)');

    console.log('🎉 Multiple switch test PASSED!');
  });

  test('Quick login buttons work with session isolation', async ({ page }) => {
    // Test that the quick demo login buttons also work correctly

    // 1. Use quick login for SuperAdmin
    console.log('1. Quick login as SuperAdmin');
    await page.goto(BASE_URL + '/login');
    await page.waitForSelector('button:has-text("Login as SuperAdmin")');
    await page.click('button:has-text("Login as SuperAdmin")');
    await page.waitForURL(`**/superadmin**`, { timeout: 15000 });
    expect(page.url()).toContain('/superadmin');
    console.log('✅ Quick login SuperAdmin → /superadmin');

    // 2. Logout
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(BASE_URL + '/login');
    await page.waitForSelector('button:has-text("Login as Doctor")');

    // 3. Use quick login for Doctor
    console.log('2. Quick login as Doctor');
    await page.click('button:has-text("Login as Doctor")');
    await page.waitForURL(`**/dashboard**`, { timeout: 15000 });

    // CRITICAL: Doctor should NOT be on superadmin
    expect(page.url()).not.toContain('/superadmin');
    expect(page.url()).toContain('/dashboard');
    console.log('✅ Quick login Doctor → /dashboard (NOT /superadmin)');

    console.log('🎉 Quick login session isolation test PASSED!');
  });
});
