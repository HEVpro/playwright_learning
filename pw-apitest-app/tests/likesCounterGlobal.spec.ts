import { test, expect } from "@playwright/test";

test("Likes counter increase global", async ({ page }) => {
    await page.goto("https://conduit.bondaracademy.com")
    await page.getByText('Global Feed').click()
    const firstLikeButton = await page.locator('app-article-preview').first().locator('button')

    await firstLikeButton.click()
    await expect(firstLikeButton).toHaveText('1')

});

