import { test } from "../../fixtures/ui-only-fixtures";
import { BookingsPage } from "../../pages/bookings-page";

test("visitor can open the bookings page", async ({ page }) => {
  const bookingsPage = new BookingsPage(page);
  await bookingsPage.open();
  await bookingsPage.expectBookingsPageLoaded();
});
