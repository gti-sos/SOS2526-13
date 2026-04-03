// @ts-check
import { test, expect } from '@playwright/test';

let app = 'http://localhost:3000/military-stats';

test('has title', async ({ page }) => {
  await page.goto(app);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Military Stats/);
});