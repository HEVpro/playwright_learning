import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

test('Location syntax rules', async ({page}) => {
   //by tag name
   await page.locator('input').first().click();

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

test('User facing locators', async ({page}) => {
  // by role
    await page.getByRole('textbox', {name: 'Email'}).first().click();
    await page.getByRole('button', {name: 'Sign in'}).first().click();

  // by label
  await page.getByLabel('Email').first().click();
  await page.getByPlaceholder('Jane Doe').first().click();

  await page.getByTestId('SignIn').first().click();
})

test('Locating child elements', async ({page}) => {
  // Two make the same but writed different
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click();

  //The childs starts by 0, so this is the 4th child
  await page.locator('nb-card').nth(3).getByRole('button').click();  
})

test('Locating parent elements', async ({page}) => {
  await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).click();

  await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: 'Email'}).click();

  await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).click();
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).click();

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('checkbox', {name: 'Email'}).click();

  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click();
})

test('Reusing the locators', async ({page}) => {
  const basicForm = await page.locator('nb-card').filter({hasText: 'Basic form'})
  const emailField = await basicForm.getByRole('textbox', {name: 'Email'})

  await emailField.fill('test@test.com');
  await basicForm.getByRole('textbox', {name: 'Password'}).fill('12345678');
  await basicForm.locator('nb-checkbox').click();
  await basicForm.getByRole('button').click();

  await expect(emailField).toHaveValue('test@test.com');
})

test('Extracting values', async ({page}) => {
  // single test value
  const basicForm = await page.locator('nb-card').filter({hasText: 'Basic form'})
  const buttonText = await basicForm.locator('button').textContent();
  
  await expect(buttonText).toEqual('Submit');

  // multiple test values
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
  await expect(allRadioButtonsLabels).toContain('Option 1');

  // input value
  const emailField = await basicForm.getByRole('textbox', {name: 'Email'})
  await emailField.fill('test@test.com');
  const emailValue = await emailField.inputValue();
  await expect(emailValue).toEqual('test@test.com');


  //attribute value
  const placeHolderValue = await emailField.getAttribute('placeholder');
  await expect(placeHolderValue).toEqual('Email');

})

test('Assertions', async ({page}) => {
  const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button')
  // General assertions
  const value = 5
  expect(value).toEqual(5);

  const text = await basicFormButton.textContent();
  await expect(text).toEqual('Submit');

  //Locator assertion
  await expect(basicFormButton).toHaveText('Submit');

  //Soft assertion
  await expect.soft(basicFormButton).toHaveText('Submit2');
  await basicFormButton.click();
})