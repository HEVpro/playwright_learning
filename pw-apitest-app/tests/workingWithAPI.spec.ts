import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

const baseUrl = 'https://conduit.bondaracademy.com';
const apiUrl = 'https://conduit-api.bondaracademy.com';

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/tags', async (route, request) => {
    await route.fulfill({
      body: JSON.stringify(tags)
    });
  });
  await page.goto(baseUrl);
  // await page.getByText('Sign in').click();
  // await page.getByRole('textbox', { name: 'Email' }).fill('hector@test.com');
  // await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
  // await page.getByRole('button', { name: 'Sign in' }).click();
});

test('has title', async ({ page }) => {
  await page.route('**/*/api/articles*', async (route, request) => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = 'Hector Article';
    responseBody.articles[0].description = 'API Test Article Body description MOCK';
    await route.fulfill({
      body: JSON.stringify(responseBody)
    });
  });
  await page.getByText('Global Feed').click();
  // Expect a title "to contain" a substring.
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('Hector Article');
  await expect(page.locator('app-article-list p').first()).toContainText('API Test Article Body description MOCK');
});

test('delete article', async ({ page, request }) => {
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Mock Article",
        "description": "Things",
        "body": "This is a mock article",
        "tagList": []
      }
    },
  });
  expect(articleResponse.status()).toBe(201);

  await page.getByText('Global Feed').click();
  await page.getByText('Mock Article').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).not.toContainText('Mock Article');
});

test('create article', async ({ page, request }) => {

  await page.getByText('New Article').click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('API Article');
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('About article');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('API Article Description');
  await page.getByRole('button', {name: 'Publish Article'}).click();

  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText('API Article')
  
  await page.getByText('Home').click()
  
  await expect(page.locator('app-article-list h1').first()).toContainText('API Article')

  const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`);

  expect(deleteArticleRequest.status()).toBe(204);

});

