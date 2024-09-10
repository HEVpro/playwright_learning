import { test } from "../test-options";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastPage();
  await pm.navigateTo().tooltipPage();
});

test("parametrized methods", async ({ pageManager }) => {
  const fullName = faker.person.fullName();
  const email = faker.internet.email();

  await pageManager
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentials(email, "test123", "Option 1");
  await pageManager
    .onFormLayoutsPage()
    .submitInlineFormWithEmailAndCheckbox(fullName, email, true);
});
