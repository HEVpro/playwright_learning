import { test as setup, expect } from "@playwright/test";

setup("create new article", async ({ request }) => {
  const articleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Mock Article",
          description: "Things",
          body: "This is a mock article",
          tagList: [],
        },
      },
    }
  );
  expect(articleResponse.status()).toBe(201);
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;

  process.env["SLUGID"] = slugId;
});
