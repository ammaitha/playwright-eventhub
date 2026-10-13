import { test, expect } from "../../fixtures/api-authenticated-ui-fixtures";
import { CONSTANTS } from "../../api/constants/constants";

test("opens bookings with the API-authenticated browser session", async ({ page }) => {
  await page.goto(`${CONSTANTS.WEB_BASE_URL}/bookings`);

  await expect(page).toHaveURL(`${CONSTANTS.WEB_BASE_URL}/bookings`);
  await expect(page.getByRole("heading", { name: "My Bookings", exact: true })).toBeVisible();
});
