import { test, expect } from '@playwright/test';

test('verify pre-test questions and Q5 irregular polygon illustration', async ({ page }) => {
  await page.goto('http://localhost:4173');

  // Name entry
  await page.fill('input[type="text"]', 'Aiman');
  await page.click('button:has-text("LET\'S EXPLORE!")');

  // Home
  await page.click('button:has-text("START MY ADVENTURE")');

  // Loop through 10 pre-test questions
  for (let i = 1; i <= 10; i++) {
    await expect(page.locator(`text=Q${i}`)).toBeVisible();

    if (i === 5) {
      await expect(page.locator('text=Look at the polygon below. Is this a REGULAR or IRREGULAR polygon?')).toBeVisible();
      await page.screenshot({ path: '/home/jules/verification/q5_irregular_polygon.png' });
    }

    // Select an answer
    const option = page.locator('button:has(.w-6.h-6)').first();
    await option.click();

    if (i < 10) {
      await page.click('button:has-text("NEXT QUESTION")');
    } else {
      await page.click('button:has-text("FINISH TEST")');
    }
  }

  // Result modal
  await expect(page.locator('text=YOUR PRE-TEST RESULT')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/pretest_result_modal.png' });
});
