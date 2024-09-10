import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

test('Location syntax rules', async ({page}) => {
   //by tag name
   page.locator('input')

   //by id
   page.locator('#inputEmail')

   //by class
   page.locator('.shape-rectangle')

   //by attribute
   page.locator('[placeholder="Email]')

   //by class value
   page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

   //combine different selectors
   page.locator('input[placeholder="Email"].shape-rectangle')

   //by xpath
   page.locator('//*[@id="inputEmail"]')

   //by partial text math
   page.locator(':text("Using")')

   //by exact match
   page.locator(':text-is("Using the Grid')

})
