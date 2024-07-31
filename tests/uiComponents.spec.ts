import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });
  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the grid'}).getByRole('textbox', {name: "Email"})

    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500})

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue()
    expect(inputValue).toEqual('test2@test.com')

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')

  });
  test('radio buttons', async ({ page }) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the grid'})

    // await usingTheGridForm.getByRole('radio', {name: 'Radio 1'}).check({force: true})
    await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check()
    const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
    expect(radioStatus).toBeTruthy()

    await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

    await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check()
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
  })


});

test('checkboxes', async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
  await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})

  const allBoxes = page.getByRole('checkbox')

  for(const box of await allBoxes.all()) {
    await box.check({force: true})
    expect(await box.isChecked()).toBeTruthy()
  }
  for(const box of await allBoxes.all()) {
    await box.uncheck({force: true})
    expect(await box.isChecked()).toBeFalsy()
  }
})

test('listbox or selects', async ({ page }) => {
  const dropdownMenu = page.locator('ngx-header nb-select')
  await dropdownMenu.click()

  page.getByRole('list') // when the list has a UL tag
  page.getByRole('listitem') // when the list has a IL tag

  // const optionList = page.getByRole('list).locator('nb-option')

  const optionList = page.locator('nb-option-list nb-option')
  await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
  await optionList.filter({hasText: 'Cosmic'}).click()

  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  const colors = {
    'Light': 'rgb(255, 255, 255)',
    'Dark': 'rgb(34, 43, 69)',
    'Cosmic': 'rgb(50, 50, 89)',
    'Corporate': 'rgb(255, 255, 255)'
  }

  await dropdownMenu.click()
  for(const color in colors) {
    await optionList.filter({hasText: color}).click()
    await expect(header).toHaveCSS('background-color', colors[color])

    if(color != "Corporate") {
      await dropdownMenu.click()
    }
  }
})


test('tooltips', async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const tooltipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
  await tooltipCard.getByRole('button', {name: 'Top'}).hover()

  page.getByRole('tooltip') //if you have a role tooltip created
  const tooltip = await page.locator('nb-tooltip').textContent()

  expect(tooltip).toEqual('This is a tooltip')

})