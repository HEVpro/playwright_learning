import { expect, request } from "@playwright/test";
import fs from "fs";
import user from "./.auth/user.json";
const authFile = ".auth/user.json";

async function globalSetup() {

  const context = await request.newContext();

  const responseToken = await context.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: {
          email: "hector@test.com",
          password: "12345678",
        },
      },
    }
  );
  const responseBody = await responseToken.json();
  const accessToken = responseBody.user.token;
  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user, null, 2));

  process.env["ACCESS_TOKEN"] = accessToken;

  const articleResponse = await context.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Global Mock Article",
          description: "Things",
          body: "This is a mock article",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${process.env["ACCESS_TOKEN"]}`,
      },
    }
  );
  expect(articleResponse.status()).toBe(201);
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;

  process.env["SLUGID"] = slugId;
}

export default globalSetup;
