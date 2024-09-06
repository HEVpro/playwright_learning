import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastPage();
  await pm.navigateTo().tooltipPage();
});

test("parametrized methods", async ({ page }) => {
  const pm = new PageManager(page);

  const fullName = faker.person.fullName();
  const email = faker.internet.email();

  await pm.navigateTo().formLayoutPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentials(email, "test123", "Option 1");
  // Screenshot method 1
  await page.screenshot({ path: "screenshots/formLayoutsPage.png" })
  const buffer = await page.screenshot()
  console.log(buffer.toString('base64'))
  await pm
    .onFormLayoutsPage()
    .submitInlineFormWithEmailAndCheckbox(fullName, email, true);
  // Screenshot method 2
  await page.locator("nb-card", {
    hasText: "Inline Form",
  }).screenshot({ path: "screenshots/inlineForm.png" });
  await pm.navigateTo().datePickerPage();
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10);
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15);
});
