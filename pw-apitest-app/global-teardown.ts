import { expect, request } from "@playwright/test";

async function globalTeardown() {
  const context = await request.newContext();
  const deleteArticleRequest = await context.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${process.env["SLUGID"]}`, 
    {
        headers: {
            Authorization: `Token ${process.env["ACCESS_TOKEN"]}`
        }
    }
  );

  expect(deleteArticleRequest.status()).toBe(204);
}

export default globalTeardown;
