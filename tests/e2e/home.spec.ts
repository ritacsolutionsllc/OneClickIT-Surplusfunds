import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows search bar', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Surplus Funds/);
    await expect(page.getByRole('heading', { name: /Find Surplus Funds/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search counties/i)).toBeVisible();
  });

  test('search navigates to directory', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder(/Search counties/i).fill('Alpine');
    await page.getByPlaceholder(/Search counties/i).press('Enter');
    await expect(page).toHaveURL(/\/directory\?q=Alpine/);
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Directory/i }).first().click();
    await expect(page).toHaveURL('/directory');
  });
});
