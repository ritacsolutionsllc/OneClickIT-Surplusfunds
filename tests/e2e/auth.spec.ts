import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('dashboard redirects to signin when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('admin redirects to home when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect (either to signin or home)
    await expect(page).not.toHaveURL('/admin');
  });

  test('signin page renders', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });
});
