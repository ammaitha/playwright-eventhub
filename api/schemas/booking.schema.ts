import type { AnySchema } from "ajv";
import { eventRecordSchema } from "./event.schema";

export const bookingRecordSchema: AnySchema = {
  type: "object",
  required: [
    "id",
    "eventId",
    "customerName",
    "customerEmail",
    "customerPhone",
    "quantity",
    "totalPrice",
    "status",
    "bookingRef",
    "createdAt",
    "updatedAt",
    "event",
  ],
  properties: {
    id: { type: "integer" },
    eventId: { type: "integer" },
    customerName: { type: "string", minLength: 2 },
    customerEmail: { type: "string", format: "email" },
    customerPhone: { type: "string", minLength: 10 },
    quantity: { type: "integer", minimum: 1, maximum: 10 },
    totalPrice: { anyOf: [{ type: "number" }, { type: "string", pattern: "^\\d+(\\.\\d+)?$" }] },
    status: { enum: ["confirmed", "cancelled"] },
    bookingRef: { type: "string", minLength: 1 },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    event: eventRecordSchema,
  },
  additionalProperties: true,
};

export const bookingErrorSchema: AnySchema = {
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

export const bookingSuccessResponseSchema: AnySchema = {
  type: "object",
  required: ["success", "data"],
  properties: {
    success: { const: true },
    data: bookingRecordSchema,
    message: { type: "string" },
  },
  additionalProperties: true,
};

export const bookingsListResponseSchema: AnySchema = {
  type: "object",
  required: ["success", "data", "pagination"],
  properties: {
    success: { const: true },
    data: { type: "array", items: bookingRecordSchema },
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
