import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
  });

test('navigate to form page', async ({ page }) => {
  const pm = new PageManager(page);

    await pm.navigateTo().formLayoutPage();
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastPage();
    await pm.navigateTo().tooltipPage();
});

test('parametrized methods', async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutPage();
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentials('test@test.com', 'test123', 'Option 1');
  await pm.onFormLayoutsPage().submitInlineFormWithEmailAndCheckbox('John Doe', 'john@doe.com', true);
  await pm.navigateTo().datePickerPage();
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10);
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15);
});

