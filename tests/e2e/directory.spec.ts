import { test, expect } from '@playwright/test';

test.describe('Directory page', () => {
  test('loads county table', async ({ page }) => {
    await page.goto('/directory');
    await expect(page.getByRole('heading', { name: /County Directory/i })).toBeVisible();
    // Table should have header row
    await expect(page.getByRole('columnheader', { name: 'County' })).toBeVisible();
  });

  test('state filter updates URL', async ({ page }) => {
    await page.goto('/directory');
    await page.getByRole('combobox').filter({ hasText: 'All states' }).selectOption('CA');
    await expect(page).toHaveURL(/state=CA/);
  });

  test('search filter works', async ({ page }) => {
    await page.goto('/directory?q=Alpine');
    await expect(page.getByRole('link', { name: 'Alpine' })).toBeVisible();
  });
});
