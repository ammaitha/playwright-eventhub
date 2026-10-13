import { test as apiTest, expect } from "./api-fixtures";
import { CONSTANTS } from "../api/constants/constants";

export const test = apiTest.extend({
  page: async ({ page, authToken }, use) => {
    const origin = new URL(CONSTANTS.WEB_BASE_URL).origin;
    await page.addInitScript(
      ({ expectedOrigin, storageKey, token }) => {
        if (location.origin === expectedOrigin) {
          localStorage.setItem(storageKey, token);
        }
      },
      { expectedOrigin: origin, storageKey: CONSTANTS.AUTH_STORAGE_KEY, token: authToken },
    );
    await use(page);
  },
});

export { expect };
