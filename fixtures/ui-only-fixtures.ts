import { test as base, expect } from "@playwright/test";
import { CONSTANTS } from "../api/constants/constants";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto(CONSTANTS.LOGIN_URL);
    await page.getByRole("textbox", { name: "Email" }).fill(CONSTANTS.EMAIL);
    await page.getByRole("textbox", { name: "Password" }).fill(CONSTANTS.PASSWORD);
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page).not.toHaveURL(/\/login(?:\?.*)?$/);
    await use(page);
  },
});

export { expect };
