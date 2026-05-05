import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Entretien JB/);
  await expect(page.locator('body')).toBeVisible();
});

test('navigation is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toBeVisible();
});

test('hero section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero')).toBeVisible();
});

test('contact form is present', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('form')).toBeVisible();
});
