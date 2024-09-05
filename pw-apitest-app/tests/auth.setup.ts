import { test as setup, expect } from "@playwright/test";
import user from "../.auth/user.json";
import fs from "fs";

const authFile = ".auth/user.json";
const baseUrl = "https://conduit.bondaracademy.com";

setup("authentication", async ({ page, request }) => {
  const response = await request.post(
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
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;
  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user, null, 2));

  process.env['ACCESS_TOKEN'] = accessToken;
});
