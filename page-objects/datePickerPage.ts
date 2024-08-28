import { expect, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const dateToAssert = await this.selectDateFromCalendar(numberOfDaysFromToday)
      
        // Click the first of the current month, NOT DYNAMIC
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(numberOfDaysFromToday: number, endDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const dateToAssertStart = await this.selectDateFromCalendar(numberOfDaysFromToday)
        const dateToAssertEnd = await this.selectDateFromCalendar(endDaysFromToday)

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`

        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateFromCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
      
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
          await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
          calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).first().click()
        return dateToAssert
    }
}