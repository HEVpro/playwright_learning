import { test as setup, expect } from "@playwright/test";

setup("delete article", async ({ request }) => {
  const deleteArticleRequest = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${process.env["SLUGID"]}`
  );

  expect(deleteArticleRequest.status()).toBe(204);
});
