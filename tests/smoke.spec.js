const { test, expect } = require('@playwright/test');
const { captureRuntimeErrors, assertNoRuntimeErrors, assertLocalAssetsAndLinks, assertResponsive } = require('./helpers');

test('site navigation, local assets, and internal links stay healthy', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto('/');
  await expect(page.locator('nav')).toBeVisible();
  await page.locator('nav a[href="fighters.html"]').click();
  await expect(page).toHaveURL(/fighters\.html$/);
  await expect(page.locator('.realm-flip-card')).toHaveCount(8);
  await assertLocalAssetsAndLinks(page);
  await assertNoRuntimeErrors(errors);
});

test('fighter cards reveal one profile at a time and return to the front', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto('/fighters.html');
  const cards = page.locator('.realm-flip-card');
  await cards.nth(0).click();
  await expect(cards.nth(0)).toHaveClass(/is-flipped/);
  await expect(cards.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await cards.nth(1).click();
  await expect(cards.nth(0)).not.toHaveClass(/is-flipped/);
  await expect(cards.nth(1)).toHaveClass(/is-flipped/);
  await cards.nth(1).click();
  await expect(cards.nth(1)).not.toHaveClass(/is-flipped/);
  await assertNoRuntimeErrors(errors);
});

test('Grand Prix filter handles unverified editions and restores the full roster', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto('/fighters.html');
  const cards = page.locator('.realm-flip-card');
  await page.locator('#gpRosterFilter').selectOption('gp-1');
  await expect(cards).toHaveCount(8);
  await expect(page.locator('#gpRosterEmpty')).toBeVisible();
  await expect(cards.first()).toBeHidden();
  await page.locator('#gpRosterFilter').selectOption('all');
  await expect(page.locator('#gpRosterEmpty')).toBeHidden();
  await expect(cards.first()).toBeVisible();
  await assertNoRuntimeErrors(errors);
});

test('fighter page fits a mobile viewport', async ({ page }) => {
  await assertResponsive(page, '/fighters.html');
  await expect(page.locator('.realm-roster-grid')).toBeVisible();
});
