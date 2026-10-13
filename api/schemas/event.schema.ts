import type { AnySchema } from "ajv";

export const eventRecordSchema: AnySchema = {
  type: "object",
  required: [
    "id",
    "title",
    "category",
    "venue",
    "city",
    "eventDate",
    "price",
    "totalSeats",
    "availableSeats",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    venue: { type: "string" },
    city: { type: "string" },
    eventDate: { type: "string", format: "date-time" },
    price: { anyOf: [{ type: "number" }, { type: "string", pattern: "^\\d+(\\.\\d+)?$" }] },
    totalSeats: { type: "integer", minimum: 1 },
    availableSeats: { type: "integer", minimum: 0 },
    imageUrl: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    isStatic: { type: "boolean" },
    userId: { type: ["integer", "null"] },
  },
  additionalProperties: true,
};

export const eventErrorSchema: AnySchema = {
  type: "object",
  required: ["success", "error"],
  properties: {
    success: { const: false },
    error: { type: "string" },
    details: {
      type: "array",
      items: {
        type: "object",
        required: ["field", "message"],
        properties: {
          field: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
  additionalProperties: true,
};

export const eventSuccessResponseSchema: AnySchema = {
  type: "object",
  required: ["success", "data"],
  properties: {
    success: { const: true },
    data: eventRecordSchema,
    message: { type: "string" },
  },
  additionalProperties: true,
};

export const eventsListResponseSchema: AnySchema = {
  type: "object",
  required: ["success", "data", "pagination"],
  properties: {
    success: { const: true },
    data: { type: "array", items: eventRecordSchema },
    pagination: {
      type: "object",
      required: ["total", "page", "limit", "totalPages"],
      properties: {
        total: { type: "integer", minimum: 0 },
        page: { type: "integer", minimum: 1 },
        limit: { type: "integer", minimum: 1 },
        totalPages: { type: "integer", minimum: 0 },
      },
    },
  },
  additionalProperties: true,
};
