import { test, expect } from "../../fixtures/ui-only-fixtures";
import { createUniqueBookingCustomer } from "../../testdata/booking-test-data";
import { EventsPage } from "../../pages/events-page";

test("visitor can browse an event and prepare its booking form", async ({ page }) => {
  const eventsPage = new EventsPage(page);
  await eventsPage.open();
  await expect(page.getByRole("heading", { name: "Upcoming Events", exact: true })).toBeVisible();

  const eventTitle = await eventsPage.openFirstEvent();
  await expect(page).toHaveURL(/\/events\/\d+$/);
  await expect(page.getByRole("heading", { level: 1, name: eventTitle, exact: true })).toBeVisible();
  await eventsPage.expectBookingFormVisible();

  const customer = createUniqueBookingCustomer();
  await eventsPage.fillBookingCustomer(customer);
  await expect(page.getByRole("textbox", { name: "Full Name*" })).toHaveValue(customer.customerName);
  await expect(page.getByRole("textbox", { name: "Email*" })).toHaveValue(customer.customerEmail);
  await expect(page.getByRole("textbox", { name: "Phone Number*" })).toHaveValue(customer.customerPhone);
  await eventsPage.increaseAndRestoreTicketQuantity();
});
