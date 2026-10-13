import { test, expect } from "../../fixtures/api-fixtures";
import { createUniqueEventInput } from "../../testdata/event-test-data";
import { assertJsonSchema } from "../../api/helpers/schema-validator";
import {
  eventErrorSchema,
  eventSuccessResponseSchema,
  eventsListResponseSchema,
} from "../../api/schemas/event.schema";

test("lists events with the documented event and pagination fields", async ({ events }) => {
  const response = await events.getEvents();

  expect(response.statusCode).toBe(200);
  expect(response.body?.success).toBe(true);
  assertJsonSchema(eventsListResponseSchema, response.body);

  for (const event of response.body!.data) {
    expect(event.id).toEqual(expect.any(Number));
    expect(event.title).toEqual(expect.any(String));
    expect(event.category).toEqual(expect.any(String));
    expect(event.venue).toEqual(expect.any(String));
    expect(event.city).toEqual(expect.any(String));
    expect(new Date(event.eventDate).toString()).not.toBe("Invalid Date");
    expect(Number(event.price)).toEqual(expect.any(Number));
    expect(event.totalSeats).toEqual(expect.any(Number));
    expect(event.availableSeats).toBeLessThanOrEqual(event.totalSeats);
  }
});

test("creates, retrieves, updates, and deletes an event", async ({ events }) => {
  const input = createUniqueEventInput();
  let eventId: number | undefined;
  let eventDeleted = false;

  try {
    const created = await events.createEvent(input);
    expect(created.statusCode).toBe(201);
    expect(created.body?.success).toBe(true);
    if (!created.body?.success) {
      throw new Error("Event creation did not return an event.");
    }
    eventId = created.body.data.id;
    expect(created.body.data.title).toBe(input.title);
    expect(created.body.data.totalSeats).toBe(input.totalSeats);
    expect(Number(created.body.data.price)).toBe(input.price);
    assertJsonSchema(eventSuccessResponseSchema, created.body);

    const retrieved = await events.getEventById(eventId);
    expect(retrieved.statusCode).toBe(200);
    expect(retrieved.body?.success).toBe(true);
    if (!retrieved.body?.success) {
      throw new Error("Created event could not be retrieved.");
    }
    expect(retrieved.body.data.title).toBe(input.title);
    assertJsonSchema(eventSuccessResponseSchema, retrieved.body);

    const updatedTitle = `${input.title} updated`;
    const updated = await events.updateEvent(eventId, { ...input, title: updatedTitle });
    expect(updated.statusCode).toBe(200);
    expect(updated.body?.success).toBe(true);
    if (!updated.body?.success) {
      throw new Error("Created event could not be updated.");
    }
    expect(updated.body.data.title).toBe(updatedTitle);

    const deleted = await events.deleteEvent(eventId);
    expect(deleted.statusCode).toBe(200);
    expect(deleted.body?.success).toBe(true);
    eventDeleted = deleted.statusCode === 200 && deleted.body?.success === true;

    const missing = await events.getEventById(eventId);
    expect(missing.statusCode).toBe(404);
    expect(missing.body?.success).toBe(false);
  } finally {
    if (eventId !== undefined && !eventDeleted) {
      const cleanup = await events.deleteEvent(eventId);
      if (cleanup.statusCode !== 200 || cleanup.body?.success !== true) {
        throw new Error(`Failed to clean up test event ${eventId}.`);
      }
    }
  }
});

test("rejects event creation when a required title is missing", async ({ events }) => {
  const { title: _title, ...missingTitle } = createUniqueEventInput();
  const response = await events.createEvent(missingTitle);

  expect(response.statusCode).toBe(400);
  expect(response.body?.success).toBe(false);
  assertJsonSchema(eventErrorSchema, response.body);
  if (response.body?.success === false) {
    expect(response.body.error).toBe("Validation failed");
    expect(response.body.details?.some((detail) => detail.field === "title")).toBe(true);
  }
});

test("returns not found for an unknown event identifier", async ({ events }) => {
  const unknownId = 2147483647;

  const response = await events.getEventById(unknownId);

  expect(response.statusCode).toBe(404);
  expect(response.body?.success).toBe(false);
});
