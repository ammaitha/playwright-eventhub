import { test, expect } from "../../fixtures/api-fixtures";
import { createUniqueBookingInput } from "../../testdata/booking-test-data";
import { createUniqueEventInput } from "../../testdata/event-test-data";
import { assertJsonSchema } from "../../api/helpers/schema-validator";
import {
  bookingErrorSchema,
  bookingSuccessResponseSchema,
  bookingsListResponseSchema,
} from "../../api/schemas/booking.schema";

test("creates, retrieves, lists, and cancels an API booking", async ({ events, bookings }) => {
  const eventInput = createUniqueEventInput();
  let eventId: number | undefined;
  let bookingId: number | undefined;
  let bookingReference: string | undefined;
  let bookingCancelled = false;

  try {
    const createdEvent = await events.createEvent(eventInput);
    expect(createdEvent.statusCode).toBe(201);
    expect(createdEvent.body?.success).toBe(true);
    if (!createdEvent.body?.success) {
      throw new Error("Could not create an event for the booking test.");
    }
    eventId = createdEvent.body.data.id;
    const startingSeats = createdEvent.body.data.availableSeats;

    const bookingInput = createUniqueBookingInput(eventId, 2);
    const createdBooking = await bookings.createBooking(bookingInput);
    expect(createdBooking.statusCode).toBe(201);
    expect(createdBooking.body?.success).toBe(true);
    if (!createdBooking.body?.success) {
      throw new Error("Booking creation did not return a booking.");
    }
    const booking = createdBooking.body.data;
    bookingId = booking.id;
    bookingReference = booking.bookingRef;
    expect(booking.status).toBe("confirmed");
    expect(booking.event.id).toBe(eventId);
    expect(booking.event.title).toBe(eventInput.title);
    expect(booking.quantity).toBe(bookingInput.quantity);
    expect(Number(booking.totalPrice)).toBe(Number(createdEvent.body.data.price) * booking.quantity);
    assertJsonSchema(bookingSuccessResponseSchema, createdBooking.body);

    const retrievedById = await bookings.getBookingById(bookingId);
    expect(retrievedById.statusCode).toBe(200);
    expect(retrievedById.body?.success).toBe(true);
    if (!retrievedById.body?.success) {
      throw new Error("Booking could not be retrieved by ID.");
    }
    expect(retrievedById.body.data.bookingRef).toBe(bookingReference);
    assertJsonSchema(bookingSuccessResponseSchema, retrievedById.body);

    const retrievedByReference = await bookings.getBookingByReference(bookingReference);
    expect(retrievedByReference.statusCode).toBe(200);
    expect(retrievedByReference.body?.success).toBe(true);
    if (!retrievedByReference.body?.success) {
      throw new Error("Booking could not be retrieved by reference.");
    }
    expect(retrievedByReference.body.data.id).toBe(bookingId);
    assertJsonSchema(bookingSuccessResponseSchema, retrievedByReference.body);

    const listed = await bookings.getBookings({
      eventId,
      status: "confirmed",
      page: 1,
      limit: 100,
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.body?.success).toBe(true);
    if (!listed.body?.success) {
      throw new Error("Bookings could not be listed.");
    }
    expect(listed.body.data.some((item) => item.id === bookingId)).toBe(true);
    assertJsonSchema(bookingsListResponseSchema, listed.body);

    const afterBooking = await events.getEventById(eventId);
    expect(afterBooking.statusCode).toBe(200);
    if (afterBooking.body?.success) {
      expect(afterBooking.body.data.availableSeats).toBe(startingSeats - booking.quantity);
    }

    const cancelled = await bookings.cancelBooking(bookingId);
    expect(cancelled.statusCode).toBe(200);
    expect(cancelled.body?.success).toBe(true);
    if (cancelled.body?.success) {
      expect(cancelled.body.message).toBe("Booking cancelled");
    }
    bookingCancelled = cancelled.statusCode === 200 && cancelled.body?.success === true;

    const removedById = await bookings.getBookingById(bookingId);
    expect(removedById.statusCode).toBe(404);
    expect(removedById.body?.success).toBe(false);
    const removedByReference = await bookings.getBookingByReference(bookingReference);
    expect(removedByReference.statusCode).toBe(404);
    expect(removedByReference.body?.success).toBe(false);

    const afterCancellation = await events.getEventById(eventId);
    expect(afterCancellation.statusCode).toBe(200);
    if (afterCancellation.body?.success) {
      expect(afterCancellation.body.data.availableSeats).toBe(startingSeats);
    }
  } finally {
    if (bookingId !== undefined && !bookingCancelled) {
      const cancellation = await bookings.cancelBooking(bookingId);
      if (cancellation.statusCode !== 200 || cancellation.body?.success !== true) {
        throw new Error(`Failed to cancel test booking ${bookingId}.`);
      }
    }
    if (eventId !== undefined) {
      const deletion = await events.deleteEvent(eventId);
      if (deletion.statusCode !== 200 || deletion.body?.success !== true) {
        throw new Error(`Failed to delete test event ${eventId}.`);
      }
    }
  }
});

test("rejects booking with a quantity below the documented minimum", async ({ events, bookings }) => {
  const createdEvent = await events.createEvent(createUniqueEventInput());
  expect(createdEvent.statusCode).toBe(201);
  expect(createdEvent.body?.success).toBe(true);
  if (!createdEvent.body?.success) {
    throw new Error("Could not create an event for the invalid booking test.");
  }

  const eventId = createdEvent.body.data.id;
  try {
    const invalidBooking = await bookings.createBooking({
      ...createUniqueBookingInput(eventId),
      quantity: 0,
    });
    expect(invalidBooking.statusCode).toBe(400);
    expect(invalidBooking.body?.success).toBe(false);
    assertJsonSchema(bookingErrorSchema, invalidBooking.body);
    if (invalidBooking.body?.success === false) {
      expect(invalidBooking.body.error).toBe("Validation failed");
      expect(invalidBooking.body.details?.some((detail) => detail.field === "quantity")).toBe(true);
    }
  } finally {
    const deletion = await events.deleteEvent(eventId);
    expect(deletion.statusCode).toBe(200);
    expect(deletion.body?.success).toBe(true);
  }
});

test("rejects a booking for an unknown event", async ({ bookings }) => {
  const response = await bookings.createBooking({
    ...createUniqueBookingInput(2147483647),
    quantity: 1,
  });

  expect(response.statusCode).toBe(404);
  expect(response.body?.success).toBe(false);
  assertJsonSchema(bookingErrorSchema, response.body);
});

test("returns not found for unknown booking lookups and cancellation", async ({ bookings }) => {
  const unknownId = 2147483647;

  const byId = await bookings.getBookingById(unknownId);
  expect(byId.statusCode).toBe(404);
  expect(byId.body?.success).toBe(false);

  const byReference = await bookings.getBookingByReference("EVT-XYZ123");
  expect(byReference.statusCode).toBe(404);
  expect(byReference.body?.success).toBe(false);

  const cancellation = await bookings.cancelBooking(unknownId);
  expect(cancellation.statusCode).toBe(404);
  expect(cancellation.body?.success).toBe(false);
});
