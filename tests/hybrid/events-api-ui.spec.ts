import { test, expect } from "../../fixtures/api-authenticated-ui-fixtures";
import { createUniqueEventInput } from "../../testdata/event-test-data";
import { EventsPage } from "../../pages/events-page";

test("shows an API-created event in the authenticated UI", async ({ events, page }) => {
  const input = createUniqueEventInput();
  const created = await events.createEvent(input);

  expect(created.statusCode).toBe(201);
  expect(created.body?.success).toBe(true);
  if (!created.body?.success) {
    throw new Error("Event creation did not return an event.");
  }

  const event = created.body.data;
  try {
    expect(event.title).toBe(input.title);
    const eventsPage = new EventsPage(page);
    await eventsPage.open();
    await expect(page).toHaveURL(/\/events(?:\?.*)?$/);
    await eventsPage.expectEventVisible(event);
  } finally {
    const deleted = await events.deleteEvent(event.id);
    expect(deleted.statusCode).toBe(200);
    expect(deleted.body?.success).toBe(true);
  }
});
