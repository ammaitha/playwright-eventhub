import { test, expect } from "../../fixtures/api-authenticated-ui-fixtures";
import { createUniqueBookingInput } from "../../testdata/booking-test-data";
import { createUniqueEventInput } from "../../testdata/event-test-data";
import { assertJsonSchema } from "../../api/helpers/schema-validator";
import { bookingSuccessResponseSchema } from "../../api/schemas/booking.schema";
import { BookingsPage } from "../../pages/bookings-page";

test("shows an API-created booking in the authenticated UI", async ({ events, bookings, page }) => {
  const createdEvent = await events.createEvent(createUniqueEventInput());
  expect(createdEvent.statusCode).toBe(201);
  expect(createdEvent.body?.success).toBe(true);
  if (!createdEvent.body?.success) {
    throw new Error("Could not create an event for the UI booking test.");
  }

  const eventId = createdEvent.body.data.id;
  let bookingId: number | undefined;
  try {
    const bookingInput = createUniqueBookingInput(eventId, 2);
    const createdBooking = await bookings.createBooking(bookingInput);
    expect(createdBooking.statusCode).toBe(201);
    expect(createdBooking.body?.success).toBe(true);
    if (!createdBooking.body?.success) {
      throw new Error("Booking creation did not return a booking.");
    }
    const booking = createdBooking.body.data;
    bookingId = booking.id;
    expect(booking.status).toBe("confirmed");
    expect(booking.event.title).toBe(createdEvent.body.data.title);
    assertJsonSchema(bookingSuccessResponseSchema, createdBooking.body);

    const bookingsPage = new BookingsPage(page);
    await bookingsPage.open();
    await expect(page).toHaveURL(/\/bookings$/);
    await bookingsPage.expectBookingVisible(booking);
  } finally {
    if (bookingId !== undefined) {
      const cancellation = await bookings.cancelBooking(bookingId);
      expect(cancellation.statusCode).toBe(200);
      expect(cancellation.body?.success).toBe(true);
    }
    const deletion = await events.deleteEvent(eventId);
    expect(deletion.statusCode).toBe(200);
    expect(deletion.body?.success).toBe(true);
  }
});
